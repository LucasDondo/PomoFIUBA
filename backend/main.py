from flask import Flask, request, jsonify
from models import db, Course, Sesion

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = (
    "postgresql+psycopg2://postgres:postgres@localhost:5432/pomofiuba_db"
)

# Inicializa la instancia de SQLAlchemy con la app
db.init_app(app)

# Crea las tablas en la base de datos

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


@app.put("/cursos/<int:id>")
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
            return jsonify({
                "course": {
                    "id": course.id,
                    "name": course.name,
                    "credits": course.credits
                }
            })
        else:
            return jsonify({"message": f"Course with ID {id} does not exist."}), 404
    except Exception as error:
        return jsonify({"message": str(error)}), 500

@app.get("/sesiones")
def get_sessions():
    response = Sesion.query.all()
    sessions = [{"id": sesion.id, "course_id": sesion.course_id, "mins_studied": sesion.mins_studied} for sesion in response]
    return jsonify(sessions)

@app.post("/nueva_sesion")
def new_session():
    try:
        data = request.json
        course_id = data.get("course_id")
        mins_studied = data.get("mins_studied", 0)
        if not course_id:
            return jsonify({"message": "Bad request: course_id must be provided."}), 400
        course = Course.query.get(course_id)
        if not course:
            return jsonify({"message": f"Course with ID {course_id} does not exist."}), 404
        new_session = Sesion(course_id=course_id, mins_studied=mins_studied)
        db.session.add(new_session)
        db.session.commit()
        return jsonify({"session": {"id": new_session.id, "course_id": new_session.course_id, "mins_studied": new_session.mins_studied}}), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@app.delete("/eliminar_sesion/<int:id>")
def delete_session(id):
    try:
        session = Sesion.query.get(id)
        if session:
            db.session.delete(session)
            db.session.commit()
            return jsonify({"message": f"Session with ID {id} deleted successfully."}), 200
        else:
            return jsonify({"message": f"Session with ID {id} does not exist."}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 500

@app.put("/sesiones/<int:id>")
def update_session(id):
    try:
        data = request.json
        course_id = data.get("course_id")
        mins_studied = data.get("mins_studied")
        session = Sesion.query.get(id)
        if session:
            if course_id:
                course = Course.query.get(course_id)
                if not course:
                    return jsonify({"message": f"Course with ID {course_id} does not exist."}), 404
                session.course_id = course_id
            if mins_studied is not None:
                session.mins_studied = mins_studied
            db.session.commit()
            return jsonify({"session": {"id": session.id, "course_id": session.course_id, "mins_studied": session.mins_studied}}), 200
        else:
            return jsonify({"message": f"Session with ID {id} does not exist."}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 500
 
if __name__ == "__main__":
    app.init_app(app)
    with app.app_context():
        db.create_all()
    app.run