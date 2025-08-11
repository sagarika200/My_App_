import React, { useState, useEffect } from 'react';
import './QueryBuilder.css';

const OPERATORS = ['=', '!=', '>', '<', '>=', '<='];

function QueryBuilder() {
    // State for UI selections
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState('');
    const [columns, setColumns] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState({});
    const [whereClauses, setWhereClauses] = useState([]);
    
    // State for query execution and results
    const [isExecuting, setIsExecuting] = useState(false);
    const [queryError, setQueryError] = useState('');
    const [results, setResults] = useState([]);

    // Effect to fetch the list of tables on component load
    useEffect(() => {
        fetch('http://localhost:5000/api/tables')
            .then(res => {
                if (!res.ok) {
                    // If the server response is not good, create a new error to be caught below
                    throw new Error('Network response was not ok.');
                }
                return res.json();
            })
            .then(data => {
                setTables(data);
            })
            .catch(err => {
                // This will now catch the error and display a message instead of crashing
                setQueryError('Could not fetch tables. Is the backend server running?');
                console.error("Fetch tables error:", err);
            });
    }, []); // The empty array ensures this runs only once on mount

    // Function to handle table selection and reset other states
    const handleTableChange = (event) => {
        const newTable = event.target.value;
        setSelectedTable(newTable);
        // Reset all subsequent states
        setColumns([]);
        setSelectedColumns({});
        setWhereClauses([]);
        setResults([]);
        setQueryError('');
        
        if (newTable) {
            fetch(`http://localhost:5000/api/tables/${newTable}/columns`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error(`Failed to load columns for ${newTable}`);
                    }
                    return res.json();
                })
                .then(data => {
                    setColumns(data);
                })
                .catch(err => {
                    setQueryError(err.message);
                    console.error("Fetch columns error:", err);
                });
        }
    };

    // Functions to manage selections
    const handleColumnChange = (event) => {
        setSelectedColumns(prev => ({ ...prev, [event.target.name]: event.target.checked }));
    };

    const handleAddClause = () => {
        setWhereClauses(prev => [...prev, { id: Date.now(), column: '', operator: '=', value: '' }]);
    };

    const handleRemoveClause = (id) => {
        setWhereClauses(prev => prev.filter(clause => clause.id !== id));
    };

    const handleClauseChange = (id, field, value) => {
        setWhereClauses(prev => prev.map(clause =>
            clause.id === id ? { ...clause, [field]: value } : clause
        ));
    };

    // Function to execute the query
    const handleExecuteQuery = () => {
        const finalColumns = Object.keys(selectedColumns).filter(key => selectedColumns[key]);

        if (!selectedTable) {
            setQueryError('Please select a table.');
            return;
        }
        if (finalColumns.length === 0) {
            setQueryError('Please select at least one column to display.');
            return;
        }

        const payload = {
            table: selectedTable,
            columns: finalColumns,
            clauses: whereClauses.filter(c => c.column && c.value.trim() !== ''),
        };

        setIsExecuting(true);
        setQueryError('');
        setResults([]);

        fetch('http://localhost:5000/api/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
        .then(response => response.json().then(data => ({ ok: response.ok, data })))
        .then(({ ok, data }) => {
            if (!ok) {
                throw new Error(data.error || 'An unknown error occurred.');
            }
            setResults(data);
            if (data.length === 0) {
                setQueryError('Query executed successfully, but returned no results.');
            }
        })
        .catch(error => {
            setQueryError(error.message);
            console.error("Execute query error:", error);
        })
        .finally(() => {
            setIsExecuting(false);
        });
    };

    // If there's an initial error loading tables, we can show a message
    if (queryError && tables.length === 0) {
        return <div className="query-builder-container error-message">{queryError}</div>;
    }

    return (
        <div className="query-builder-container">
            <h2>Query Builder</h2>
            
            <div className="form-group">
                <label>1. Select a Table</label>
                <select value={selectedTable} onChange={handleTableChange}>
                    <option value="" disabled>-- Please choose a table --</option>
                    {tables.map(name => (<option key={name} value={name}>{name}</option>))}
                </select>
            </div>

            {columns.length > 0 && (
                <div className="form-group">
                    <label>2. Select Columns</label>
                    <div className="checkbox-group">
                        {columns.map(name => (
                            <div key={name} className="checkbox-item">
                                <input type="checkbox" id={`col-${name}`} name={name} checked={selectedColumns[name] || false} onChange={handleColumnChange} />
                                <label htmlFor={`col-${name}`}>{name}</label>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {columns.length > 0 && (
                <div className="form-group">
                    <label>3. Add Conditions (WHERE)</label>
                    <div className="where-clauses-container">
                        {whereClauses.map((clause) => (
                            <div key={clause.id} className="where-clause-row">
                                <select value={clause.column} onChange={e => handleClauseChange(clause.id, 'column', e.target.value)}>
                                    <option value="" disabled>Select Column</option>
                                    {columns.map(name => (<option key={name} value={name}>{name}</option>))}
                                </select>
                                <select value={clause.operator} onChange={e => handleClauseChange(clause.id, 'operator', e.target.value)}>
                                    {OPERATORS.map(op => (<option key={op} value={op}>{op}</option>))}
                                </select>
                                <input type="text" placeholder="Value" value={clause.value} onChange={e => handleClauseChange(clause.id, 'value', e.target.value)} />
                                <button className="remove-btn" onClick={() => handleRemoveClause(clause.id)}>-</button>
                            </div>
                        ))}
                        <button className="add-btn" onClick={handleAddClause}>+ Add Condition</button>
                    </div>
                </div>
            )}
            
            {columns.length > 0 && (
                <div className="execute-section">
                    <button onClick={handleExecuteQuery} disabled={isExecuting}>
                        {isExecuting ? 'Executing...' : ' Execute Query'}
                    </button>
                </div>
            )}
            
            <div className="results-section">
                {queryError && <div className="error-message">{queryError}</div>}
                {results.length > 0 && (
                    <div className="results-table-container">
                        <h3>Results</h3>
                        <table>
                            <thead>
                                <tr>
                                    {Object.keys(results[0]).map(key => <th key={key}>{key}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {results.map((row, index) => (
                                    <tr key={index}>
                                        {Object.values(row).map((val, i) => <td key={i}>{String(val)}</td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default QueryBuilder;
