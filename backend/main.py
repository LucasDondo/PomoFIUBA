from flask import Flask, request, jsonify
from models import db, Course

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = (
    "postgresql+psycopg2://postgres:postgres@localhost:5432/pomofiuba_db"
)


@app.route("/")
def hello():
    return "Hello, World!"


@app.route("/cursos", methods=["GET"])
def get_courses():
    response = Course.query.all()
    print(response)
    courses = []
    for course in response:
        courses.append(
            {"id": course.id, "name": course.name, "credits": course.credits}
        )
    return jsonify(courses)


@app.route("/nuevo_curso", methods=["POST"])
def new_course():
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
        return jsonify({"message": error.message}), 500


if __name__ == "__main__":
    db.init_app(app)
    with app.app_context():
        db.create_all()
    app.run()