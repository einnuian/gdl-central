import React from 'react';

// Memoize the component to prevent unnecessary re-renders
const BWRFlowsheet = React.memo(({ data, patient }) => {
  // Use the provided patient or fallback to the first row
  const patientData = patient || (data && data.data && data.data.length > 0 ? data.data[0] : {});

  // Helper function to determine if a sample type is selected
  const getSampleType = React.useCallback(() => {
    const sampleType = patientData["Sample Type"] || "";
    return {
      blood: sampleType.toLowerCase().includes('blood'),
      sentDNA: sampleType.toLowerCase().includes('dna'),
      cvs: sampleType.toLowerCase().includes('cvs'),
      amnio: sampleType.toLowerCase().includes('amnio'),
      other: !['blood', 'dna', 'cvs', 'amnio'].some(type => sampleType.toLowerCase().includes(type))
    };
  }, [patientData["Sample Type"]]);

  const sampleTypes = getSampleType();

  const today = new Date().toLocaleDateString('en-US')

  function StaticCheckbox({ checked }) {
    return (
      <span
        className={`inline-flex items-end justify-center w-5 h-5 border-2 border-black ${
          checked ? 'bg-white text-black' : 'bg-white'
        }`}
        aria-hidden="true"
      >
        {checked && (
          <svg
            className="w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
    );
  }

  return (
    <div className="max-w-[8.5in] mx-auto p-[0.5in] bg-white font-calibri text-[11pt] text-black leading-[1.15] print:p-[0.5in] print:max-w-none print:text-[11pt]"
      style= {{ fontFamily: 'Calibri, sans-serif' }}>
      <h1 className="text-[16pt] text-center m-0 mb-5 font-normal leading-[1.15]">FLOW SHEET FOR BWS REPORTS</h1>

      {/* Header Section */}
      <div className="mb-5">
        <div className="flex items-end mb-2 text-[12pt] leading-[1.15]">
          <span className="font-bold whitespace-nowrap">ID#:</span>
          <span className="border-b border-black min-w-[200px] ml-1">{patientData["Patient Number"] || ""}</span>
          <span className="inline-block w-[100px]"></span>
          <span className="font-bold whitespace-nowrap">Technician Name:</span>
          <span className="border-b border-black min-w-[200px] ml-1">{patientData["Tech"] || ""}</span>
        </div>
        <div className="flex items-end mb-2 text-[12pt] leading-[1.15]">
          <span className="font-bold whitespace-nowrap">Date Rec'D:</span>
          <span className="border-b border-black min-w-[200px] ml-1">{patientData["Date Received"] || ""}</span>
          <span className="inline-block w-[100px]"></span>
          <span className="font-bold whitespace-nowrap">Ready for Review Date:</span>
          <span className="border-b border-black min-w-[200px] ml-1">{patient["Patient Number"] != null && today}</span>
        </div>
      </div>

      {/* Sample Type Section */}
      <div className="my-5 text-[12pt] leading-[1.15]">
        <div className="grid grid-cols-[auto_auto_auto_auto_1fr] gap-x-5 items-start">
          
          <div className="flex items-center">
            <span className="font-bold whitespace-nowrap">Sample Type:</span>
            <span className="ml-6">Blood</span>
          </div>

          <div>
            <span className="ml-6">Sent DNA</span>
          </div>

          <div className="text-center">
            <div>CVS</div>
            <div className="text-[10pt] mt-1">Direct or cultured</div>
          </div>

          <div className="text-center">
            <div>Amnio</div>
            <div className="text-[10pt] mt-1">Direct or cultured</div>
          </div>

          <div>
            <div className="inline-flex items-end">
              <div>Other:</div>
              <span className="border-b border-black min-w-[100px]"></span>
            </div>
          </div>
        </div>
      </div>


      {/* Isolation Section */}
      <div className="my-5 text-[12pt] leading-[1.15]">
        <div className="flex items-end mb-2">
          <span className="font-bold whitespace-nowrap">First Isolation Date:</span>
          <span className="border-b border-black min-w-[150px] ml-1">{patientData["Isolation 1"] || ""}</span>
          <span className="inline-block w-[200px]"></span>
          <span className="font-bold whitespace-nowrap">Second Isolation Date:</span>
          <span className="border-b border-black min-w-[150px] ml-1">{patientData["Isolation 2"] || ""}</span>
        </div>
      </div>

      {/* Results Section */}
      <div className="my-6">
        <h2 className="text-[18pt] m-0 mb-5 leading-[1.15]">Results:</h2>
      </div>

      {/* Test Section: Methylation */}
      <div className="my-5 text-[13pt] leading-[1.15]">
        <div className="flex items-end mb-1 font-bold">
          <span className="font-bold mr-2">Methylation:</span>
          <span className="inline-block w-[200px]"></span>
          <span className="font-bold">Start Date:</span>
          <span className="border-b border-black inline-block min-w-[150px] ml-1"></span>
        </div>
        <table className="w-full border border-black border-collapse my-1">
          <thead>
            <tr>
              <th className="border border-black px-2 py-2 text-center font-bold text-[13pt] bg-white-100" style={{width: '81.9pt'}}></th>
              <th className="border border-black px-2 py-2 text-center font-bold text-[13pt] bg-white-100" style={{width: '130.5pt'}}>Patient Values</th>
              <th className="border border-black px-2 py-2 text-center font-bold text-[13pt] bg-white-100" style={{width: '130.5pt'}}>Normal Values</th>
              <th className="border border-black px-2 py-2 text-center font-bold text-[13pt] bg-white-100" style={{width: '2.25in'}}>Summary</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black px-2 py-4 text-center font-bold text-[14pt]">ICR2</td>
              <td className="border border-black px-2 py-4 text-center"></td>
              <td className="border border-black px-2 py-4 text-left">50.00 ±</td>
              <td className="border border-black px-2 py-4 text-center">{patientData["Methyl Result"] || ""}</td>
            </tr>
            <tr>
              <td className="border border-black px-2 py-4 text-center font-bold text-[14pt]">ICR1</td>
              <td className="border border-black px-2 py-4 text-center"></td>
              <td className="border border-black px-2 py-4 text-left">50.00 ±</td>
              <td className="border border-black px-2 py-4 text-center">{patientData["Methyl Result"] || ""}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Test Section: Array CGH */}
      <div className="my-5 text-[13pt] leading-[1.15]">
        <div className="flex items-end mb-1 font-bold">
          <span className="font-bold mr-2 whitespace-nowrap">Array CGH:</span>
          <span className="inline-block w-[250px]"></span>
          <span className="font-bold whitespace-nowrap">Start Date:</span>
          <span className="border-b border-black inline-block min-w-[150px] ml-1"></span>
        </div>
        <table className="w-full border border-black border-collapse my-1">
          <tbody>
            <tr>
              <td className="border border-black px-2 py-1 align-top" style={{width: '126.9pt'}}>
                <div className="mb-1 text-[12pt]">Requested?</div>
                <div className="flex items-center space-x-6 text-[12pt] mt-5">
                  <div className="flex items-center space-x-2">
                    <span>YES:</span>
                    <StaticCheckbox checked={
                      patientData["Test Requested"] 
                      ? patientData["Test Requested"]?.toLowerCase().includes('array') : false}/>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>NO:</span>
                    <StaticCheckbox checked={
                      patientData["Test Requested"] 
                      ? !patientData["Test Requested"]?.toLowerCase().includes('array') : false}/>
                  </div>
                </div>
              </td>

              <td className="border border-black px-2 py-1 align-top" style={{width: '387.9pt'}}>
                <div className="text-[12pt] pb-15">Result:</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Test Section: CDKN1C Sequencing */}
      <div className="my-5 text-[13pt] leading-[1.15]">
        <div className="flex items-end">
          <span className="font-bold mr-2 whitespace-nowrap">CDKN1C Sequencing:</span>
          <span className="inline-block w-[170px]"></span>
          <span className="font-bold whitespace-nowrap">Start Date:</span>
          <span className="border-b border-black inline-block min-w-[150px] ml-1">{patientData["PCR Date"] || ""}</span>
        </div>
        <table className="w-full border border-black border-collapse my-1">
          <tbody>
            <tr>
              <td className="border border-black px-2 py-1 align-top" style={{width: '126.9pt'}}>
                <div className="mb-1 text-[12pt]">Requested?</div>
                <div className="flex items-end space-x-6 text-[12pt] mt-5">
                  <div className="flex items-end space-x-2">
                    <span>YES:</span>
                    <StaticCheckbox checked={
                      patientData["Test Requested"] 
                      ? patientData["Test Requested"]?.toLowerCase().includes('cdkn1c') : false}/>
                  </div>
                  <div className="flex items-end space-x-2">
                    <span>NO:</span>
                    <StaticCheckbox checked={
                      patientData["Test Requested"] 
                      ? !patientData["Test Requested"]?.toLowerCase().includes('cdkn1c') : false}/>
                  </div>
                </div>
              </td>
              <td className="border border-black px-2 py-1 align-top" style={{width: '387.9pt'}}>
                <div className="text-[12pt] pb-10">Result:</div>
                <div className="flex items-end space-x-3">
                  <StaticCheckbox checked={
                      patientData["Methyl Result"] 
                      ? !patientData["Methyl Result"]?.toLowerCase().includes('normal') : false}/>
                  <span>Not performed due to positive methylation result</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pass Section */}
      <div className="my-8 text-[14pt] font-bold leading-[1.15]">
        <div>Pass ID: YES <StaticCheckbox checked={patientData["Patient Number"] ? true : false}/></div>
      </div>

      {/* Note Section */}
      <div className="my-5 text-[10pt] leading-[1.15]">
        <div>
          <span className="font-bold mr-2">Note, <span className="underline">From Technician</span>, regarding result:</span>
        </div>
      </div>
    </div>
  );
});

BWRFlowsheet.displayName = 'BWRFlowsheet';

export default BWRFlowsheet;