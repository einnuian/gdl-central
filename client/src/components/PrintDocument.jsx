import React, { useState, useRef, useMemo, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import BWRFlowsheet from './print_templates/BWRFlowsheet';
import BWSFlowsheet from './print_templates/BWSFlowsheet';

const PrintDocument = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [template, setTemplate] = useState('bwr');
  const [documentSubtitle, setDocumentSubtitle] = useState('Generated from Google Spreadsheet');
  const printRef = useRef();

  // Find the patient by Patient Number (case-insensitive, trimmed)
  const selectedPatient = useMemo(() => {
    if (!searchTerm) return null;
    return data.data.find(
      row =>
        (row['Patient Number'] || '').toString().trim().toLowerCase() ===
        searchTerm.trim().toLowerCase()
    );
  }, [data.data, searchTerm]);

  //const handlePrint = useReactToPrint({
  //  contentRef: printRef,
  //  documentTitle: documentTitle,
  //});

  const handlePrint = () => {
    window.open('/api/fill-pdf', '_blank');
  }

  const renderTemplate = () => {
    const flowsheetProps = { data, patient: selectedPatient  || {}};
    switch (template) {
      case 'bws':
        return <BWSFlowsheet {...flowsheetProps} />;
      case 'bwr':
        return <BWRFlowsheet {...flowsheetProps} />;
      default:
        return <BWSFlowsheet {...flowsheetProps} />;
    }
  };

  return (
    <div className="max-w-full">
      <h2 className="text-2xl text-gray-800 mb-6">Print Report</h2>
      
      <div className="flex gap-4 mb-6 flex-wrap items-center p-5 bg-gray-50 rounded-lg">
        <div>
          <label className="block mb-1 font-semibold">Patient ID:</label>
          <input
            type="text"
            placeholder="Enter Patient Number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg text-base min-w-[250px] focus:outline-none focus:border-indigo-400"
          />
        </div>
        
        <div>
          <label className="block mb-1 font-semibold">Subtitle:</label>
          <input
            type="text"
            value={documentSubtitle}
            onChange={(e) => setDocumentSubtitle(e.target.value)}
            placeholder="Enter subtitle"
            className="px-4 py-2 border-2 border-gray-200 rounded-lg text-base focus:outline-none focus:border-indigo-400"
          />
        </div>
        
        <div>
          <label className="block mb-1 font-semibold">Template:</label>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 rounded-lg text-base bg-white focus:outline-none focus:border-indigo-400"
          >
            <option value="bws">BWS Flowsheet</option>
            <option value="bwr">BWR Flowsheet</option>
          </select>
        </div>
        
        <button
          onClick={handlePrint}
          className="bg-gradient-to-r from-indigo-400 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:shadow-lg transition"
        >
          🖨️ Print Report
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white mb-6">
        <div ref={printRef} className="p-10 bg-white min-h-[800px] print:p-5 print:min-h-0">
          <div>
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintDocument;