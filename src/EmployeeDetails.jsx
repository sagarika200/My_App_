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
      .then(response => {
        if (!response.ok) throw new Error('Employee not found');
        return response.json();
      })
      .then(data => {
        setEmployee(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [emp_no]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      fetch(`http://127.0.0.1:5000/api/employee/${emp_no}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
          if (data.error) throw new Error(data.error);
          alert('Employee deleted successfully');
          navigate('/');
        })
        .catch(err => {
          setError(err.message);
          alert(`Error deleting employee: ${err.message}`);
        });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  if (isLoading) return <p className="text-center text-white text-xl mt-10">Loading Employee Details...</p>;
  if (error) return <p className="text-center text-red-300 text-xl mt-10">Error: {error}</p>;
  if (!employee) return <p className="text-center text-white text-xl mt-10">No employee data found.</p>;

  return (
    <div className="min-h-[60vh] flex justify-center mt-10 px-4">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Employee Details
        </h1>
        <div className="space-y-4 text-lg">
          <div className="flex justify-between border-b border-gray-300 pb-2">
            <strong className="text-gray-600">Emp No:</strong>
            <span className="text-gray-900 font-medium">{employee.emp_no}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-2">
            <strong className="text-gray-600">First Name:</strong>
            <span className="text-gray-900 font-medium">{employee.first_name}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-2">
            <strong className="text-gray-600">Last Name:</strong>
            <span className="text-gray-900 font-medium">{employee.last_name}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-2">
            <strong className="text-gray-600">Gender:</strong>
            <span className="text-gray-900 font-medium">{employee.gender}</span>
          </div>
          <div className="flex justify-between border-b border-gray-300 pb-2">
            <strong className="text-gray-600">Birth Date:</strong>
            <span className="text-gray-900 font-medium">{formatDate(employee.birth_date)}</span>
          </div>
          <div className="flex justify-between">
            <strong className="text-gray-600">Hire Date:</strong>
            <span className="text-gray-900 font-medium">{formatDate(employee.hire_date)}</span>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={() => navigate(`/edit/${employee.emp_no}`)}
            className="bg-blue-500 text-white font-semibold py-2 px-8 rounded-lg shadow-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-300"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white font-semibold py-2 px-8 rounded-lg shadow-lg hover:bg-red-600 transform hover:scale-105 transition-all duration-300"
          >
            Delete
          </button>
        </div>
        <div className="text-center mt-6">
          <button onClick={() => navigate('/')} className="text-gray-600 hover:text-blue-600 hover:underline font-medium">
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetails;
