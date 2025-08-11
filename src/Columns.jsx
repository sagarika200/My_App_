import React, { useState, useEffect } from 'react';

function Columns() {
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // CORRECTED: The URL now correctly points to the endpoint for the 'employees' table.
    fetch('http://127.0.0.1:5000/api/tables/employees/columns')
      .then(response => {
        if (!response.ok) {
          // This will now throw a more specific error if the backend fails
          throw new Error('Network response was not ok. Check if the backend is running and the URL is correct.');
        }
        return response.json();
      })
      .then(data => {
        // If the backend sends an error message in a valid JSON response
        if (data.error) {
            throw new Error(data.error);
        }
        setColumns(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        setError(error);
        setIsLoading(false);
      });
  }, []); // The empty array [] means this effect runs only once.

  // Show a loading message while fetching data
  if (isLoading) {
    return <div className="p-4 text-center text-gray-400">Loading column names...</div>;
  }

  // Show an error message if the fetch failed
  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error.message}</div>;
  }

  // If data is loaded successfully, display it in a light-themed card
  return (
    <div className="p-4 sm:p-6 lg:p-8 mt-8 max-w-2xl mx-auto">
      <div className="bg-gray-100 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Columns in 'employees' Table</h2>
        <ul className="list-disc list-inside space-y-2">
          {columns.map(columnName => (
            <li key={columnName} className="text-gray-700">{columnName}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Columns;
