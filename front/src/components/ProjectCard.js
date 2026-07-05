import { Col } from "react-bootstrap";
import navIcon2 from '../assets/img/github7.png';
import yt from '../assets/img/YouTube.svg.png';
import link from '../assets/img/link.png'
import { Github, Youtube } from 'react-bootstrap-icons';
export const ProjectCard = ({ title, description, imgUrl, gitHub, video, deploy}) => {
  return (
    <Col size={12} sm={6} md={4}>
      <div className="proj-imgbx">
        <img src={imgUrl} />
        <div className="proj-txtx">
          <h4>{title}</h4>
          <span>{description}</span>
          <br/>
          <div className="social-icon">
            <a href={gitHub} target='_blank'><img src={navIcon2} alt="" /></a>    
            <a href={video} target='_blank'><img src={yt} alt="" /></a>  
            <a href={deploy} target='_blank'><img src={link} alt="" /></a>    
          </div>         
        </div>
      </div>
    </Col>
  )
}
