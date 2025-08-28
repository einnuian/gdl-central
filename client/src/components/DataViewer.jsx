import React, { useState, useMemo, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import BWRFlowsheet from './print_templates/BWRFlowsheet';
import BWSFlowsheet from './print_templates/BWSFlowsheet';

const DataViewer = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [printTemplates, setPrintTemplates] = useState({});
  const printRef = useRef();

  // Define the specific columns you want to display
  const displayColumns = useMemo(() => [
    "Status",
    "Patient Number", 
    "Gender",
    "Test Requested",
    "Date Received",
    "Date Due",
    "Actions",
  ], []);

  // Filter headers to only show the specified columns
  const filteredHeaders = useMemo(() => {
    return data.headers.filter(header => displayColumns.includes(header));
  }, [data.headers, displayColumns]);

  const filteredActive = useMemo(() => {
    // Only include active samples (Status is not 'c' and Patient Number is not empty)
    const existingSamples = data.data.filter(row => {
      const statusEmpty = !row['Status'] || row['Status'].trim().toLowerCase() !== 'c';
      const patientNotEmpty = row['Patient Number'] && row['Patient Number'].trim() !== '';
      return statusEmpty && patientNotEmpty;
    })
    if (!searchTerm) return existingSamples;

    return existingSamples.filter(row =>
      Object.values(row).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data.data, searchTerm]);

  const totalSamples = useMemo(() => {
    // Count all samples with non-empty Patient Number
    return data.data.filter(row => row['Patient Number'] && row['Patient Number'].trim() !== '').length;
  }, [data.data]);

  const completedSamples = useMemo(() => {
    // Count all completed samples
    return data.data.filter(row => row['Status'].toLowerCase() === 'c').length;
  }, [data.data]);

  const reviewingSamples = useMemo(() => {
    // Count all samples under review
    return data.data.filter(row => row['Status'].toLowerCase() === 's').length;
  }, [data.data]);

  const totalPages = Math.ceil(filteredActive.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredActive.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleTemplateChange = (patientNumber, template) => {
    setPrintTemplates(prev => ({
      ...prev,
      [patientNumber]: template
    }));
  };

  // Print handler: opens the PDF in a new tab
  const handlePrint = (printData) => {
    fetch('/api/fill-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(printData)
    })
    .then(res => res.blob())
    .then(blob => {
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, '_blank');
    });
  };

  const renderPrintTemplate = (patient) => {
    if (!patient) return null;
    
    const template = printTemplates[patient['Patient Number']] || 'bwr';
    const flowsheetProps = { data, patient };
    
    switch (template) {
      case 'bws':
        return <BWSFlowsheet {...flowsheetProps} />;
      case 'bwr':
        return <BWRFlowsheet {...flowsheetProps} />;
      default:
        return <BWRFlowsheet {...flowsheetProps} />;
    }
  };

  if (!data || !data.data || data.data.length === 0) {
    return <div className="text-center p-10 text-gray-500 italic">No data available to display.</div>;
  }

  return (
    <div className="max-w-full overflow-x-auto">
      <h2 className="text-2xl text-gray-800 mb-8">Data Preview</h2>
      
      <div className="flex gap-5 mb-8 flex-wrap">
        <div className="bg-gray-50 px-5 py-4 rounded-lg border-l-4 border-indigo-400">
          <div className="text-sm text-gray-600 mb-1">Total Samples</div>
          <div className="text-2xl font-semibold text-gray-800">{totalSamples}</div>
        </div>
        <div className="bg-gray-50 px-5 py-4 rounded-lg border-l-4 border-indigo-400">
          <div className="text-sm text-gray-600 mb-1">Completed</div>
          <div className="text-2xl font-semibold text-gray-800">{completedSamples}</div>
        </div>
        <div className="bg-gray-50 px-5 py-4 rounded-lg border-l-4 border-indigo-400">
          <div className="text-sm text-gray-600 mb-1">Under Reviewed</div>
          <div className="text-2xl font-semibold text-gray-800">{reviewingSamples}</div>
        </div>
        <div className="bg-gray-50 px-5 py-4 rounded-lg border-l-4 border-indigo-400">
          <div className="text-sm text-gray-600 mb-1">Pending</div>
          <div className="text-2xl font-semibold text-gray-800">{filteredActive.length}</div>
        </div>
      </div>

      <div className="flex gap-4 mb-6 flex-wrap items-center">
        <input
          type="text"
          placeholder="Search in all columns..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 border-2 border-gray-200 rounded-lg text-base min-w-[250px] focus:outline-none focus:border-indigo-400"
        />
        <div>
          Showing {startIndex + 1}-{Math.min(endIndex, filteredActive.length)} of {filteredActive.length} results
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-5">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-200 rounded bg-white hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 border border-gray-200 rounded ${currentPage === page ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white hover:bg-gray-50'}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-200 rounded bg-white hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      <div className="border border-gray-200 rounded-lg overflow-hidden shadow mb-8 mt-4">
        <table className="w-full border-collapse bg-white">
          <thead>
            <tr>
              {filteredHeaders.map((header, index) => (
                <th key={index} className="bg-gray-50 px-4 py-3 text-left font-semibold text-gray-800 border-b-2 border-gray-200 sticky top-0 z-10">{header}</th>
              ))}
              <th className="bg-gray-50 px-4 py-3 text-left font-semibold text-gray-800 border-b-2 border-gray-200 sticky top-0 z-10">Print</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {filteredHeaders.map((header, colIndex) => (
                  <td key={colIndex} className="px-4 py-3 border-b border-gray-200 text-gray-700">{row[header] || ''}</td>
                ))}
                <td className="px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <select
                      value={printTemplates[row['Patient Number']] || 'bwr'}
                      onChange={e => handleTemplateChange(row['Patient Number'], e.target.value)}
                      className="px-2 py-1 border rounded bg-white text-sm"
                    >
                      <option value="bws">BWS Flowsheet</option>
                      <option value="bwr">BWR Flowsheet</option>
                    </select>
                    <button
                      onClick={() => handlePrint(row)}
                      className="bg-indigo-500 text-white px-3 py-1 rounded text-sm hover:bg-indigo-600"
                    >
                      Print
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-5">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-gray-200 rounded bg-white hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 border border-gray-200 rounded ${currentPage === page ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-white hover:bg-gray-50'}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-gray-200 rounded bg-white hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DataViewer;