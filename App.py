from flask import Flask, jsonify, request # Import 'request' to handle incoming data
from flask_cors import CORS
import mysql.connector
from column import bp as columns_blueprint 

app = Flask(__name__)
CORS(app) 
app.register_blueprint(columns_blueprint)

# --- Database Connection Details ---
DB_CONFIG = {
    'user': 'root',
    'password': 'Sagarika@2004', # Your correct MySQL password
    'host': '127.0.0.1',
    'database': 'employees'
}

def get_db_connection():
    """Establishes and returns a database connection."""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except mysql.connector.Error as err:
        print(f"Error connecting to database: {err}")
        return None

# --- API to GET a list of all employees (Existing) ---
@app.route('/api/employees', methods=['GET'])
def get_employees():
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        # Added birth_date for the new table view
        query = "SELECT emp_no, first_name, last_name, gender, hire_date, birth_date FROM employees LIMIT 100"
        cursor.execute(query)
        employees = cursor.fetchall()
        for emp in employees:
            if emp.get('hire_date'): emp['hire_date'] = emp['hire_date'].isoformat()
            if emp.get('birth_date'): emp['birth_date'] = emp['birth_date'].isoformat()
        return jsonify(employees)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# --- START: NEW API ENDPOINTS ---

# --- API to GET a single employee's details ---
@app.route('/api/employee/<int:emp_no>', methods=['GET'])
def get_employee_by_id(emp_no):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM employees WHERE emp_no = %s", (emp_no,))
        employee = cursor.fetchone()
        if employee:
            if employee.get('hire_date'): employee['hire_date'] = employee['hire_date'].isoformat()
            if employee.get('birth_date'): employee['birth_date'] = employee['birth_date'].isoformat()
            return jsonify(employee)
        else:
            return jsonify({"error": "Employee not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# --- API to ADD (POST) a new employee ---
@app.route('/api/employees', methods=['POST'])
def add_employee():
    data = request.get_json()
    conn = None
    cursor = None
    try:
        # Find the next available employee number
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT MAX(emp_no) + 1 FROM employees")
        next_emp_no = cursor.fetchone()[0]

        # Insert the new employee
        sql = "INSERT INTO employees (emp_no, birth_date, first_name, last_name, gender, hire_date) VALUES (%s, %s, %s, %s, %s, %s)"
        values = (next_emp_no, data['birth_date'], data['first_name'], data['last_name'], data['gender'], data['hire_date'])
        cursor.execute(sql, values)
        conn.commit()
        
        return jsonify({"message": "Employee added successfully", "emp_no": next_emp_no}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# --- API to UPDATE (PUT) an existing employee ---
@app.route('/api/employee/<int:emp_no>', methods=['PUT'])
def update_employee(emp_no):
    data = request.get_json()
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        sql = "UPDATE employees SET first_name = %s, last_name = %s, birth_date = %s, gender = %s, hire_date = %s WHERE emp_no = %s"
        values = (data['first_name'], data['last_name'], data['birth_date'], data['gender'], data['hire_date'], emp_no)
        cursor.execute(sql, values)
        conn.commit()
        
        if cursor.rowcount == 0:
            return jsonify({"error": "Employee not found or no data changed"}), 404
        return jsonify({"message": "Employee updated successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# --- API to DELETE an employee ---
@app.route('/api/employee/<int:emp_no>', methods=['DELETE'])
def delete_employee(emp_no):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        # Note: In a real database, you also need to delete from other tables
        # (salaries, titles, etc.) or set up cascading deletes.
        cursor.execute("DELETE FROM employees WHERE emp_no = %s", (emp_no,))
        conn.commit()
        
        if cursor.rowcount == 0:
            return jsonify({"error": "Employee not found"}), 404
        return jsonify({"message": "Employee deleted successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# --- END: NEW API ENDPOINTS ---


if __name__ == '__main__':
    app.run(debug=True, port=5000)
