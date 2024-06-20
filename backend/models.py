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