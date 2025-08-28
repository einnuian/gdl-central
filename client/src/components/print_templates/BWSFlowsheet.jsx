import React from 'react';
import styled from 'styled-components';

// Move all styled components outside the component to prevent recreation
const DocumentContainer = styled.div`
  max-width: 8.5in;
  margin: 0 auto;
  padding: 0.5in;
  background: white;
  font-family: 'Calibri', sans-serif;
  line-height: 1.15;
  color: #333;
  font-size: 11pt;
  
  @media print {
    padding: 0.5in;
    max-width: none;
    font-size: 11pt;
  }
`;

const Title = styled.h1`
  font-size: 16pt;
  text-align: center;
  margin: 0 0 20px 0;
  font-weight: normal;
  line-height: 1.15;
`;

const HeaderSection = styled.div`
  margin-bottom: 20px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 12pt;
  line-height: 1.15;
`;

const Label = styled.span`
  font-weight: bold;
  margin-right: 10px;
  white-space: nowrap;
`;

const Underline = styled.span`
  border-bottom: 1px solid #333;
  display: inline-block;
  min-width: 200px;
  margin-left: 5px;
  margin-right: 20px;
`;

const TabSpace = styled.span`
  display: inline-block;
  width: 100px;
`;

const SampleTypeSection = styled.div`
  margin: 20px 0;
  font-size: 12pt;
  line-height: 1.15;
`;

const SampleTypeRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;

const SampleTypeOption = styled.span`
  margin-right: 30px;
  display: inline-flex;
  align-items: center;
`;

const SubText = styled.div`
  font-size: 10pt;
  margin-left: 1in;
  text-indent: 0.5in;
  margin-top: 5px;
`;

const IsolationSection = styled.div`
  margin: 20px 0;
  font-size: 12pt;
  line-height: 1.15;
`;

const ResultsSection = styled.div`
  margin: 30px 0;
`;

const ResultsTitle = styled.h2`
  font-size: 18pt;
  margin: 0 0 20px 0;
  line-height: 1.15;
`;

const TestSection = styled.div`
  margin: 20px 0;
  font-size: 13pt;
  line-height: 1.15;
`;

const TestHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  font-weight: bold;
`;

const StartDate = styled.span`
  margin-left: auto;
  font-weight: bold;
`;

const DateUnderline = styled.span`
  border-bottom: 1px solid #333;
  display: inline-block;
  min-width: 150px;
  margin-left: 5px;
`;

const ResultsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  border: 1px solid #333;
`;

const TableHeader = styled.th`
  border: 1px solid #333;
  padding: 8px;
  text-align: center;
  font-weight: bold;
  font-size: 13pt;
  background: #ffffffff;
`;

const TableCell = styled.td`
  border: 1px solid #333;
  padding: 8px;
  text-align: center;
  vertical-align: middle;
  height: 38px;
`;

const RequestTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 15px 0;
  border: 1px solid #333;
`;

const RequestCell = styled.td`
  border: 1px solid #333;
  padding: 8px;
  vertical-align: top;
  height: 52px;
`;

const CheckboxOption = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 0;
  font-size: 12pt;
`;

const WingdingsCheckbox = styled.span`
  font-family: 'Wingdings';
  font-size: 20pt;
  margin: 0 5px;
  color: ${props => props.checked ? '#333' : '#ccc'};
`;

const PassSection = styled.div`
  margin: 30px 0;
  font-size: 14pt;
  font-weight: bold;
  line-height: 1.15;
`;

const NoteSection = styled.div`
  margin: 20px 0;
  font-size: 10pt;
  line-height: 1.15;
`;

const UnderlinedText = styled.span`
  text-decoration: underline;
`;

// Memoize the component to prevent unnecessary re-renders
const BWSFlowsheet = React.memo(({ data }) => {
  // Extract the first row of data as patient information
  const patient = data && data.data && data.data.length > 0 ? data.data[0] : {};

  // Helper function to determine if a sample type is selected
  const getSampleType = React.useCallback(() => {
    const sampleType = patient["Sample Type"] || "";
    return {
      blood: sampleType.toLowerCase().includes('blood'),
      sentDNA: sampleType.toLowerCase().includes('dna'),
      cvs: sampleType.toLowerCase().includes('cvs'),
      amnio: sampleType.toLowerCase().includes('amnio'),
      other: !['blood', 'dna', 'cvs', 'amnio'].some(type => sampleType.toLowerCase().includes(type))
    };
  }, [patient["Sample Type"]]);

  const sampleTypes = getSampleType();

  const today = new Date().toLocaleDateString('en-US')

  return (
    <DocumentContainer>
      <Title>FLOW SHEET FOR BWS REPORTS</Title>

      <HeaderSection>
        <HeaderRow>
          <Label>ID#:</Label>
          <Underline>{patient["Patient Number"] || ""}</Underline>
          <TabSpace></TabSpace>
          <Label>Technician Name:</Label>
          <Underline>{patient["Tech"] || ""}</Underline>
        </HeaderRow>

        <HeaderRow>
          <Label>Date Rec'D:</Label>
          <Underline>{patient["Date Received"] || ""}</Underline>
          <TabSpace></TabSpace>
          <Label>Ready for Review Date:</Label>
          <Underline>{today}</Underline>
        </HeaderRow>
      </HeaderSection>

      <SampleTypeSection>
        <SampleTypeRow>
          <Label>Sample Type:</Label>
          <TabSpace></TabSpace>
          <SampleTypeOption>
            Blood
          </SampleTypeOption>
          <SampleTypeOption>
            Sent DNA
          </SampleTypeOption>
          <SampleTypeOption>
            CVS
          </SampleTypeOption>
          <SampleTypeOption>
            Amnio
          </SampleTypeOption>
          <SampleTypeOption>
            <Label>Other:</Label>
            <Underline style={{minWidth: '100px'}}>{sampleTypes.other ? patient["Sample Type"] : ""}</Underline>
          </SampleTypeOption>
        </SampleTypeRow>
        <SubText>Direct or cultured</SubText>
        <SubText>Direct or cultured</SubText>
      </SampleTypeSection>

      <IsolationSection>
        <HeaderRow>
          <Label>First Isolation Date:</Label>
          <Underline>{sampleTypes.sentDNA ? "" : (patient["Isolation 1"] || "")}</Underline>
          <TabSpace></TabSpace>
          <TabSpace></TabSpace>
          <Label>Second Isolation Date:</Label>
          <Underline>{patient["Isolation 2"] || "N/A"}</Underline>
        </HeaderRow>
      </IsolationSection>

      <ResultsSection>
        <ResultsTitle>Results:</ResultsTitle>
      </ResultsSection>

      <TestSection>
        <TestHeader>
          <Label>Methylation:</Label>
          <TabSpace></TabSpace>
          <TabSpace></TabSpace>
          <TabSpace></TabSpace>
          <TabSpace></TabSpace>
          <TabSpace></TabSpace>
          <StartDate>Start Date:</StartDate>
          <DateUnderline></DateUnderline>
        </TestHeader>

        <ResultsTable>
          <thead>
            <tr>
              <TableHeader style={{width: '81.9pt'}}></TableHeader>
              <TableHeader style={{width: '130.5pt'}}>Patient Values</TableHeader>
              <TableHeader style={{width: '130.5pt'}}>Normal Values</TableHeader>
              <TableHeader style={{width: '2.25in'}}>Summary</TableHeader>
            </tr>
          </thead>
          <tbody>
            <tr>
              <TableCell style={{fontWeight: 'bold', fontSize: '14pt'}}>ICR2</TableCell>
              <TableCell>{patient["Methyl Result"] || ""}</TableCell>
              <TableCell>50.00 ±</TableCell>
              <TableCell></TableCell>
            </tr>
            <tr>
              <TableCell style={{fontWeight: 'bold', fontSize: '14pt'}}>ICR1</TableCell>
              <TableCell>{patient["UPD7 Result"] || ""}</TableCell>
              <TableCell>50.00 ±</TableCell>
              <TableCell></TableCell>
            </tr>
          </tbody>
        </ResultsTable>
      </TestSection>

      <TestSection>
        <TestHeader>
          <Label>Array CGH:</Label>
          <TabSpace></TabSpace>
          <TabSpace></TabSpace>
          <TabSpace></TabSpace>
          <TabSpace></TabSpace>
          <TabSpace></TabSpace>
          <StartDate>Start Date:</StartDate>
          <DateUnderline></DateUnderline>
        </TestHeader>

        <RequestTable>
          <tbody>
            <tr>
              <RequestCell style={{width: '126.9pt'}}>
                <div style={{marginBottom: '6px', fontSize: '12pt'}}>Requested?</div>
                <CheckboxOption>
                  YES: <WingdingsCheckbox checked={patient["Test Requested"]?.toLowerCase().includes('array')}>☐</WingdingsCheckbox>
                </CheckboxOption>
                <CheckboxOption>
                  NO: <WingdingsCheckbox checked={!patient["Test Requested"]?.toLowerCase().includes('array')}>☐</WingdingsCheckbox>
                </CheckboxOption>
              </RequestCell>
              <RequestCell style={{width: '387.9pt'}}>
                <div style={{fontSize: '12pt'}}>Result:</div>
              </RequestCell>
            </tr>
          </tbody>
        </RequestTable>
      </TestSection>

      <TestSection>
        <TestHeader>
          <Label>CDKN1C Sequencing:</Label>
          <TabSpace></TabSpace>
          <TabSpace></TabSpace>
          <TabSpace></TabSpace>
          <TabSpace></TabSpace>
          <StartDate>Start Date:</StartDate>
          <DateUnderline>{patient["PCR Date"] || "N/A"}</DateUnderline>
        </TestHeader>

        <RequestTable>
          <tbody>
            <tr>
              <RequestCell style={{width: '126.9pt'}}>
                <div style={{marginBottom: '6px', fontSize: '12pt'}}>Requested?</div>
                <CheckboxOption>
                  YES: <WingdingsCheckbox checked={patient["Test Requested"]?.toLowerCase().includes('cdkn1c')}>☐</WingdingsCheckbox>
                </CheckboxOption>
                <CheckboxOption>
                  NO: <WingdingsCheckbox checked={!patient["Test Requested"]?.toLowerCase().includes('cdkn1c')}>☐</WingdingsCheckbox>
                </CheckboxOption>
              </RequestCell>
              <RequestCell style={{width: '387.9pt'}}>
                <div style={{fontSize: '12pt'}}>Result:</div>
                <div style={{marginTop: '10px'}}>
                  <WingdingsCheckbox checked={!patient["Methyl Result"]?.toLowerCase().includes('normal')}>☐</WingdingsCheckbox>
                  Not performed due to positive methylation result
                </div>
              </RequestCell>
            </tr>
          </tbody>
        </RequestTable>
      </TestSection>

      <PassSection>
        <div>Pass ID: YES <WingdingsCheckbox checked={true}>☐</WingdingsCheckbox></div>
      </PassSection>

      <NoteSection>
        <div>
          <Label>Note, <UnderlinedText>From Technician</UnderlinedText>, regarding result:</Label>
        </div>
        <div style={{marginTop: '20px', minHeight: '50px'}}>
          {patient["Status"] || ""}
        </div>
      </NoteSection>

    </DocumentContainer>
  );
});

BWSFlowsheet.displayName = 'BWSFlowsheet';

export default BWSFlowsheet; 