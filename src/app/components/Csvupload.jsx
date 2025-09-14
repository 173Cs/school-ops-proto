import React, { useState} from 'react';

export const CSVUpload = ({ type, onUpload }) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setIsUploading(true);
      // Simulate file processing
      setTimeout(() => {
        setIsUploading(false);
        onUpload && onUpload(type, file.name);
        alert(`CSV uploaded successfully for ${type}`);
      }, 1500);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">Upload {type} CSV</h3>
      <div className="flex items-center">
        <label className="flex-1">
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileUpload}
            className="hidden" 
            id={`csv-upload-${type}`}
          />
          <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-200">
            {isUploading ? 'Uploading...' : 'Select CSV File'}
          </div>
        </label>
      </div>
    </div>
  );
};
