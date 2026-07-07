import { Col } from "react-bootstrap";
import navIcon2 from '../assets/img/github7.png';
import yt from '../assets/img/YouTube.svg.png';
import link from '../assets/img/link.png'
import { Github, Youtube } from 'react-bootstrap-icons';
export const ProjectCard = ({ title, description, media, github_url, video, deploy_url, onClick }) => {
  const primaryMedia = media && media.find(m => m.type === 'image');
  const imgUrl = primaryMedia ? primaryMedia.url : 'https://via.placeholder.com/400x300?text=No+Image';

  return (
    <Col size={12} sm={6} md={4}>
      <div className="proj-imgbx" onClick={onClick} style={{ cursor: 'pointer' }}>
        <img src={imgUrl} alt={title} />
        <div className="proj-txtx">
          <h4>{title}</h4>
          <span>{description}</span>
          <br/>
          <div className="social-icon">
            {github_url && github_url !== '#' && <a href={github_url} target='_blank' onClick={(e) => e.stopPropagation()}><img src={navIcon2} alt="GitHub" /></a>}
            {video && video !== '#' && <a href={video} target='_blank' onClick={(e) => e.stopPropagation()}><img src={yt} alt="YouTube" /></a>}
            {deploy_url && deploy_url !== '#' && <a href={deploy_url} target='_blank' onClick={(e) => e.stopPropagation()}><img src={link} alt="Deploy" /></a>}
          </div>         
        </div>
      </div>
    </Col>
  )
}
