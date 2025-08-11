from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import datetime

app = Flask(__name__)
CORS(app) 

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

# --- API to ADD (POST) a new employee (Corrected with Debugging) ---
@app.route('/api/employees', methods=['POST'])
def add_employee():
    print(f"\n--- Received POST request to add new employee ---")
    conn = None
    try:
        print("Step 1: Attempting to get JSON data from request.")
        data = request.get_json()
        if not data:
            print("Error: No JSON data received in the request.")
            return jsonify({"error": "No data sent in request body"}), 400
        print(f"Step 2: Received data: {data}")

        print("Step 3: Attempting to connect to the database.")
        conn = get_db_connection()
        if not conn:
            print("Error: Failed to get database connection.")
            return jsonify({"error": "Database connection failed"}), 500
        print("Step 4: Database connection successful.")
        
        cursor = conn.cursor()

        print("Step 5: Finding the next available employee number.")
        cursor.execute("SELECT MAX(emp_no) + 1 FROM employees")
        next_emp_no = cursor.fetchone()[0]
        print(f"Step 6: Next employee number will be: {next_emp_no}")

        sql = """
            INSERT INTO employees (emp_no, birth_date, first_name, last_name, gender, hire_date) 
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        values = (
            next_emp_no,
            data.get('birth_date'),
            data.get('first_name'),
            data.get('last_name'),
            data.get('gender'),
            data.get('hire_date')
        )
        print(f"Step 7: Executing SQL with values: {values}")
        cursor.execute(sql, values)
        
        print("Step 8: Committing transaction to the database.")
        conn.commit()
            
        print("Step 9: Add successful.")
        return jsonify({"message": "Employee added successfully!", "emp_no": next_emp_no}), 201

    except Exception as e:
        print(f"!!! AN ERROR OCCURRED: {e} !!!")
        if conn:
            print("Rolling back database transaction.")
            conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        print("--- End of request ---")
        if conn and conn.is_connected():
            conn.close()


# --- API to UPDATE (PUT) an existing employee (Corrected with Debugging) ---
@app.route('/api/employee/<int:emp_no>', methods=['PUT'])
def update_employee(emp_no):
    # This function now has print statements to help debug in your Flask terminal.
    print(f"\n--- Received PUT request for emp_no: {emp_no} ---")
    conn = None
    try:
        print("Step 1: Attempting to get JSON data from request.")
        data = request.get_json()
        if not data:
            print("Error: No JSON data received in the request.")
            return jsonify({"error": "No data sent in request body"}), 400
        print(f"Step 2: Received data: {data}")

        print("Step 3: Attempting to connect to the database.")
        conn = get_db_connection()
        if not conn:
            print("Error: Failed to get database connection.")
            return jsonify({"error": "Database connection failed"}), 500
        print("Step 4: Database connection successful.")
        
        cursor = conn.cursor()

        sql = """
            UPDATE employees 
            SET first_name = %s, last_name = %s, birth_date = %s, gender = %s, hire_date = %s 
            WHERE emp_no = %s
        """
        # Using .get() is safer than direct access like data['key']
        values = (
            data.get('first_name'), 
            data.get('last_name'), 
            data.get('birth_date'), 
            data.get('gender'), 
            data.get('hire_date'), 
            emp_no
        )
        print(f"Step 5: Executing SQL with values: {values}")
        cursor.execute(sql, values)
        
        print("Step 6: Committing transaction to the database.")
        conn.commit()
        
        if cursor.rowcount == 0:
            print("Warning: No rows were updated. Employee not found or data was unchanged.")
            # Even if no rows changed, we can consider it a "success" in a way.
            # Let's return a success message to avoid confusion.
            return jsonify({"message": "No changes were made to the employee data."})
            
        print("Step 7: Update successful.")
        return jsonify({"message": "Employee updated successfully!"})

    except Exception as e:
        print(f"!!! AN ERROR OCCURRED: {e} !!!")
        if conn:
            print("Rolling back database transaction.")
            conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        print("--- End of request ---")
        if conn and conn.is_connected():
            conn.close()


# --- Other API Endpoints (No changes needed below this line) ---

@app.route('/api/tables', methods=['GET'])
def get_tables():
    conn = None; cursor = None
    try:
        conn = get_db_connection(); cursor = conn.cursor()
        cursor.execute("SHOW TABLES")
        return jsonify([table[0] for table in cursor.fetchall()])
    except Exception as e: return jsonify({"error": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@app.route('/api/tables/<string:table_name>/columns', methods=['GET'])
def get_columns_for_table(table_name):
    conn = None; cursor = None
    try:
        conn = get_db_connection(); cursor = conn.cursor()
        cursor.execute("SHOW TABLES")
        if table_name not in [table[0] for table in cursor.fetchall()]:
            return jsonify({"error": "Invalid table name"}), 404
        cursor.execute(f"DESCRIBE `{table_name}`")
        return jsonify([row[0] for row in cursor.fetchall()])
    except Exception as e: return jsonify({"error": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@app.route('/api/query', methods=['POST'])
def execute_query():
    data = request.get_json()
    table, columns, clauses = data.get('table'), data.get('columns', []), data.get('clauses', [])
    if not table: return jsonify({"error": "Table name is required."}), 400
    conn = None
    try:
        conn = get_db_connection()
        # (Validation and query building logic remains the same)
        cursor = conn.cursor()
        cursor.execute("SHOW TABLES")
        if table not in [t[0] for t in cursor.fetchall()]: return jsonify({"error": f"Invalid table name: {table}"}), 400
        cursor.execute(f"DESCRIBE `{table}`")
        valid_columns = [c[0] for c in cursor.fetchall()]
        all_req_cols = columns + [c.get('column') for c in clauses if c.get('column')]
        for col in all_req_cols:
            if col not in valid_columns: return jsonify({"error": f"Invalid column name: {col}"}), 400
        select_part = ", ".join([f"`{col}`" for col in columns]) if columns else "*"
        from_part = f"`{table}`"
        where_conditions, where_values = [], []
        for clause in clauses:
            col, op, val = clause.get('column'), clause.get('operator'), clause.get('value')
            if col and op and val is not None and str(val).strip() != '':
                where_conditions.append(f"`{col}` {op} %s")
                where_values.append(val)
        where_part = "WHERE " + " AND ".join(where_conditions) if where_conditions else ""
        final_query = f"SELECT {select_part} FROM {from_part} {where_part} LIMIT 200"
        results_cursor = conn.cursor(dictionary=True)
        results_cursor.execute(final_query, tuple(where_values))
        results = results_cursor.fetchall()
        for row in results:
            for key, value in row.items():
                if isinstance(value, (datetime.date, datetime.datetime)):
                    row[key] = value.isoformat()
        return jsonify(results)
    except Exception as e: return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    finally:
        if conn and conn.is_connected(): conn.close()


@app.route('/api/employees', methods=['GET'])
def get_employees():
    conn = None; cursor = None
    try:
        conn = get_db_connection(); cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT emp_no, first_name, last_name, gender, hire_date, birth_date FROM employees LIMIT 100")
        employees = cursor.fetchall()
        for emp in employees:
            if emp.get('hire_date'): emp['hire_date'] = emp['hire_date'].isoformat()
            if emp.get('birth_date'): emp['birth_date'] = emp['birth_date'].isoformat()
        return jsonify(employees)
    except Exception as e: return jsonify({"error": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

@app.route('/api/employee/<int:emp_no>', methods=['GET'])
def get_employee_by_id(emp_no):
    conn = None; cursor = None
    try:
        conn = get_db_connection(); cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM employees WHERE emp_no = %s", (emp_no,))
        employee = cursor.fetchone()
        if employee:
            if employee.get('hire_date'): employee['hire_date'] = employee['hire_date'].isoformat()
            if employee.get('birth_date'): employee['birth_date'] = employee['birth_date'].isoformat()
            return jsonify(employee)
        else: return jsonify({"error": "Employee not found"}), 404
    except Exception as e: return jsonify({"error": str(e)}), 500
    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# Other endpoints like POST and DELETE would go here...

if __name__ == '__main__':
    app.run(debug=True, port=5000)
