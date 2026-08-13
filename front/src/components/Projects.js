import { useState, useEffect } from "react";
import { Container, Row, Col, Tab, Nav, Modal, Button, Carousel } from "react-bootstrap";
import { useLanguage } from "../context/LanguageContext";
import { ProjectCard } from "./ProjectCard";
import { projectApi } from "../api";
import colorSharp2 from "../assets/img/color-sharp2.png";
import 'animate.css';
import TrackVisibility from 'react-on-screen';

export const Projects = () => {
  const { t, language } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const lang = language || 'en';
        const res = await projectApi.getProjects(lang);
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [language]);

  const handleClose = () => setShowModal(false);
  const handleShow = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <section className="project" id="project">
      <Container>
        <Row>
          <Col size={12}>
            <TrackVisibility>
              {({ isVisible }) =>
              <div className={isVisible ? "animate__animated animate__fadeIn": ""}>
                <h2>{t('projects').title}</h2>
                <p>{t('projects').description}</p>
                <Tab.Container id="projects-tabs" defaultActiveKey="first">
                  <Nav variant="pills" className="nav-pills mb-5 justify-content-center align-items-center" id="pills-tab">
                    
                  </Nav>
                  <Tab.Content id="slideInUp" className={isVisible ? "animate__animated animate__slideInUp" : ""}>
                    <Tab.Pane eventKey="first">
                      <Row>
                        {loading ? (
                          <p className="text-white text-center w-100">Cargando proyectos...</p>
                        ) : projects.length === 0 ? (
                          <p className="text-white text-center w-100">No hay proyectos registrados en este idioma.</p>
                        ) : (
                          projects.map((project, index) => {
                            return (
                              <ProjectCard
                                key={index}
                                {...project}
                                onClick={() => handleShow(project)}
                              />
                            )
                          })
                        )}
                      </Row>
                    </Tab.Pane>
                    <Tab.Pane eventKey="section">
                      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque quam, quod neque provident velit, rem explicabo excepturi id illo molestiae blanditiis, eligendi dicta officiis asperiores delectus quasi inventore debitis quo.</p>
                    </Tab.Pane>
                    <Tab.Pane eventKey="third">
                      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque quam, quod neque provident velit, rem explicabo excepturi id illo molestiae blanditiis, eligendi dicta officiis asperiores delectus quasi inventore debitis quo.</p>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
              </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
      <img className="background-image-right" src={colorSharp2}></img>
      
      {/* Project Details Modal */}
      <Modal show={showModal} onHide={handleClose} centered size="lg" className="project-modal">
        <Modal.Header closeButton closeVariant="white" style={{ backgroundColor: '#151515', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <Modal.Title style={{ color: '#fff' }}>{selectedProject?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#151515', color: '#B8B8B8', maxHeight: 'calc(100vh - 210px)', overflowY: 'auto' }}>
          {selectedProject && (
            <div className="text-center">
              {selectedProject.media && selectedProject.media.length > 0 ? (
                selectedProject.media.length === 1 ? (
                  // Display single media
                  selectedProject.media[0].type === 'image' ? (
                    <div className="mb-4 d-flex justify-content-center align-items-center" style={{ height: '350px', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden' }}>
                      <img src={selectedProject.media[0].url} alt={selectedProject.title} className="img-fluid" style={{ objectFit: 'contain', maxHeight: '100%', maxWidth: '100%' }} />
                    </div>
                  ) : (
                    <div className="ratio ratio-16x9 mb-4" style={{ maxHeight: '350px' }}>
                      <iframe src={`https://www.youtube.com/embed/${getYoutubeId(selectedProject.media[0].url)}`} title={selectedProject.title} allowFullScreen></iframe>
                    </div>
                  )
                ) : (
                  // Display carousel for multiple media
                  <Carousel className="mb-4 project-carousel">
                    {selectedProject.media.map((m, idx) => (
                      <Carousel.Item key={idx}>
                        {m.type === 'image' ? (
                          <div className="d-flex justify-content-center align-items-center" style={{ height: '350px', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden' }}>
                            <img src={m.url} alt={`${selectedProject.title} ${idx}`} className="img-fluid" style={{ objectFit: 'contain', maxHeight: '100%', maxWidth: '100%' }} />
                          </div>
                        ) : (
                          <div className="ratio ratio-16x9" style={{ maxHeight: '350px' }}>
                            <iframe src={`https://www.youtube.com/embed/${getYoutubeId(m.url)}`} title={selectedProject.title} allowFullScreen></iframe>
                          </div>
                        )}
                      </Carousel.Item>
                    ))}
                  </Carousel>
                )
              ) : (
                <div className="mb-4 d-flex justify-content-center align-items-center" style={{ height: '350px', backgroundColor: '#000', borderRadius: '8px', overflow: 'hidden' }}>
                  <img src="https://via.placeholder.com/800x400?text=No+Media" alt={selectedProject.title} className="img-fluid" style={{ objectFit: 'contain', maxHeight: '100%', maxWidth: '100%' }} />
                </div>
              )}
              
              <p style={{ fontSize: '1.1rem', whiteSpace: 'pre-line' }}>{selectedProject.long_description || selectedProject.description}</p>
              
              <div className="mt-4 d-flex justify-content-center gap-3">
                {selectedProject.github_url && selectedProject.github_url !== "#" && (
                  <Button variant="outline-light" href={selectedProject.github_url} target="_blank">
                    Ver Código (GitHub)
                  </Button>
                )}
                {selectedProject.deploy_url && selectedProject.deploy_url !== "#" && (
                  <Button variant="primary" href={selectedProject.deploy_url} target="_blank" style={{ backgroundColor: '#45bafc', border: 'none' }}>
                    Visitar Proyecto
                  </Button>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </section>
  )
}
