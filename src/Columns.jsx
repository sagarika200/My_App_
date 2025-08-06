import React, { useState, useEffect } from 'react';

function Columns() {
  const [columns, setColumns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This code runs when the component is first added to the page.
    // It fetches data from the /api/columns endpoint you created in your Python files.
    fetch('http://127.0.0.1:5000/api/columns')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setColumns(data); // Save the list of columns
        setIsLoading(false); // Stop showing the "Loading..." message
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        setError(error); // If there's an error, save it to be displayed
        setIsLoading(false);
      });
  }, []); // The empty array [] means this effect runs only once.

  // Show a loading message while fetching data
  if (isLoading) {
    return <div className="p-4">Loading column names...</div>;
  }

  // Show an error message if the fetch failed
  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  // If data is loaded successfully, display it
  return (
    <div className="p-4 sm:p-6 lg:p-8 mt-8">
      <h2 className="text-2xl font-bold mb-4">Columns in 'employees' Table</h2>
      <div className="bg-white shadow-md rounded-lg p-6">
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
