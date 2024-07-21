function fetchCoursesAndSessions() {
    fetch('http://localhost:5000/cursos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error fetching courses');
            }
            return response.json();
        })
        .then(courses => {
            return fetch('http://localhost:5000/sesiones')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error fetching sessions');
                    }
                    return response.json();
                })
                .then(sessions => {
                    const coursesInfo = courses.map(course => {
                        const courseSessions = sessions.filter(session => session.course_id === course.id);
                        const totalMinutes = courseSessions.reduce((acc, session) => acc + session.mins_studied, 0);
                        const sessionsCount = courseSessions.length;

                        const minHours = course.credits * 2;
                        const maxHours = course.credits * 3;

                        return {
                            id: course.id,
                            name: course.name,
                            credits: course.credits,
                            sessions_count: sessionsCount,
                            total_minutes: totalMinutes,
                        };
                    });

                    const coursesInfoContainer = document.getElementById('courses-info');
                    coursesInfoContainer.innerHTML = '';

                    coursesInfo.forEach(course => {
                        const courseInfo = document.createElement('div');
                        courseInfo.className = 'course-info';
                        courseInfo.innerHTML = `
                            <h3>${course.name}</h3>
                            <p>Créditos: ${course.credits}</p>
                            <p>Sesiones: ${course.sessions_count}</p>
                            <p>Minutos totales: ${course.total_minutes}</p>
                        `;
                        coursesInfoContainer.appendChild(courseInfo);
                    });
                });
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('courses-info').innerHTML = 'Error loading courses and sessions.';
        });
}

document.addEventListener('DOMContentLoaded', function() {
    fetchCoursesAndSessions();
});

function deleteAllSessions() {
    fetch('http://localhost:5000/eliminar_todas_sesiones', {
        method: 'DELETE',
    })
    .then(response => {
        console.log('Response status:', response.status);
        if (!response.ok) {
            throw new Error('Error deleting sessions');
        }
        return response.json();
    })
    .then(data => {
        console.log('Response data:', data);

        if (data.message) {
            console.log(data.message);
            document.getElementById('courses-info').innerHTML = data.message;
        } else {
            document.getElementById('courses-info').innerHTML = 'Sesiones eliminadas exitosamente.';
        }

        fetchCoursesAndSessions();
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('courses-info').innerHTML = 'Error deleting sessions.';
    });
}

document.getElementById('new-week-button').addEventListener('click', deleteAllSessions);
