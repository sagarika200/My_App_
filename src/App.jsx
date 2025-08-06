import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard'; // Import your new components
import EmployeeDetails from './EmployeeDetails';
import AddEmployee from './AddEmployee';
import EditEmployee from './EditEmployee';
import Columns from './Columns'; // You can keep this page if you want

function App() {
  return (
    <div className="bg-[#f0e8e8] min-h-screen p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <Routes>
          {/* The main page will now be the Dashboard */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Route for adding a new employee */}
          <Route path="/add" element={<AddEmployee />} />
          
          {/* Route for viewing a single employee's details */}
          <Route path="/employee/:emp_no" element={<EmployeeDetails />} />
          
          {/* Route for editing an employee */}
          <Route path="/edit/:emp_no" element={<EditEmployee />} />

          {/* You can keep the columns page at its own route */}
          <Route path="/columns" element={<Columns />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
