import React, { useState, useEffect } from 'react';

function Employees() {
  // State to store the list of employees
  const [employees, setEmployees] = useState([]);
  // State to handle loading status
  const [isLoading, setIsLoading] = useState(true);
  // State to handle any errors
  const [error, setError] = useState(null);

  // useEffect runs after the component mounts.
  // The empty array [] at the end means it only runs once.
  useEffect(() => {
    // Fetch data from your Flask backend API
    fetch('http://127.0.0.1:5000/api/employees')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setEmployees(data); // Save the fetched data to state
        setIsLoading(false); // Set loading to false
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        setError(error); // Save the error to state
        setIsLoading(false); // Set loading to false
      });
  }, []); // The empty dependency array ensures this effect runs only once

  // --- Render logic ---

  if (isLoading) {
    return <div className="p-4 text-center">Loading employee data...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Employee Directory</h1>
      <div className="shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-6 text-left">Emp. No</th>
              <th className="py-3 px-6 text-left">First Name</th>
              <th className="py-3 px-6 text-left">Last Name</th>
              <th className="py-3 px-6 text-left">Gender</th>
              <th className="py-3 px-6 text-left">Hire Date</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {employees.map(employee => (
              <tr key={employee.emp_no} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6">{employee.emp_no}</td>
                <td className="py-3 px-6">{employee.first_name}</td>
                <td className="py-3 px-6">{employee.last_name}</td>
                <td className="py-3 px-6">{employee.gender}</td>
                <td className="py-3 px-6">{employee.hire_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Employees;
