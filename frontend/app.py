from flask import Flask, render_template
from flask_cors import CORS

app = Flask(__name__, "/static")
CORS(app)

@app.route("/")
def pomofiuba():
    return render_template("pomofiuba.html")

@app.route("/temporizador")
def timer():
    return render_template("timer.html")

@app.route("/playlist")
def playlist():
    return render_template("playlist.html")

if __name__ == "__main__":
    app.run(debug=True, port=8000)
