import { Container, Row, Col, Tab, Nav } from "react-bootstrap";
import { ProjectCard } from "./ProjectCard";
import pokemon from "../assets/img/pokemon-app.png";
import scaneame from "../assets/img/Scaneame.png";
import todo_app from "../assets/img/todo-app.png";
import colorSharp2 from "../assets/img/color-sharp2.png";
import 'animate.css';
import TrackVisibility from 'react-on-screen';

export const Projects = () => {

  const projects = [
    {
      title: "Pokemon app",
      description: "Api rest Pokemon",
      imgUrl: pokemon,
      gitHub:"https://github.com/jonasojeda/Pokemn_App",
      deploy:"https://pokemn-app.vercel.app/",
      video:"https://www.youtube.com/watch?v=u4vDry9uJZ0&ab_channel=jonasojeda"
    },

    {
      title: "Scanea-me",
      description: "E-commerce",
      imgUrl: scaneame,
      gitHub:"https://github.com/jonasojeda/scaneaMe",
      deploy:"https://scaneame.vercel.app/home",
      video:"#"
    },
    {
      title: "ToDo App",
      description: "Todo list",
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
                <h2>Projects</h2>
                <p>My completed projects are:</p>
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
    </section>
  )
}
