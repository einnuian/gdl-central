import React, { useState } from 'react';
import AutoSpreadsheetLoader from './components/AutoSpreadsheetLoader';
import DataViewer from './components/DataViewer';

function App() {
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
    <div className="min-h-screen bg-gradient-to-br from-brand-navy to-brand-blue p-5 font-sans">
      <header className="text-center mb-10 text-white">
        <h1 className="text-5xl mb-2 drop-shadow-md font-bold flex items-center justify-center gap-3">
            <img src="/pedigree_logo.png" alt="GDL logo" className="h-12 w-12 object-contain" />
            GDL Central
          </h1>
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
          <div className="p-8 min-h-[500px]">
            <DataViewer data={spreadsheetData} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;