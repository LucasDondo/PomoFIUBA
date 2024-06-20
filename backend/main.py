from flask import Flask, request, jsonify
from models import db, Course

app = Flask(__name__)


@app.route("/nuevo_curso", methods=["POST"])
def nuevo_curso():
    try:
        data = request.json
        name = data.get("name")
        credits = data.get("credits")
        if not name or not credits:
            return jsonify({"message": "Bad request: name or credits not found"}), 400
        new_course = Course(name=name, credits=credits)
        db.session.add(new_course)
        db.session.commit()
        return (
            jsonify(
                {
                    "course": {
                        "id": new_course.id,
                        "name": new_course.name,
                        "credits": new_course.credits,
                    }
                }
            ),
            201,
        )
    except Exception as error:
        return jsonify({"message": "Internal server error"}), 500


if __name__ == "__main__":
    db.init_app(app)
    app.run()
