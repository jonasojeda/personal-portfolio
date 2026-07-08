import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { contactApi } from "../api";
import { Container, Row, Col } from "react-bootstrap";
import emailjs from '@emailjs/browser'
import contactImg from "../assets/img/contact-img.svg";
import 'animate.css';
import TrackVisibility from 'react-on-screen';
import validator from "./validator";


export const Contact = () => {

  const formInitialDetails = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  }
  const { t } = useLanguage();
  const [formDetails, setFormDetails] = useState(formInitialDetails);
  const [buttonText, setButtonText] = useState(t('contact').send);
  const [status, setStatus] = useState({});

  const onFormUpdate = (category, value) => {
      setFormDetails({
        ...formDetails,
        [category]: value
      })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check local storage for recent submissions
    let submissions = JSON.parse(localStorage.getItem('contact_submissions') || '[]');
    const now = new Date().getTime();
    // Keep only submissions from the last 60 minutes
    submissions = submissions.filter(time => now - time < 3600000);
    
    if (submissions.length >= 10) {
      const oldestTime = Math.min(...submissions);
      const minutesLeft = Math.ceil((3600000 - (now - oldestTime)) / 60000);
      setStatus({clas:'alert alert-warning', succes: false, message: `Has alcanzado el límite de 10 mensajes. Por favor, espera ${minutesLeft} minutos.`});
      return;
    }

    if(formDetails.email && formDetails.firstName && formDetails.lastName && formDetails.message){
      setButtonText(t('contact').sending);
      
      let backendSuccess = false;
      try {
        await contactApi.submitMessage({
          first_name: formDetails.firstName,
          last_name: formDetails.lastName,
          email: formDetails.email,
          phone: formDetails.phone || null,
          message: formDetails.message
        });
        backendSuccess = true;
      } catch (err) {
        console.error("Error saving message to database:", err);
        if (err.response && err.response.status === 429) {
           setButtonText(t('contact').send);
           setStatus({clas:'alert alert-warning', succes: false, message: 'Demasiadas solicitudes. Por favor intenta más tarde.'});
           return; // Stop execution, don't send EmailJS
        }
      }

      let res;
      if (backendSuccess) {
        try {
          res = await emailjs.sendForm('service_yyw7gpo','template_pjbi0oa',e.target,'6CtWNYVRNqRmedPgn');
        } catch (err) {
          console.error("Error sending email via EmailJS:", err);
        }
      }
      
      setButtonText(t('contact').send);
      setFormDetails(formInitialDetails);

      if (backendSuccess || (res && res.status === 200)) {
        submissions.push(new Date().getTime());
        localStorage.setItem('contact_submissions', JSON.stringify(submissions));
        setStatus({clas:'alert alert-success', succes: true, message: t('contact').success});
      } else {
        setStatus({ clas:'alert alert-danger', succes: false, message: t('contact').error});
      }
    }else{
      setStatus({clas:'alert alert-danger', succes: true, message: 'Please complete the required fields *.'});
    }
  };

  return (
    <section className="contact" id="connect">
      <Container>
        <Row className="align-items-center">
          <Col size={12} md={6}>
            <TrackVisibility>
              {({ isVisible }) =>
                <img className={isVisible ? "animate__animated animate__zoomIn" : ""} src={contactImg} alt="Contact Us"/>
              }
            </TrackVisibility>
          </Col>
          <Col size={12} md={6}>
            <TrackVisibility>
              {({ isVisible }) =>
                <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                <h2>{t('contact').title}</h2>
                <form onSubmit={handleSubmit}>
                  <Row>
                    <Col size={12} sm={6} className="px-1">
                      <input name="firstName" type="text" value={formDetails.firstName} placeholder={`${t('contact').firstName} *`} onChange={(e) => onFormUpdate('firstName', e.target.value)} />
                    </Col>
                    <Col size={12} sm={6} className="px-1">
                      <input name="lastName" type="text" value={formDetails.lastName} placeholder={`${t('contact').lastName} *`} onChange={(e) => onFormUpdate('lastName', e.target.value)}/>
                    </Col>
                    <Col size={12} sm={6} className="px-1">
                      <input name="email" type="email" value={formDetails.email} placeholder={`${t('contact').email} *`} onChange={(e) => onFormUpdate('email', e.target.value)} />
                    </Col>
                    <Col size={12} sm={6} className="px-1">
                      <input name="phone" type="tel" value={formDetails.phone} placeholder={t('contact').phone} onChange={(e) => onFormUpdate('phone', e.target.value)}/>
                    </Col>
                    <Col size={12} className="px-1">
                      <textarea name="message" rows="6" value={formDetails.message} placeholder={`${t('contact').message} *`} onChange={(e) => onFormUpdate('message', e.target.value)}></textarea>
                      {
                      status.message &&
                        
                        <div class={status.clas} role="alert">
                          {status.message}
                        </div>
                        // <div className={status.success === false ? "alert alert-error shadow-lg" : "alert alert-success shadow-lg"}>
                        // <div>
                        //   <span>{status.message}</span>
                        // </div>
                        // </div>
                      }
                      <button type="submit"><span>{buttonText}</span></button>
                    </Col>
                    
                  </Row>
                </form>
              </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
