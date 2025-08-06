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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Welcome to the Employee Dashboard</h1>
      <button onClick={() => navigate('/add')}>Add New Employee</button>
      <button onClick={() => navigate('/columns')}>View Columns</button>
      <hr />
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Emp No</th>
            <th>Name</th>
            <th>Gender</th>
            <th>Hire Date</th>
            <th>Birth Date</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.emp_no}>
              <td>
                <button onClick={() => navigate(`/employee/${employee.emp_no}`)}>
                  {employee.emp_no}
                </button>
              </td>
              <td>{employee.first_name} {employee.last_name}</td>
              <td>{employee.gender}</td>
              <td>{employee.hire_date.split('T')[0]}</td>
              <td>{employee.birth_date.split('T')[0]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
