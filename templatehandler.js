export function renderTemplate(reportData) {
    if (reportData['Test Requested'].toLowerCase().includes('upd7')) {
        return 'templates/bwr-flowsheet-v2.pdf';
    }
    else {
        return 'templates/bws-flowsheet-v2.pdf';
    }
}