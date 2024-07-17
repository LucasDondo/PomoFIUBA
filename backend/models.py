from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Course(db.Model):
    __tablename__ = "courses"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    credits = db.Column(db.Integer, nullable=False)
    mins_studied = db.Column(db.Integer, nullable=False, default=0)

    def __repr__(self):
        return f"<Course {self.name}><ID {self.id}><Credits {self.credits}><{self.mins_studied} minutes studied>"

class Student(db.Model):
    __tablename__ = "students"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    course = db.relationship('Course', backref=db.backref('students', lazy=True))
    
    def __repr__(self):
        return f"<Student {self.name}><ID {self.id}><Age {self.age}><Course ID {self.course_id}>"