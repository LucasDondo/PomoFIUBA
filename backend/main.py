from flask import Flask, request, jsonify
from models import db, Course

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = (
    "postgresql+psycopg2://postgres:postgres@localhost:5432/pomofiuba_db"
)


@app.get("/cursos")
def courses():
    response = Course.query.all()
    courses = []
    for course in response:
        courses.append(
            {"id": course.id, "name": course.name, "credits": course.credits}
        )
    return jsonify(courses)


@app.post("/nuevo_curso")
def new_course():
    try:
        data = request.json
        name = data.get("name")
        credits = data.get("credits")
        if not name and not credits:
            response = (
                jsonify(
                    {"message": "Bad request: course name and ID must be provided."}
                ),
                400,
            )
        elif not name:
            response = (
                jsonify({"message": "Bad request: course name must be provided."}),
                400,
            )
        elif not credits:
            response = (
                jsonify({"message": "Bad request: course ID must be provided."}),
                400,
            )
        new_course = Course(name=name, credits=credits)
        db.session.add(new_course)
        db.session.commit()
        response = (
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
    except Exception:
        response = jsonify({"message": "Internal server error."}), 500
    return response


@app.delete("/eliminar_curso/<id>")
def delete_course(id):
    try:
        course_name = Course.query.filter_by(id=id).first().__dict__["name"]
        if course_name:
            Course.query.filter_by(id=id).delete()
            db.session.commit()
            response = (
                jsonify({"message": f"{course_name} deleted successfully."}),
                200,
            )
        else:
            response = jsonify({"message": f"Course of ID {id} does not exist."}), 400
    except Exception as error:
        response = jsonify({"message": error}), 500
    return response


if __name__ == "__main__":
    db.init_app(app)
    with app.app_context():
        db.create_all()
    app.run()
