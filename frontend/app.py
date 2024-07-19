#export PYTHONPATH=$PYTHONPATH:/home/francisco/Escritorio/Facultad/Final\ Camejo/PomoFIUBA/PomoFIUBA

from flask import Flask, render_template, request, redirect, url_for
from flask_cors import CORS
from backend.models import db, Course, Sesion

app = Flask(__name__, "/static")
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = (
    "postgresql+psycopg2://postgres:postgres@localhost:5432/pomofiuba_db"
)

db.init_app(app)

@app.route("/")
def pomofiuba():
    return render_template("pomofiuba.html")

@app.route("/sesiones")
def sesiones():
    sessions = Sesion.query.all()
    return render_template("sesiones.html", sessions=sessions)

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
        return redirect(url_for('sesiones'))
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
    app.run(debug=True, port=8000)
