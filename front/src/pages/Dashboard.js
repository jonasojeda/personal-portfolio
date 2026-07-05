import { useState } from 'react';
import { Container, Row, Col, Tab, Nav } from 'react-bootstrap';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/img/logo.png';

export const Dashboard = () => {
  const { translations, updateTranslation } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSave = (lang, section, key, value) => {
    updateTranslation(lang, section, key, value);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Simple editor for string values
  const renderStringEditor = (section) => {
    const sectionDataEn = translations['en'][section];
    const sectionDataEs = translations['es'][section];
    if (!sectionDataEn || !sectionDataEs) return <p className="text-muted">No editable text found for this section.</p>;

    return Object.keys(sectionDataEn).map(key => {
      const valEn = sectionDataEn[key];
      const valEs = sectionDataEs[key];
      
      // Only handle direct strings for simplicity in this dashboard mockup
      if (typeof valEn === 'string') {
        return (
          <div key={key} className="dashboard-edit-group mb-4">
            <label className="dashboard-label">{key.toUpperCase()}</label>
            <Row>
              <Col md={6}>
                <div className="input-container-modern mb-2">
                  <span className="lang-badge">EN</span>
                  <textarea
                    className="dashboard-input"
                    value={valEn}
                    onChange={(e) => handleSave('en', section, key, e.target.value)}
                    rows={valEn.length > 50 ? 3 : 1}
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="input-container-modern mb-2">
                  <span className="lang-badge">ES</span>
                  <textarea
                    className="dashboard-input"
                    value={valEs}
                    onChange={(e) => handleSave('es', section, key, e.target.value)}
                    rows={valEs.length > 50 ? 3 : 1}
                  />
                </div>
              </Col>
            </Row>
          </div>
        );
      }
      return null;
    });
  };

  const sections = [
    { id: 'banner', name: 'Banner' },
    { id: 'skills', name: 'Skills' },
    { id: 'experience', name: 'Experience' },
    { id: 'projects', name: 'Projects' },
    { id: 'blog', name: 'Blog' },
    { id: 'contact', name: 'Contact' },
    { id: 'footer', name: 'Footer' },
  ];

  return (
    <section className="dashboard-layout">
      <div className="login-grid-overlay"></div>
      
      <Tab.Container id="dashboard-tabs" defaultActiveKey="banner">
        <aside className={`sidebar-full ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
            {sidebarOpen ? (
              <img src={logo} alt="Logo" style={{ maxWidth: '100%', maxHeight: '40px', width: 'auto', objectFit: 'contain' }} />
            ) : (
              <img src={logo} alt="Logo" style={{ maxWidth: '100%', maxHeight: '30px', width: 'auto', objectFit: 'contain' }} />
            )}
          </div>

          <div className="sidebar-subtitle">
            {sidebarOpen ? 'PANEL ADMIN' : '---'}
          </div>

          <Nav variant="pills" className="flex-column dashboard-nav">
            {sections.map(sec => (
              <Nav.Item key={sec.id}>
                <Nav.Link eventKey={sec.id} title={sec.name}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="nav-icon" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M2 13.5V7h1v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7h1v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5zm11-11V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"/>
                    <path fillRule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"/>
                  </svg>
                  {sidebarOpen && <span className="nav-text">{sec.name}</span>}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>

          <div className="sidebar-footer">
            <button className="sidebar-logout-btn" onClick={handleLogout} title="Cerrar Sesión">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="nav-icon" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
              </svg>
              {sidebarOpen && <span className="nav-text">Cerrar Sesión</span>}
            </button>
            <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                {sidebarOpen ? (
                  <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                ) : (
                  <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                )}
              </svg>
            </button>
          </div>
        </aside>

        <main className="main-content">
          <header className="main-header">
            <div>
              <h1 className="header-title">EDICIÓN DE CONTENIDO</h1>
              <p className="header-subtitle">PORTFOLIO PERSONAL <span>ACTUALIZACIÓN EN VIVO</span></p>
            </div>
            <div className="header-actions">
              <button className="btn-modern-outline me-3" onClick={() => navigate('/')}>Ir al Sitio</button>
              <div className="status-indicator">
                <span className="dot"></span>
                <span>En línea</span>
              </div>
            </div>
          </header>

          <div className="dashboard-content-scroll">
            <Tab.Content>
              {sections.map(sec => (
                <Tab.Pane eventKey={sec.id} key={sec.id}>
                  <div className="dashboard-card">
                    <h4 className="content-title">Sección: <span className="highlight-text">{sec.name}</span></h4>
                    <p className="text-muted mb-4">Los cambios que guardes aquí se reflejarán instantáneamente en la web.</p>
                    <div className="editor-container">
                      {renderStringEditor(sec.id)}
                    </div>
                  </div>
                </Tab.Pane>
              ))}
            </Tab.Content>
          </div>
        </main>
      </Tab.Container>
    </section>
  );
};
