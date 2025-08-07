import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddEmployee() {
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    birth_date: '',
    hire_date: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    fetch('http://127.0.0.1:5000/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeeData),
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) throw new Error(data.error);
      setMessage(`Employee added! ID: ${data.emp_no}`);
      setTimeout(() => navigate('/'), 2000);
    })
    .catch(err => setError(err.message));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white/20 backdrop-blur-sm p-8 rounded-2xl shadow-2xl">
        <h1>Add New Employee</h1>
        <form onSubmit={handleSubmit} className="space-y-6 text-gray-800">
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium text-gray-200">First Name:</label>
            <input type="text" name="first_name" id="first_name" value={employeeData.first_name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div>
            <label htmlFor="last_name" className="block text-sm font-medium text-gray-200">Last Name:</label>
            <input type="text" name="last_name" id="last_name" value={employeeData.last_name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-200">Gender (M/F):</label>
            <input type="text" name="gender" id="gender" value={employeeData.gender} onChange={handleChange} required maxLength="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div>
            <label htmlFor="birth_date" className="block text-sm font-medium text-gray-200">Birth Date:</label>
            <input type="date" name="birth_date" id="birth_date" value={employeeData.birth_date} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div>
            <label htmlFor="hire_date" className="block text-sm font-medium text-gray-200">Hire Date:</label>
            <input type="date" name="hire_date" id="hire_date" value={employeeData.hire_date} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div className="pt-4">
            <button type="submit" className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-300">
              Add Employee
            </button>
          </div>
        </form>
        {message && <p className="mt-4 text-center text-green-300 font-semibold">{message}</p>}
        {error && <p className="mt-4 text-center text-red-400 font-semibold">Error: {error}</p>}
        <div className="text-center mt-6">
          <button onClick={() => navigate('/')} className="text-gray-300 hover:text-white hover:underline font-medium">
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddEmployee;
