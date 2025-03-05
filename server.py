from flask import Flask, request, jsonify
from flask_cors import CORS  # Add this
import mysql.connector

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Database Connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="@Jay3254",
    database="donation_db"
)
cursor = db.cursor()

@app.route('/donate', methods=['POST'])
def donate():
    data = request.json
    print("📥 Received Data:", data)  # Debugging

    if not data:
        return jsonify({"message": "No data received"}), 400

    sql = """INSERT INTO donations (name, mo_no, email, aadhar, amount, supportTo, payment) 
             VALUES (%s, %s, %s, %s, %s, %s, %s)"""
    values = (data["name"], data["mo_no"], data["email"], data["aadhar"], data["amount"], data["supportTo"], data["payment"])

    try:
        cursor.execute(sql, values)
        db.commit()
        print("✅ Data Inserted Successfully")  # Debugging
        return jsonify({"message": "Donation Successful!"})
    except Exception as e:
        print("❌ Database Error:", str(e))  # Debugging
        return jsonify({"message": "Database error", "error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
