import { degrees, fill, rgb } from "pdf-lib";

// Process the data and fills the PDF with the report data
export async function fillReport(reportPDF, reportData) {

    fillSampleInfo(reportPDF, reportData);

    fillMethylData(reportPDF, reportData);

    fillUPD7Data(reportPDF, reportData);

    fillArrayData(reportPDF, reportData);

    fillCDKN1CData(reportPDF, reportData);
}

function fillSampleInfo(reportPDF, reportData) {
    const reportSampleInfo = [
      { text: reportData['Patient Number'], x: 120, y: 704},
      { text: reportData['Tech'], x: 370, y: 704},
      { text: reportData['Date Received'], x: 150, y: 677},
      //{ text: new Date().toLocaleDateString('en-US'), x: 390, y: 677},
      { text: reportData['Isolation 2'], x: 410, y: 576},
      { text: 'X', size: 16, x: 153, y: 83},
    ]

    const sampleType = reportData['Sample Type'].toLowerCase();
    if (sampleType.includes('dna')) {
        reportSampleInfo.push({ text: '', x: 180, y: 576});
    }
    else {
        reportSampleInfo.push({ text: reportData['Isolation 1'], x: 180, y: 576});
    }

    const page = reportPDF.getPages()[0];

    circleSampleType(reportPDF, reportData['Sample Type'].toLowerCase());
    
    reportSampleInfo.forEach(({ text, x, y , size}) => {
        page.drawText(text || 'N/A', {
            x,
            y,
            size: size || 12,
            color: rgb(0, 0, 0)
        });
    });
}

function fillMethylData(reportPDF, reportData) {
    const methylResult = reportData['Methyl Result'].toLowerCase();
    const test = reportData['Test Requested'].toLowerCase();

    let icr1 = {text: 'Normal', x: 494, y: 422};
    let icr2 = {text: 'Normal', x: 494, y: 460};
    if (test.includes('methyl')) {
        if (methylResult !== 'normal') {
            if (methylResult.includes('lom icr1')) {               
                icr1.text = 'Loss of Methylation';
                icr1.x = 463;
            }
            else if (methylResult.includes('gom icr1')) {
                icr1.text = 'Gain of Methylation';
                icr1.x = 463;
            }
            if (methylResult.includes('lom icr2')) {
                icr2.text = 'Loss of Methylation';
                icr2.x = 463;
            }
            else if (methylResult.includes('gom icr2')) {
                icr2.text = 'Gain of Methylation';
                icr2.x = 463;
            }
        }
    }
    else {
        icr1.text = '';
        icr2.text = '';
    }

    const reportMethylFields = [
        icr1, icr2
    ]

    const page = reportPDF.getPages()[0];
    reportMethylFields.forEach(({ text, x, y , size}) => {
        page.drawText(text || 'N/A', {
            x,
            y,
            size: size || 12,
            color: rgb(0, 0, 0)
        });
    });
}

function fillUPD7Data(reportPDF, reportData) {
    const methylResult = reportData['Methyl Result'].toLowerCase();
    const upd7Result = reportData['UPD7 Result'].toLowerCase();
    const test = reportData['Test Requested'].toLowerCase();

    let peg = {text: 'Normal', x: 494, y: 343};
    let grb = {text: 'Normal', x: 494, y: 381};
    if (upd7Result !== 'normal') {
        if (upd7Result.includes('lom peg')) {               
            peg.text = 'Loss of Methylation';
            peg.x = 463;
        }
        else if (upd7Result.includes('gom peg')) {
            peg.text = 'Gain of Methylation';
            peg.x = 463;
        }
        if (upd7Result.includes('lom grb')) {
            grb.text = 'Loss of Methylation';
            grb.x = 463;
        }
        else if (upd7Result.includes('gom grb')) {
            grb.text = 'Gain of Methylation';
            grb.x = 463;
        }
    }
    if (test.includes('methyl') && methylResult !== 'normal') {
        peg.text = '';
        grb.text = '';
    }

    const reportMethylFields = [
        peg, grb
    ]

    const page = reportPDF.getPages()[0];
    reportMethylFields.forEach(({ text, x, y , size}) => {
        page.drawText(text || 'N/A', {
            x,
            y,
            size: size || 12,
            color: rgb(0, 0, 0)
        });
    });
}

function fillArrayData(reportPDF, reportData) {
    const test = reportData['Test Requested'].toLowerCase();
    let reportArrayFields = [];

    const page = reportPDF.getPages()[0];
    
    if (test.includes('array')) {
        reportArrayFields.push({ text: 'X', x: 99, y: 245, size: 16 });
    }
    else {
        reportArrayFields.push({ text: 'X', x: 150, y: 245, size: 16 });
        reportArrayFields.push({ text: 'N/A', x: 365, y: 291});
        reportArrayFields.push({ text: 'N/A', x: 389, y: 257, rotate: degrees(-11) });
        page.drawLine({
            start: {x: 194, y: 284},
            end: {x: 581, y: 225},
            thickness: 2,
            color: rgb(0, 0, 0)
        });
    }

    reportArrayFields.forEach(({ text, x, y , size, rotate}) => {
        page.drawText(text || 'N/A', {
            x,
            y,
            size: size || 12,
            rotate: rotate || degrees(0),
            color: rgb(0, 0, 0)
        });
    });
}

function fillCDKN1CData(reportPDF, reportData) {
    const test = reportData['Test Requested'].toLowerCase();
    const methylResult = reportData['Methyl Result'].toLowerCase();

    const page = reportPDF.getPages()[0];

    let reportCDKN1CFields = [{ text: reportData['PCR Date'], x: 365, y: 183}];
    if (test.includes('cdkn1c')) {
        // 'X' on YES box
        reportCDKN1CFields.push({ text: 'X', x: 100, y: 137, size: 16 });
        // N/A line and 'X' on not performed box
        if (test.includes('methyl') && !methylResult.includes('normal')) {
            reportCDKN1CFields.push({ text: 'N/A', x: 389, y: 149, rotate: degrees(-11) });
            reportCDKN1CFields.push({ text: 'X', x: 202, y: 124, size: 16 });
            page.drawLine({
                start: {x: 194, y: 176},
                end: {x: 581, y: 115},
                thickness: 2,
                color: rgb(0, 0, 0)
            });
        }
    }
    else {
        // 'X' on NO box
        reportCDKN1CFields.push({ text: 'X', x: 154, y: 137, size: 16 });
        reportCDKN1CFields.push({ text: 'N/A', x: 389, y: 149, rotate: degrees(-11) });
        page.drawLine({
                start: {x: 194, y: 176},
                end: {x: 581, y: 115},
                thickness: 2,
                color: rgb(0, 0, 0)
        });
    }

    reportCDKN1CFields.forEach(({ text, x, y , size, rotate}) => {
        page.drawText(text || 'N/A', {
            x,
            y,
            size: size || 12,
            rotate: rotate || degrees(0),
            color: rgb(0, 0, 0)
        });
    });
}

// Draw a circle around the sample type
function circleSampleType(reportPDF, sampleType) {
    const page = reportPDF.getPages()[0];

    if (sampleType === 'blood') {
        page.drawEllipse({
            x: 169,           // center x
            y: 626,           // center y
            xScale: 20,       // horizontal radius
            yScale: 10,       // vertical radius
            borderColor: rgb(0, 0, 0),
            borderWidth: 2
        });
    }
    else if (sampleType === 'sent dna') {
        page.drawEllipse({
            x: 222,
            y: 626,
            xScale: 30,
            yScale: 10,
            borderColor: rgb(0, 0, 0),
            borderWidth: 2
        })
    }
    else if (sampleType.includes('amnio')) {
        page.drawEllipse({
            x: 372,
            y: 626,
            xScale: 25,
            yScale: 10,
            borderColor: rgb(0, 0, 0),
            borderWidth: 2
        })
    }
    else {
        return;
    }
}