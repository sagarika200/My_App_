import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/employees')
      .then(response => response.json())
      .then(data => {
        setEmployees(data);
        setIsLoading(false);
      })
      .catch(error => {
        setError(error);
        setIsLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB'); // Format as DD/MM/YYYY
  };

  if (isLoading) return <p className="text-center text-white text-xl mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-300 text-xl mt-10">Error: {error.message}</p>;

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/add')} 
          className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-300"
        >
          Add New Employee
        </button>
        <button 
          onClick={() => navigate('/columns')}
          className="bg-gray-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:bg-gray-800 transform hover:scale-105 transition-all duration-300"
        >
          View Columns
        </button>
      </div>

      <div className="w-full max-w-5xl overflow-hidden rounded-2xl shadow-2xl bg-white/20 backdrop-blur-lg">
        <table className="min-w-full text-white">
          <thead className="bg-black/30">
            <tr>
              <th className="py-3 px-4 text-left">Emp No</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Gender</th>
              <th className="py-3 px-4 text-left">Hire Date</th>
              <th className="py-3 px-4 text-left">Birth Date</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(employee => (
              <tr 
                key={employee.emp_no} 
                className="border-b border-white/20 hover:bg-white/10 transition-colors duration-200 cursor-pointer"
                onClick={() => navigate(`/employee/${employee.emp_no}`)}
              >
                <td className="py-3 px-4 text-cyan-300 font-bold hover:underline">
                  {employee.emp_no}
                </td>
                <td className="py-3 px-4 font-medium">{employee.first_name} {employee.last_name}</td>
                <td className="py-3 px-4">{employee.gender}</td>
                <td className="py-3 px-4">{formatDate(employee.hire_date)}</td>
                <td className="py-3 px-4">{formatDate(employee.birth_date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
