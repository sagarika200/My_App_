import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function EmployeeDetails() {
  const { emp_no } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/api/employee/${emp_no}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setEmployee(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [emp_no]);

  const handleDelete = () => {
    if (window.confirm('Are you sure?')) {
      fetch(`http://127.0.0.1:5000/api/employee/${emp_no}`, { method: 'DELETE' })
      .then(() => {
        alert('Employee deleted');
        navigate('/');
      });
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Employee Details</h1>
      {employee && (
        <div>
          <p><strong>Emp No:</strong> {employee.emp_no}</p>
          <p><strong>First Name:</strong> {employee.first_name}</p>
          <p><strong>Last Name:</strong> {employee.last_name}</p>
          <p><strong>Gender:</strong> {employee.gender}</p>
          <p><strong>Birth Date:</strong> {employee.birth_date.split('T')[0]}</p>
          <p><strong>Hire Date:</strong> {employee.hire_date.split('T')[0]}</p>
        </div>
      )}
      <button onClick={() => navigate(`/edit/${emp_no}`)}>Edit</button>
      <button onClick={handleDelete}>Delete</button>
      <br />
      <button onClick={() => navigate('/')}>Back to Dashboard</button>
    </div>
  );
}

export default EmployeeDetails;
