from flask import Flask, render_template
from flask_cors import CORS

app = Flask(__name__, "/static")
CORS(app)


@app.route("/cursos")
def courses():
    return render_template("courses.html")


@app.route("/timer")
def timer():
    return render_template("timer.html")


@app.route("/rendimiento")
def library():
    return render_template("performance.html")


@app.route("/playlist")
def playlist():
    return render_template("playlist.html")


if __name__ == "__main__":
    app.run(debug=True, port=8000)
