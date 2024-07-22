from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Course(db.Model):
    __tablename__ = "courses"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    credits = db.Column(db.Integer, nullable=False)
    sessions = db.relationship("Sesion", cascade="all, delete-orphan", backref="course" )

    def __repr__(self):
        return f"<Course {self.name}><ID {self.id}><{self.credits} credits><Sessions {self.sessions}>"


class Sesion(db.Model):
    __tablename__ = "study_sessions"
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey("courses.id"), nullable=False)
    mins_studied = db.Column(db.Integer, nullable=False, default=0)

    def __repr__(self):
        return f"<Session {self.id}><CourseID {self.course_id}><{self.mins_studied} minutes studied>"
