import { text } from "express";
import { degrees, fill, rgb } from "pdf-lib";

// Process the data and fills the PDF with the report data
export async function fillReport(reportPDF, reportData) {

    fillSampleInfo(reportPDF, reportData);

    fillMethylData(reportPDF, reportData);

    fillArrayData(reportPDF, reportData);

    fillCDKN1CData(reportPDF, reportData);
}

function fillSampleInfo(reportPDF, reportData) {
    const reportSampleInfo = [
      { text: reportData['Patient Number'], x: 120, y: 712},
      { text: reportData['Tech'], x: 370, y: 712},
      { text: reportData['Date Received'], x: 150, y: 686},
      //{ text: new Date().toLocaleDateString('en-US'), x: 390, y: 686},
      { text: reportData['Isolation 2'], x: 410, y: 585},
      { text: 'X', size: 16, x: 153, y: 147},
    ]

    const sampleType = reportData['Sample Type'].toLowerCase();
    if (sampleType.includes('dna')) {
        reportSampleInfo.push({ text: '', x: 180, y: 585});
    }
    else {
        reportSampleInfo.push({ text: reportData['Isolation 1'], x: 180, y: 585});
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

    let icr1 = {text: 'Normal', x: 470, y: 430};
    let icr2 = {text: 'Normal', x: 470, y: 468};
    if (test.includes('methyl')) {
        if (methylResult !== 'normal') {
            if (methylResult.includes('lom icr1')) {               
                icr1.text = 'Loss of Methylation';
                icr1.x = 440;
            }
            else if (methylResult.includes('gom icr1')) {
                icr1.text = 'Gain of Methylation';
                icr1.x = 440;
            }
            if (methylResult.includes('lom icr2')) {
                icr2.text = 'Loss of Methylation';
                icr2.x = 440;
            }
            else if (methylResult.includes('gom icr2')) {
                icr2.text = 'Gain of Methylation';
                icr2.x = 440;
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

function fillArrayData(reportPDF, reportData) {
    const test = reportData['Test Requested'].toLowerCase();
    let reportArrayFields = [];

    const page = reportPDF.getPages()[0];
    
    if (test.includes('array')) {
        reportArrayFields.push({ text: 'X', x: 99, y: 332, size: 16 });
    }
    else {
        reportArrayFields.push({ text: 'X', x: 150, y: 332, size: 16 });
        reportArrayFields.push({ text: 'N/A', x: 365, y: 378});
        reportArrayFields.push({ text: 'N/A', x: 389, y: 345, rotate: degrees(-11) });
        page.drawLine({
            start: {x: 194, y: 372},
            end: {x: 581, y: 312},
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

    let reportCDKN1CFields = [{ text: reportData['PCR Date'], x: 365, y: 270}];
    if (test.includes('cdkn1c')) {
        // 'X' on YES box
        reportCDKN1CFields.push({ text: 'X', x: 100, y: 224, size: 16 });
        // N/A line and 'X' on not performed box
        if (test.includes('methyl') && !methylResult.includes('normal')) {
            reportCDKN1CFields.push({ text: 'N/A', x: 389, y: 237, rotate: degrees(-11) });
            reportCDKN1CFields.push({ text: 'X', x: 202, y: 211, size: 16 });
            page.drawLine({
                start: {x: 194, y: 264},
                end: {x: 581, y: 202},
                thickness: 2,
                color: rgb(0, 0, 0)
            });
        }
    }
    else {
        // 'X' on NO box
        reportCDKN1CFields.push({ text: 'X', x: 154, y: 224, size: 16 });
        reportCDKN1CFields.push({ text: 'N/A', x: 389, y: 237, rotate: degrees(-11) });
        page.drawLine({
                start: {x: 194, y: 264},
                end: {x: 581, y: 202},
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
            y: 635,           // center y
            xScale: 20,       // horizontal radius
            yScale: 10,       // vertical radius
            borderColor: rgb(0, 0, 0),
            borderWidth: 2
        });
    }
    else if (sampleType === 'sent dna') {
        page.drawEllipse({
            x: 222,
            y: 635,
            xScale: 30,
            yScale: 10,
            borderColor: rgb(0, 0, 0),
            borderWidth: 2
        })
    }
    else if (sampleType.includes('amnio')) {
        page.drawEllipse({
            x: 372,
            y: 635,
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