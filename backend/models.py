from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Course(db.Model):
    __tablename__ = "courses"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    credits = db.Column(db.Integer, nullable=False)
    mins_studied = db.Column(db.Integer, nullable=False, default=0)
    
    sesions = db.relationship('Sesion', backref='course', lazy=True)

    def __repr__(self):
        return f"<Course {self.name}><ID {self.id}><{self.credits} credits><{self.mins_studied} minutes studied>"

class Sesion(db.Model):
    __tablename__ = "sesion"
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    mins_studied = db.Column(db.Integer, nullable=False, default=0)
    
    def __repr__(self):
        return f"<Sesion {self.id}><Course {self.course_id}><{self.mins_studied} minutes studied>"