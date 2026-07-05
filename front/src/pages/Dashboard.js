import { useState } from 'react';
import { Container, Row, Col, Tab, Nav } from 'react-bootstrap';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const { translations, updateTranslation } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSave = (lang, section, key, value) => {
    updateTranslation(lang, section, key, value);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Simple editor for string values
  const renderStringEditor = (lang, section) => {
    const sectionData = translations[lang][section];
    if (!sectionData) return null;

    return Object.keys(sectionData).map(key => {
      const val = sectionData[key];
      // Only handle direct strings for simplicity in this dashboard
      if (typeof val === 'string') {
        return (
          <div key={key} className="mb-3">
            <label className="text-white d-block mb-1">{key}</label>
            <textarea
              className="form-control"
              value={val}
              onChange={(e) => handleSave(lang, section, key, e.target.value)}
              style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
            />
          </div>
        );
      }
      return null;
    });
  };

  return (
    <section className="dashboard" style={{ padding: '100px 0', minHeight: '100vh', background: '#121212' }}>
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h2 className="text-white">Admin Dashboard</h2>
          <div>
            <button onClick={() => navigate('/')} className="btn btn-outline-info me-3">View Site</button>
            <button onClick={handleLogout} className="btn btn-outline-danger">Logout</button>
          </div>
        </div>

        <div className="dashboard-bx" style={{ background: '#151515', padding: '40px', borderRadius: '30px' }}>
          <h4 className="text-white mb-4">Edit Landing Page Content</h4>
          
          <Tab.Container id="dashboard-tabs" defaultActiveKey="en">
            <Nav variant="pills" className="nav-pills mb-4">
              <Nav.Item>
                <Nav.Link eventKey="en" style={{ cursor: 'pointer' }}>English</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="es" style={{ cursor: 'pointer' }}>Español</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="en">
                <Row>
                  <Col md={6}>
                    <h5 className="text-info mb-3">Banner Section</h5>
                    {renderStringEditor('en', 'banner')}
                  </Col>
                  <Col md={6}>
                    <h5 className="text-info mb-3">Contact Section</h5>
                    {renderStringEditor('en', 'contact')}
                  </Col>
                </Row>
              </Tab.Pane>
              
              <Tab.Pane eventKey="es">
                <Row>
                  <Col md={6}>
                    <h5 className="text-info mb-3">Sección Banner</h5>
                    {renderStringEditor('es', 'banner')}
                  </Col>
                  <Col md={6}>
                    <h5 className="text-info mb-3">Sección Contacto</h5>
                    {renderStringEditor('es', 'contact')}
                  </Col>
                </Row>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </Container>
    </section>
  );
};
