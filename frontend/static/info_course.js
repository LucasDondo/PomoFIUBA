document.addEventListener('DOMContentLoaded', function() {
    function fetchCoursesAndSessions() {
        // Obtener cursos
        fetch('http://localhost:5000/cursos')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching courses');
                }
                return response.json();
            })
            .then(courses => {
                // Obtener sesiones
                return fetch('http://localhost:5000/sesiones')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error fetching sessions');
                        }
                        return response.json();
                    })
                    .then(sessions => {
                        // Procesar y combinar los datos
                        const coursesInfo = courses.map(course => {
                            const courseSessions = sessions.filter(session => session.course_id === course.id);
                            const totalMinutes = courseSessions.reduce((acc, session) => acc + session.mins_studied, 0);
                            const sessionsCount = courseSessions.length;

                            // Calcular tiempo de estudio recomendado
                            const minHours = course.credits * 2; // 2 horas por crédito
                            const maxHours = course.credits * 3; // 3 horas por crédito

                            return {
                                id: course.id,
                                name: course.name,
                                credits: course.credits,
                                sessions_count: sessionsCount,
                                total_minutes: totalMinutes,
                                recommended_min_hours: minHours,
                                recommended_max_hours: maxHours
                            };
                        });

                        // Mostrar la información en el contenedor
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
                                <p>Tiempo de estudio recomendado: ${course.recommended_min_hours} - ${course.recommended_max_hours} horas por semana</p>
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

    fetchCoursesAndSessions(); // Cargar la información de los cursos y sesiones al cargar la página
});
