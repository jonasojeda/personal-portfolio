import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useLanguage } from "../context/LanguageContext";
import { experienceApi } from "../api";

export const Experience = () => {
  const { t, language } = useLanguage();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        // Default to 'en' if language isn't set
        const lang = language || 'en';
        const res = await experienceApi.getExperiences(lang);
        setExperiences(res.data);
      } catch (err) {
        console.error("Error fetching experiences", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperiences();
  }, [language]);

  return (
    <section className="experience" id="experience">
      <Container>
        <Row>
          <Col size={12}>
            <div className="experience-bx wow zoomIn">
              <h2>{t('experience').title}</h2>
              <p className="subtitle">{t('experience').subtitle}</p>
              
              {loading ? (
                <p className="text-center text-white mt-4">Cargando...</p>
              ) : experiences.length === 0 ? (
                <p className="text-center text-white mt-4">No hay experiencias registradas en este idioma.</p>
              ) : (
                <div className="timeline">
                  {experiences.map((exp, index) => (
                    <div className={`timeline-container ${index % 2 === 0 ? 'left' : 'right'}`} key={index}>
                      <div className="timeline-content">
                        <h3>{exp.title}</h3>
                        <h4>{exp.company}</h4>
                        <span className="date">{exp.date}</span>
                        <p style={{ whiteSpace: 'pre-line' }}>{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
