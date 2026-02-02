from config import app
from flask import jsonify, request
from db.model import init_app, init_db, query_db
import json

@app.route("/library", methods=["GET"])
def get_library():
    return jsonify(query_db("SELECT id, isbn, title, author, year, completed FROM library"))

@app.route("/add-book", methods=["POST"])
def add_book():

    data = json.loads(request.data)
    title = data.get("title")
    author = data.get("author")
    isbn = data.get("isbn")
    year = data.get("year")

    if not title or not author:
        return jsonify({"message": "You must include the Title and the Author to add a book"}), 400

    try:
        query_db(
            """
            INSERT INTO library (isbn, title, author, year, completed)
            VALUES (?, ?, ?, ?, ?)
            """,
            (isbn, title, author, year, 0)
        )
        return jsonify({"message": f"{title} added into the collection"}), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@app.route("/delete-book/<int:book_id>", methods=["DELETE"])
def delete_book(book_id):
    try:
        query_db("DELETE FROM library WHERE id = ?",(book_id,))
        return jsonify({"message": f"Book {book_id} deleted"}), 200
    except Exception as e:
        print("Error", e)
        return jsonify({"message": str(e)}), 201

@app.route("/update-status/<book_id>", methods=["PUT"])
def update_status(book_id):
    try:
        query_db(
            """
            UPDATE library SET completed = CASE completed
            WHEN 0 THEN 1 ELSE 0 END 
            WHERE id = ?
            """,
            (book_id,)
        )
        return jsonify({"message": "Book status updated"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400

if __name__ == "__main__":
    init_app(app)
    with app.app_context():
        init_db()

    app.run(host='0.0.0.0', port=80, debug=True)