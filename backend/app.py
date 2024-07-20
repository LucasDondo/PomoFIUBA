from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_cors import CORS
from backend.models import db, Course, Sesion

app = Flask(__name__,
            template_folder="../frontend/templates",  # Directorio de templates
            static_folder="../frontend/static")      # Directorio de archivos estáticos
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = (
    "postgresql+psycopg2://postgres:postgres@localhost:5432/pomofiuba_db"
)

db.init_app(app)

@app.route("/")
def pomofiuba():
    return render_template("pomofiuba.html")

@app.route('/materias', methods=["GET", "POST"])
def materias():
    return render_template('materias.html')

@app.route("/playlist", methods=["GET"])
def playlist():
    return render_template("playlist.html")

@app.route("/pomodoro", methods=["GET", "POST"])
def pomodoro():
    return render_template("pomodoro.html")

@app.route("/temporizador")
def temporizador():
    return render_template("temporizador.html")

@app.route("/datos_temporizador", methods=["GET"])
def datos_temporizador():
    courses = Course.query.all()
    sessions = Sesion.query.all()
    
    courses_data = [{"id": course.id, "name": course.name, "credits": course.credits} for course in courses]
    sessions_data = [{"id": session.id, "course_id": session.course_id, "mins_studied": session.mins_studied} for session in sessions]
    
    return jsonify({"courses": courses_data, "sessions": sessions_data})

@app.route("/sesiones")
def sesiones():
    sessions = Sesion.query.all()
    return render_template("sesiones.html", sessions=sessions)

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
    except Exception as error:
        response = jsonify({"message": str(error)}), 500
    return response


@app.delete("/eliminar_curso_<int:id>")
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


@app.put("/editar_curso_<int:id>")
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

@app.route("/nueva_sesion", methods=["GET", "POST"])
def nueva_sesion():
    if request.method == "POST":
        course_id = request.form.get("course_id")
        mins_studied = request.form.get("mins_studied", 0)
        if not course_id:
            return redirect(url_for('nueva_sesion'))
        course = Course.query.get(course_id)
        if not course:
            return redirect(url_for('nueva_sesion'))
        new_session = Sesion(course_id=course_id, mins_studied=mins_studied)
        db.session.add(new_session)
        db.session.commit()
        return redirect(url_for('temporizador'))
    return render_template("nueva_sesion.html")

@app.route("/eliminar_sesion/<int:id>", methods=["POST"])
def eliminar_sesion(id):
    session = Sesion.query.get(id)
    if session:
        db.session.delete(session)
        db.session.commit()
    return redirect(url_for('sesiones'))

@app.route("/actualizar_sesion/<int:id>", methods=["GET", "POST"])
def actualizar_sesion(id):
    session = Sesion.query.get(id)
    if request.method == "POST":
        course_id = request.form.get("course_id")
        mins_studied = request.form.get("mins_studied")
        if course_id:
            course = Course.query.get(course_id)
            if not course:
                return redirect(url_for('actualizar_sesion', id=id))
            session.course_id = course_id
        if mins_studied is not None:
            session.mins_studied = mins_studied
        db.session.commit()
        return redirect(url_for('sesiones'))
    return render_template("actualizar_sesion.html", session=session)

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run()