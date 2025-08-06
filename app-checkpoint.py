from flask import Flask, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)

# Connect to MySQL
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="your_password",
    database="employees"  # from test_db
)

@app.route('/employees', methods=['GET'])
def get_employees():
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT emp_no, first_name, last_name, hire_date FROM employees LIMIT 10;")
    rows = cursor.fetchall()
    return jsonify(rows)

if __name__ == '__main__':
    app.run(debug=True)
