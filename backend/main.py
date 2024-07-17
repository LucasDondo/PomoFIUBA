from flask import Flask, request, jsonify
from models import db, Course, Student

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
    except Exception as error:
        response = jsonify({"message": str(error)}), 500
    return response


@app.delete("/eliminar_curso/<id>")
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
        response = jsonify({"message": str(error)}), 500
    return response


@app.put("/editar_curso_<int:id>")
def edit_course(id):
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


@app.get("/estudiantes")
def students():
    response = Student.query.all()
    students = [
        {
            "id": student.id,
            "name": student.name,
            "age": student.age,
            "course_id": student.course_id,
        }
        for student in response
    ]
    return jsonify(students)


@app.post("/nuevo_estudiante")
def new_student():
    try:
        data = request.json
        name = data.get("name")
        age = data.get("age")
        course_id = data.get("course_id")
        if not name or not age or not course_id:
            return (
                jsonify(
                    {
                        "message": "Bad request: student name, age, and course_id must be provided."
                    }
                ),
                400,
            )
        course = Course.query.get(course_id)
        if not course:
            return (
                jsonify({"message": f"Course with ID {course_id} does not exist."}),
                404,
            )
        new_student = Student(name=name, age=age, course_id=course_id)
        db.session.add(new_student)
        db.session.commit()
        return (
            jsonify(
                {
                    "student": {
                        "id": new_student.id,
                        "name": new_student.name,
                        "age": new_student.age,
                        "course_id": new_student.course_id,
                    }
                }
            ),
            201,
        )
    except Exception as e:
        return jsonify({"message": str(e)}), 500


@app.delete("/eliminar_estudiante/<int:id>")
def delete_student(id):
    try:
        student = Student.query.get(id)
        if student:
            db.session.delete(student)
            db.session.commit()
            return (
                jsonify({"message": f"Student with ID {id} deleted successfully."}),
                200,
            )
        else:
            return jsonify({"message": f"Student with ID {id} does not exist."}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 500


@app.put("/estudiantes/<int:id>")
def update_student(id):
    try:
        data = request.json
        name = data.get("name")
        age = data.get("age")
        course_id = data.get("course_id")
        student = Student.query.get(id)
        if student:
            if name:
                student.name = name
            if age:
                student.age = age
            if course_id:
                course = Course.query.get(course_id)
                if not course:
                    return (
                        jsonify(
                            {"message": f"Course with ID {course_id} does not exist."}
                        ),
                        404,
                    )
                student.course_id = course_id
            db.session.commit()
            return (
                jsonify(
                    {
                        "student": {
                            "id": student.id,
                            "name": student.name,
                            "age": student.age,
                            "course_id": student.course_id,
                        }
                    }
                ),
                200,
            )
        else:
            return jsonify({"message": f"Student with ID {id} does not exist."}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 500


if __name__ == "__main__":
    db.init_app(app)
    with app.app_context():
        db.create_all()
    app.run()
