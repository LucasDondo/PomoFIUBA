from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Course, Sesion

app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = (
    "postgresql+psycopg2://postgres:postgres@localhost:5432/pomofiuba_db"
)


@app.get("/courses")
def courses():
    response = Course.query.all()
    courses = []
    for course in response:
        courses.append(
            {"id": course.id, "name": course.name, "credits": course.credits}
        )
    return jsonify(courses)


@app.post("/new_course")
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
    except Exception as error:
        response = jsonify({"message": str(error)}), 500
    return response


@app.delete("/delete_course_<int:id>")
def delete_course(id):
    try:
        if Course.query.filter_by(id=id).first():
            course_name = Course.query.filter_by(id=id).first().__dict__["name"]
            Course.query.filter_by(id=id).delete()
            db.session.commit()
            response = (
                jsonify({"message": f"{course_name} deleted successfully."}),
                200,
            )
        else:
            response = jsonify({"message": f"Course of ID {id} does not exist."}), 404
    except Exception as error:
        response = jsonify({"message": error}), 500
    return response


@app.put("/edit_course_<int:id>")
def update_course(id):
    try:
        data = request.json
        name = data.get("name")
        credits = data.get("credits")
        course = Course.query.filter_by(id=id).first()
        if course:
            if name:
                course.name = name
            if credits:
                course.credits = credits
            db.session.commit()
            return jsonify(
                {
                    "course": {
                        "id": course.id,
                        "name": course.name,
                        "credits": course.credits,
                    }
                }
            )
        else:
            return jsonify({"message": f"Course with ID {id} does not exist."}), 404
    except Exception as error:
        return jsonify({"message": str(error)}), 500


@app.post("/new_session")
def new_session():
    try:
        data = request.json
        course_id = data.get("course_id")
        mins_studied = data.get("mins_studied")

        if not course_id:
            return jsonify({"message": "Bad request: course ID must be provided."}), 400
        if not Course.query.filter_by(id=course_id).first():
            return jsonify({"message": f"Course of ID {course_id} not found."}), 404

        new_session = Sesion(course_id=course_id, mins_studied=mins_studied)
        db.session.add(new_session)
        db.session.commit()
        return (
            jsonify(
                {
                    "session": {
                        "id": new_session.id,
                        "course_id": new_session.course_id,
                        "mins_studied": new_session.mins_studied,
                    }
                }
            ),
            201,
        )
    except Exception as error:
        return jsonify({"message": str(error)}), 500


@app.get("/sessions")
def sessions():
    try:
        sessions = Sesion.query.all()
        sessions_data = [
            {
                "id": session.id,
                "course_id": session.course_id,
                "mins_studied": session.mins_studied,
            }
            for session in sessions
        ]

        return jsonify(sessions_data), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


@app.put("/edit_session")
def edit_session():
    try:
        data = request.json
        id = data.get("id")
        mins_studied = data.get("mins_studied")
        session = Sesion.query.filter_by(id=id).first()
        if session:
            if mins_studied:
                session.mins_studied = mins_studied
            db.session.commit()
            return jsonify(
                {
                    "session": {
                        "id": session.id,
                        "course_id": session.course_id,
                        "mins_studied": session.mins_studied,
                    }
                }
            )
        else:
            return jsonify({"message": f"Session with ID {id} does not exist."}), 404
    except Exception as error:
        return jsonify({"message": str(error)}), 500


@app.delete("/delete_sessions")
def delete_sessions():
    try:
        Sesion.query.delete()
        db.session.commit()
        return jsonify({"message": "All sessions had been deleted."}), 200
    except Exception as error:
        return jsonify({"message": str(error)}), 500


if __name__ == "__main__":
    db.init_app(app)
    with app.app_context():
        db.create_all()
    app.run()
