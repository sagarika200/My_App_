import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddEmployee() {
  const navigate = useNavigate();
  const [employeeData, setEmployeeData] = useState({
    first_name: '', last_name: '', gender: '', birth_date: '', hire_date: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://127.0.0.1:5000/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(employeeData),
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) throw new Error(data.error);
      setMessage(`Employee added with ID: ${data.emp_no}`);
      setTimeout(() => navigate('/'), 2000);
    })
    .catch(err => setError(err.message));
  };

  return (
    <div>
      <h1>Add New Employee</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input type="text" name="first_name" value={employeeData.first_name} onChange={handleChange} required />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" name="last_name" value={employeeData.last_name} onChange={handleChange} required />
        </div>
        <div>
          <label>Gender (M/F):</label>
          <input type="text" name="gender" value={employeeData.gender} onChange={handleChange} required maxLength="1" />
        </div>
        <div>
          <label>Birth Date:</label>
          <input type="date" name="birth_date" value={employeeData.birth_date} onChange={handleChange} required />
        </div>
        <div>
          <label>Hire Date:</label>
          <input type="date" name="hire_date" value={employeeData.hire_date} onChange={handleChange} required />
        </div>
        <button type="submit">Add Employee</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p>Error: {error}</p>}
      <button onClick={() => navigate('/')}>Back to Dashboard</button>
    </div>
  );
}

export default AddEmployee;
