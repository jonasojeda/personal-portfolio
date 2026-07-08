import { Container, Row, Col } from "react-bootstrap";

import { useLanguage } from "../context/LanguageContext";
import logo from "../assets/img/logo.png";
import navIcon1 from '../assets/img/nav-icon1.svg';
import navIcon2 from '../assets/img/github7.png';

export const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <Container>
        <Row className="align-items-center">
          
          <Col size={12} sm={6}>
            <img src={logo} alt="Logo" />
          </Col>
          <Col size={12} sm={6} className="text-center text-sm-end">
            <div className="social-icon">
              <a href={t('footer').linkedin || "https://www.linkedin.com/in/jonas-ojeda-18308a1ab/"} target='_blank'><img src={navIcon1} alt="LinkedIn" /></a>
              <a href={t('footer').github || "https://github.com/jonasojeda"} target='_blank'><img src={navIcon2} alt="GitHub" /></a>
            </div>
            <p>{t('footer').copyRight}</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}
