import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AutoSpreadsheetLoader = ({ onDataLoaded, onError, onLoading, loading, error }) => {
  const SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/1p2dkG_AFwZ299IIEqB0O3RNYf_sxm6y6HY_6rTvFywc/edit?gid=1497755029#gid=1497755029"
  const TARGET_SHEET_NAME = "BWR Patient Log";
  const [isLoaded, setIsLoaded] = useState(false);

  const extractSpreadsheetId = (url) => {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    return match ? match[1] : null;
  };

  const loadSpreadsheetData = async () => {
    const spreadsheetId = extractSpreadsheetId(SPREADSHEET_URL);
    if (!spreadsheetId) {
      onError('Invalid Google Sheets URL configuration.');
      return;
    }

    onLoading(true);
    onError(null);

    try {
      const range = `${TARGET_SHEET_NAME}!A:Z`;
      const response = await axios.get(`/api/spreadsheet/${spreadsheetId}`, {
        params: { range }
      });

      onDataLoaded(response.data);
      setIsLoaded(true);
    } catch (error) {
      console.error('Error fetching spreadsheet:', error);
      if (error.response?.data?.error) {
        onError(error.response.data.error);
      } else {
        onError(`Failed to fetch data from sheet "${TARGET_SHEET_NAME}". Please check the sheet name and make sure the spreadsheet is publicly accessible.`);
      }
    } finally {
      onLoading(false);
    }
  };

  useEffect(() => {
    // Automatically load the spreadsheet when component mounts
    loadSpreadsheetData();
  }, []);

  if (loading) {
    return (
      <div className="text-center max-w-xl mx-auto">
        <h2 className="text-2xl text-gray-800 mb-8">Loading Your Spreadsheet</h2>
        <div className="flex flex-col items-center gap-5 p-10">
          <div className="inline-block w-10 h-10 border-4 border-indigo-300 border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg m-0">Fetching data from Google Sheets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center max-w-xl mx-auto">
        <h2 className="text-2xl text-gray-800 mb-8">Error Loading Tracker Data</h2>
        <div className="bg-gray-50 p-5 rounded-lg mb-8 text-left">
          <h3 className="text-gray-800 mb-2 text-base font-semibold">Configured Spreadsheet</h3>
          <p className="text-gray-600 m-0 break-all font-mono text-sm">Oops!</p>
        </div>
        <div className="bg-red-50 text-red-700 p-5 rounded-lg border border-red-200 mt-5">{error}</div>
        <button 
          onClick={loadSpreadsheetData}
          className="bg-gradient-to-r from-indigo-400 to-purple-600 text-white border-none px-6 py-3 rounded-lg cursor-pointer mt-5 font-semibold shadow hover:shadow-lg transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (isLoaded) {
    return (
      <div className="text-center max-w-xl mx-auto">
        <h2 className="text-2xl text-gray-800 mb-8">Spreadsheet Loaded Successfully!</h2>
        <div className="bg-gray-50 p-5 rounded-lg mb-8 text-left">
          <h3 className="text-gray-800 mb-2 text-base font-semibold">Connected Spreadsheet:</h3>
          <p className="text-gray-600 m-0 break-all font-mono text-sm">{SPREADSHEET_URL}</p>
        </div>
        <div className="bg-green-50 text-green-700 p-5 rounded-lg border border-green-200 mt-5">
          Data from sheet "{TARGET_SHEET_NAME}" has been loaded successfully. You can now view and print your data using the tabs above.
        </div>
      </div>
    );
  }

  return null;
};

export default AutoSpreadsheetLoader;