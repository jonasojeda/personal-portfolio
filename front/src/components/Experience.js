import { Container, Row, Col } from "react-bootstrap";

export const Experience = () => {
  const experiences = [
    {
      title: "Desarrollador Full Stack",
      company: "Empresa Actual",
      date: "2023 - Presente",
      description: "Desarrollo y mantenimiento de aplicaciones web modernas. Participación en el ciclo completo de desarrollo de software, desde el diseño hasta el despliegue."
    },
    {
      title: "Desarrollador Front-End Junior",
      company: "Agencia Digital",
      date: "2021 - 2023",
      description: "Creación de interfaces de usuario interactivas y responsivas utilizando React y CSS. Colaboración estrecha con equipos de diseño."
    },
    {
      title: "Estudiante de Ingeniería / Sistemas",
      company: "Universidad Tecnológica",
      date: "2018 - 2022",
      description: "Formación académica en fundamentos de la computación, algoritmos, bases de datos y metodologías ágiles."
    }
  ];

  return (
    <section className="experience" id="experience">
      <Container>
        <Row>
          <Col size={12}>
            <div className="experience-bx wow zoomIn">
              <h2>Experiencia Profesional</h2>
              <p className="subtitle">Mi trayectoria en el desarrollo</p>
              
              <div className="timeline">
                {experiences.map((exp, index) => (
                  <div className={`timeline-container ${index % 2 === 0 ? 'left' : 'right'}`} key={index}>
                    <div className="timeline-content">
                      <h3>{exp.title}</h3>
                      <h4>{exp.company}</h4>
                      <span className="date">{exp.date}</span>
                      <p>{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
