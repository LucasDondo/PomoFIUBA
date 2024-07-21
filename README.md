# ⏳ PomoFIUBA

## 🌍 Origin
This project was developed to complete the final project for the course [Introduction to Software Development by Manuel Camejo](https://intro-camejo.github.io/web/) during the first semester of 2024. The main goal is to create an application based on the Pomodoro Technique, which allows users to manage their time more effectively by utilizing intervals of work and rest.

## 👥 Team Members
- [Lucas Dondo](https://github.com/LucasDondo)
- [Nicolás Francisco Mazzeo](https://github.com/ElMalditoNINE9)

## 📚 Project Description
PomoFIUBA is a web application designed to implement the Pomodoro Technique. This technique helps users enhance their productivity by breaking work into intervals, traditionally 25 minutes long, separated by short breaks. The application allows users to create and manage different "sessions" of work and corresponding breaks.

## 💾 Database Structure
Instead of using a traditional database structure with users and courses, we opted for a structure based on courses and sessions. This approach is designed to make the application more personal and tailored to each PC. Each user can manage their own work sessions and breaks without the need for an additional user management system.

- **Courses**: Represent different subjects with their respective credits. Each course can have multiple associated sessions.
- **Sessions**: Represent the intervals of work or rest within a course. They allow users to customize the time spent on each task.

## 🔗 Additional Bibliography
- We used _[template inheritance](https://flask.palletsprojects.com/en/latest/patterns/templateinheritance)_ to ensure that all HTML files are consistent and to facilitate maintenance of the application's design and structure.
- For the implementation of the Pomodoro timer, we utilized [`setInterval`](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) and [`clearInterval`](https://developer.mozilla.org/en-US/docs/Web/API/clearInterval), two JavaScript methods that efficiently manage the work and rest cycles.

## 🚀 How to Run the Project

1. **Clone the repository**:
    ```bash
    git clone https://github.com/your_username/PomoFIUBA.git
    cd PomoFIUBA
    ```

2. **Set up the environment**:
   - Create and activate a virtual environment:
     ```bash
     python -m venv venv
     source venv/bin/activate  # On Windows use venv\Scripts\activate
     ```

   - Install the dependencies:
     ```bash
     pip install -r requirements.txt
     ```

3. **Run the application**:
   ```bash
   python3 frontend/app.py
   python3 backend/app.py

si esta mal escrito en ingles mala mia, no muy bien todavia ando practicando.