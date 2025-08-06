import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EditEmployee() {
  const { emp_no } = useParams(); // Get the employee number from the URL
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    birth_date: '',
    hire_date: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // 1. Fetch the current data for the employee to pre-fill the form
    fetch(`http://127.0.0.1:5000/api/employee/${emp_no}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Could not fetch employee data');
        }
        return response.json();
      })
      .then(data => {
        // The dates from the database need to be in YYYY-MM-DD format for the input field
        const formattedData = {
          ...data,
          birth_date: data.birth_date ? data.birth_date.split('T')[0] : '',
          hire_date: data.hire_date ? data.hire_date.split('T')[0] : '',
        };
        setEmployeeData(formattedData);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [emp_no]);

  // This function updates the state when the user types in an input field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // This function is called when the form is submitted
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // 2. Send the updated data to the backend
    fetch(`http://127.0.0.1:5000/api/employee/${emp_no}`, {
      method: 'PUT', // Use the PUT method for updates
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employeeData),
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        throw new Error(data.error);
      }
      setMessage('Employee updated successfully!');
      // Redirect back to the details page after a short delay
      setTimeout(() => {
        navigate(`/employee/${emp_no}`);
      }, 1500); // 1.5-second delay
    })
    .catch(err => {
      setError(err.message);
    });
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading for Edit...</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Edit Employee
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Employee ID (readonly):</label>
          <input
            type="text"
            value={emp_no}
            readOnly
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name:</label>
          <input
            type="text"
            name="first_name"
            id="first_name"
            value={employeeData.first_name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name:</label>
          <input
            type="text"
            name="last_name"
            id="last_name"
            value={employeeData.last_name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender (M/F):</label>
          <input
            type="text"
            name="gender"
            id="gender"
            value={employeeData.gender}
            onChange={handleChange}
            required
            maxLength="1"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="birth_date" className="block text-sm font-medium text-gray-700">Birth Date:</label>
          <input
            type="date"
            name="birth_date"
            id="birth_date"
            value={employeeData.birth_date}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="hire_date" className="block text-sm font-medium text-gray-700">Hire Date:</label>
          <input
            type="date"
            name="hire_date"
            id="hire_date"
            value={employeeData.hire_date}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="text-center">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Update Employee
          </button>
        </div>
      </form>

      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
      {error && <p className="mt-4 text-center text-red-600">{error}</p>}

      <div className="text-center mt-6">
        <button onClick={() => navigate(`/employee/${emp_no}`)} className="text-blue-600 hover:underline">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default EditEmployee;
