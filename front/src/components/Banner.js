import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { Container, Row, Col } from "react-bootstrap";
import headerImg from "../assets/img/header-img.png";
import { ArrowRightCircle, Download, } from 'react-bootstrap-icons';
import { HashLink } from 'react-router-hash-link';
import 'animate.css';
import TrackVisibility from 'react-on-screen';
export const Banner = () => {
  const { t, language } = useLanguage();
  const baseUrl = (process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api').replace(/\/api$/, '');
  const cvUrl = `${baseUrl}/storage/cv_${language || 'en'}.pdf`;
  const [loopNum, setLoopNum] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [delta, setDelta] = useState(300 - Math.random() * 100);
  const [index, setIndex] = useState(1);
  const toRotate = t('banner').roles;
  const period = 2000;

  useEffect(() => {
    let ticker = setInterval(() => {
      tick();
    }, delta);

    return () => { clearInterval(ticker) };
  }, [text])

  const tick = () => {
    let i = loopNum % toRotate.length;
    let fullText = toRotate[i];
    let updatedText = isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1);

    setText(updatedText);

    if (isDeleting) {
      setDelta(prevDelta => prevDelta / 2);
    }

    if (!isDeleting && updatedText === fullText) {
      setIsDeleting(true);
      setIndex(prevIndex => prevIndex - 1);
      setDelta(period);
    } else if (isDeleting && updatedText === '') {
      setIsDeleting(false);
      setLoopNum(loopNum + 1);
      setIndex(1);
      setDelta(500);
    } else {
      setIndex(prevIndex => prevIndex + 1);
    }
  }

  return (
    <section className="banner" id="home">
      <Container>
        <Row className="aligh-items-center">
          <Col xs={12} md={6} xl={7}>
            <TrackVisibility>
              {({ isVisible }) =>
              <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                <span className="tagline">{t('banner').tagline}</span>
                <h1>{t('banner').greeting} <span className="txt-rotate" dataPeriod="1000" data-rotate='[ "Web Developer", "Full Stack Developer", "Backend Developer" ]'><span className="wrap">{text}</span></span></h1>
                  <p><strong>{t('banner').description}</strong></p>
                  
                  {/* <HashLink to='#connect'> </HashLink> */}
                  <a href={cvUrl} download='cv' target="_blank" rel="noreferrer"> 
                  <button>Download CV<Download size={25} /></button>
                  </a>
                  
              </div>}
            </TrackVisibility>
          </Col>
          <Col xs={12} md={6} xl={5}>
            <TrackVisibility>
              {({ isVisible }) =>
                <div className={isVisible ? "animate__animated animate__zoomIn" : ""}>
                  <img src={headerImg} alt="Header Img"/>
                </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
