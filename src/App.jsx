import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import EmployeeDetails from './EmployeeDetails';
import AddEmployee from './AddEmployee';
import EditEmployee from './EditEmployee';
import Columns from './Columns';
import QueryBuilder from './QueryBuilder'; // <-- 1. ADD THIS IMPORT

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700 text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* These headers will appear on every page */}
        <h1 className="text-4xl font-bold text-center text-blue-400 mb-2 drop-shadow-md">
          Welcome to My App
        </h1>
        <h2 className="text-2xl font-semibold text-center text-gray-300 mb-4 drop-shadow-md">
          Employee Dashboard
        </h2>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddEmployee />} />
          <Route path="/employee/:emp_no" element={<EmployeeDetails />} />
          <Route path="/edit/:emp_no" element={<EditEmployee />} />
          <Route path="/columns" element={<Columns />} />
          
          {/* 2. ADD THE ROUTE FOR YOUR NEW PAGE */}
          <Route path="/query-builder" element={<QueryBuilder />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;