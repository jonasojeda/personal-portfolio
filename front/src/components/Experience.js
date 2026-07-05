import { Container, Row, Col } from "react-bootstrap";
import { useLanguage } from "../context/LanguageContext";

export const Experience = () => {
  const { t } = useLanguage();
  const experiences = t('experience').roles;

  return (
    <section className="experience" id="experience">
      <Container>
        <Row>
          <Col size={12}>
            <div className="experience-bx wow zoomIn">
              <h2>{t('experience').title}</h2>
              <p className="subtitle">{t('experience').subtitle}</p>
              
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
