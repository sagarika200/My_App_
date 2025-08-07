import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import EmployeeDetails from './EmployeeDetails';
import AddEmployee from './AddEmployee';
import EditEmployee from './EditEmployee';
import Columns from './Columns';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-violet-600 text-white p-4 sm:p-8">
  <div className="max-w-7xl mx-auto">
    {/* Welcome Message */}
    <h1 className="text-4xl font-bold text-center text-blue-300 mb-2 drop-shadow-md">
      Welcome to My App
    </h1>

    {/* Optional Subheading */}
    <h2 className="text-2xl font-semibold text-center mb-4 drop-shadow-md">
      Employee Dashboard
    </h2>


        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddEmployee />} />
          <Route path="/employee/:emp_no" element={<EmployeeDetails />} />
          <Route path="/edit/:emp_no" element={<EditEmployee />} />
          <Route path="/columns" element={<Columns />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
