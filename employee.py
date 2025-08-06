import mysql.connector
from flask import Blueprint, jsonify

# Create a Blueprint for the employee routes
# A blueprint is a way to organize a group of related views and other code.
bp = Blueprint('employees', __name__, url_prefix='/api')

# --- Database Connection Details ---
# IMPORTANT: Replace these with your actual MySQL connection details.
# It's recommended to use environment variables for security in a real application.
DB_CONFIG = {
    'user': 'root',
    'password': 'Gudu@2005', # <-- mySQL password
    'host': '127.0.0.1',
    'database': 'test_db'
}

def get_db_connection():
    """Establishes and returns a database connection."""
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except mysql.connector.Error as err:
        print(f"Error connecting to database: {err}")
        return None

@bp.route('/employees', methods=['GET'])
def get_employees():
    """
    API endpoint to fetch employee data from the MySQL database.
    """
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if conn is None or not conn.is_connected():
            return jsonify({"error": "Database connection failed"}), 500

        # Using a dictionary cursor to get column names in the result
        cursor = conn.cursor(dictionary=True)

        # Execute the query to get employee data.
        # LIMIT 100 is used to avoid fetching too much data and crashing the browser.
        # You can remove or adjust the LIMIT as needed.
        query = "SELECT emp_no, first_name, last_name, gender, hire_date FROM employees LIMIT 100"
        cursor.execute(query)

        employees = cursor.fetchall()

        # The hire_date is a date object, which isn't directly JSON serializable.
        # We need to convert it to a string for each employee.
        for employee in employees:
            if 'hire_date' in employee and employee['hire_date']:
                employee['hire_date'] = employee['hire_date'].isoformat()

        return jsonify(employees)

    except mysql.connector.Error as err:
        # Handle potential SQL errors
        print(f"API Error: {err}")
        return jsonify({"error": "An error occurred while fetching data."}), 500
    finally:
        # Ensure the cursor and connection are always closed
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

