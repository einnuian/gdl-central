import React, { useState } from 'react';
import AutoSpreadsheetLoader from './components/AutoSpreadsheetLoader';
import DataViewer from './components/DataViewer';
import PrintDocument from './components/PrintDocument';

function App() {
  const [activeTab, setActiveTab] = useState('view');
  const [spreadsheetData, setSpreadsheetData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDataLoaded = (data) => {
    //console.log('Data loaded:', data);
    setSpreadsheetData(data);
    setError(null);
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setLoading(false);
  };

  const handleLoading = (isLoading) => {
    setLoading(isLoading);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 to-purple-600 p-5 font-sans">
      <header className="text-center mb-10 text-white">
        <h1 className="text-5xl mb-2 drop-shadow-md font-bold">📊 GDL Central</h1>
        <p className="text-lg opacity-90 m-0">BWR Reports from Tracker</p>
      </header>

      <main className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {!spreadsheetData ? (
          <div className="p-8 min-h-[500px]">
            <AutoSpreadsheetLoader 
              onDataLoaded={handleDataLoaded}
              onError={handleError}
              onLoading={handleLoading}
              loading={loading}
              error={error}
            />
          </div>
        ) : (
          <>
            <div className="flex bg-gray-50 border-b border-gray-200">
              <button
                className={`flex-1 py-4 px-6 font-semibold transition-all border-b-4 ${
                  activeTab === 'view'
                    ? 'bg-white text-indigo-500 border-indigo-400'
                    : 'bg-transparent text-gray-500 border-transparent hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('view')}
              >
                👁️ View Data
              </button>
              <button
                className={`flex-1 py-4 px-6 font-semibold transition-all border-b-4 ${
                  activeTab === 'print'
                    ? 'bg-white text-indigo-500 border-indigo-400'
                    : 'bg-transparent text-gray-500 border-transparent hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('print')}
              >
                🖨️ Print Report
              </button>
            </div>

            <div className="p-8 min-h-[500px]">
              {activeTab === 'view' && (
                <DataViewer data={spreadsheetData} />
              )}
              
              {activeTab === 'print' && (
                <PrintDocument data={spreadsheetData} />
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;