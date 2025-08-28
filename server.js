const express = require('express');
const cors = require('cors');
const path = require('path');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const fs = require('fs');
const { PDFDocument, rgb } = require('pdf-lib');
const { renderTemplate } = require('./templatehandler');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client/build')));

// Google Sheets API setup
const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
})

//const auth = new google.auth.GoogleAuth({
//  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
//  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
//});

const sheets = google.sheets({ version: 'v4', auth });

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Get spreadsheet data
app.get('/api/spreadsheet/:spreadsheetId', async (req, res) => {
  try {
    const { spreadsheetId } = req.params;
    const { range = 'A:Z' } = req.query;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'No data found' });
    }

    // Convert to array of objects with headers
    const headers = rows[0];
    const data = rows.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    });

    res.json({
      headers,
      data,
      totalRows: data.length
    });
  } catch (error) {
    console.error('Error fetching spreadsheet data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch spreadsheet data',
      details: error.message 
    });
  }
});

// Get spreadsheet metadata
app.get('/api/spreadsheet/:spreadsheetId/metadata', async (req, res) => {
  try {
    const { spreadsheetId } = req.params;

    const response = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const sheets = response.data.sheets.map(sheet => ({
      title: sheet.properties.title,
      sheetId: sheet.properties.sheetId,
      gridProperties: sheet.properties.gridProperties
    }));

    res.json({
      title: response.data.properties.title,
      sheets
    });
  } catch (error) {
    console.error('Error fetching spreadsheet metadata:', error);
    res.status(500).json({ 
      error: 'Failed to fetch spreadsheet metadata',
      details: error.message 
    });
  }
});

app.post('/api/fill-pdf', async (req, res) => {
  try {
    const reportData = req.body;
    console.log('Received report data:', reportData);

    const templatePath = renderTemplate(reportData);

    const pdfPath = path.resolve(__dirname, templatePath);
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).send('PDF file not found');
    }

    // Read the PDF
    const existingPdfBytes = fs.readFileSync(pdfPath);

    // Load the PDF into pdf-lib
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    
    // Fill in the ID
    if (templatePath.includes('bws')) {
      const { fillReport } = require('./bwsfiller');
      await fillReport(pdfDoc, reportData);
    }
    else {
      const { fillReport } = require('./bwrfiller');
      await fillReport(pdfDoc, reportData);
    }

    // Save the modified PDF
    const pdfBytes = await pdfDoc.save();

    // Send PDf to browser
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="filled.pdf"');
    res.send(Buffer.from(pdfBytes));
  } catch (error) {
    console.error('Error filling PDF:', error);
    res.status(500).send('Failed to generate PDF');
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to use the application`);
  console.log(`Or access from other devices: [WSL2]${PORT}`);
});