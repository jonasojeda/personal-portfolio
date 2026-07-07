import { useState } from "react";
import { Container, Row, Col, Tab, Nav, Modal, Button } from "react-bootstrap";
import { useLanguage } from "../context/LanguageContext";
import { ProjectCard } from "./ProjectCard";
import pokemon from "../assets/img/pokemon-app.png";
import scaneame from "../assets/img/Scaneame.png";
import todo_app from "../assets/img/todo-app.png";
import colorSharp2 from "../assets/img/color-sharp2.png";
import 'animate.css';
import TrackVisibility from 'react-on-screen';

export const Projects = () => {
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const handleClose = () => setShowModal(false);
  const handleShow = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const projects = [
    {
      title: "Pokemon app",
      description: "Api rest Pokemon",
      longDescription: "Una aplicación completa que consume la PokeAPI para mostrar información detallada de los Pokémon, sus habilidades y estadísticas. Cuenta con búsqueda en tiempo real, filtrado por tipos, y un diseño responsivo.",
      imgUrl: pokemon,
      gitHub:"https://github.com/jonasojeda/Pokemn_App",
      deploy:"https://pokemn-app.vercel.app/",
      video:"https://www.youtube.com/watch?v=u4vDry9uJZ0&ab_channel=jonasojeda"
    },

    {
      title: "Scanea-me",
      description: "E-commerce",
      longDescription: "Plataforma de E-commerce desarrollada con tecnologías modernas. Permite a los usuarios escanear productos, agregarlos a su carrito de compras y realizar el proceso de pago de forma segura y rápida.",
      imgUrl: scaneame,
      gitHub:"https://github.com/jonasojeda/scaneaMe",
      deploy:"https://scaneame.vercel.app/home",
      video:"#"
    },
    {
      title: "ToDo App",
      description: "Todo list",
      longDescription: "Una aplicación de gestión de tareas diarias. Permite crear, editar, eliminar y marcar tareas como completadas. Implementa almacenamiento local para mantener los datos de forma persistente.",
      imgUrl: todo_app,
      gitHub:"https://github.com/jonasojeda/todo-app",
      deploy:"https://jonas-dev-todo-app.netlify.app/",
      video:"https://youtu.be/TaOhHlL7zVE"
    },
   
  ];

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
                        {
                          projects.map((project, index) => {
                            return (
                              <ProjectCard
                                key={index}
                                {...project}
                                onClick={() => handleShow(project)}
                                />
                            )
                          })
                        }
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
        <Modal.Body style={{ backgroundColor: '#151515', color: '#B8B8B8' }}>
          {selectedProject && (
            <div className="text-center">
              <img src={selectedProject.imgUrl} alt={selectedProject.title} className="img-fluid mb-4 rounded" />
              <p style={{ fontSize: '1.1rem' }}>{selectedProject.longDescription || selectedProject.description}</p>
              
              <div className="mt-4 d-flex justify-content-center gap-3">
                {selectedProject.gitHub && selectedProject.gitHub !== "#" && (
                  <Button variant="outline-light" href={selectedProject.gitHub} target="_blank">
                    Ver Código (GitHub)
                  </Button>
                )}
                {selectedProject.deploy && selectedProject.deploy !== "#" && (
                  <Button variant="primary" href={selectedProject.deploy} target="_blank" style={{ backgroundColor: '#45bafc', border: 'none' }}>
                    Visitar Proyecto
                  </Button>
                )}
                {selectedProject.video && selectedProject.video !== "#" && (
                  <Button variant="danger" href={selectedProject.video} target="_blank">
                    Ver Video
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
