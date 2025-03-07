from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import mysql.connector

app = Flask(__name__)
CORS(app)

db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="@Jay3254",
    database="fundraising_db"
)
cursor = db.cursor()

UPLOAD_FOLDER = "static"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/submit_fundraiser', methods=['POST'])
def submit_fundraiser():
    ngo_name = request.form.get("ngo_name")
    reason = request.form.get("reason")
    target_amount = request.form.get("target_amount")
    image = request.files.get("image")
    if not (ngo_name and reason and target_amount and image):
        return jsonify({"message": "All fields are required!"}), 400
    image_filename = image.filename
    image_path = os.path.join(UPLOAD_FOLDER, image_filename)
    image.save(image_path)
    sql = "INSERT INTO fundraisers (ngo_name, reason, image, target_amount) VALUES (%s, %s, %s, %s)"
    values = (ngo_name, reason, image_filename, target_amount)
    try:
        cursor.execute(sql, values)
        db.commit()
        return jsonify({"message": "Fundraiser submitted successfully!"})
    except Exception as e:
        return jsonify({"message": "Database error", "error": str(e)}), 500

@app.route('/get_fundraisers', methods=['GET'])
def get_fundraisers():
    cursor.execute("SELECT ngo_name, reason, image, target_amount FROM fundraisers")
    fundraisers = [{"ngo_name": row[0], "reason": row[1], "image": row[2], "target_amount": row[3]} for row in cursor.fetchall()]
    return jsonify(fundraisers)

if __name__ == '__main__':
    app.run(debug=True)
