import mysql.connector
from flask import Blueprint, jsonify

# Create a Blueprint. This is a way to organize a group of related routes.
# 'columns_api' is the name of the blueprint.
# __name__ helps Flask locate the blueprint.
# url_prefix will be added to all routes in this blueprint (e.g., /api/columns)
bp = Blueprint('columns_api', __name__, url_prefix='/api')

# --- Database Connection Details ---
# We define this again here to make this file self-contained.
DB_CONFIG = {
    'user': 'root',
    'password': 'Gudu@2005', # Your MySQL password
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

# Define the route for getting column names within the blueprint
@bp.route('/columns', methods=['GET'])
def get_columns():
    """
    API endpoint to fetch the column names from the 'employees' table.
    """
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        if conn is None or not conn.is_connected():
            return jsonify({"error": "Database connection failed"}), 500

        cursor = conn.cursor()
        
        # This query gets metadata about the columns in the 'employees' table
        cursor.execute("DESCRIBE employees")
        
        # The column name is the first item in each row returned
        columns = [row[0] for row in cursor.fetchall()]
        
        return jsonify(columns)
        
    except mysql.connector.Error as err:
        print(f"API Error: {err}")
        return jsonify({"error": "An error occurred while fetching column names."}), 500
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()
