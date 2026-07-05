import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import 'animate.css';
import TrackVisibility from 'react-on-screen';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, error } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    
    if (success) {
      navigate('/dashboard');
    }
  };

  const handleAutocomplete = () => {
    setEmail('admin@yopmail.com');
    setPassword('1234');
  };

  return (
    <section className="login-section d-flex align-items-center justify-content-center">
      <div className="login-grid-overlay"></div>
      <Container>
        <Row className="align-items-center justify-content-center">
          <Col size={12} md={8} lg={6}>
            <TrackVisibility>
              {({ isVisible }) =>
                <div className={isVisible ? "animate__animated animate__fadeIn" : ""}>
                  <div className="login-bx-modern">
                    
                    <div className="access-tag">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
                      </svg>
                      ACCESO RESTRINGIDO
                    </div>

                    <h2>PANEL <span className="highlight-text">INTERNO</span></h2>
                    <p className="login-subtitle">Ingresa tus credenciales para gestionar el contenido de tu Portfolio.</p>
                    
                    {error && <div className="alert alert-danger custom-alert">{error}</div>}
                    
                    <form onSubmit={handleLogin} className="login-form-modern">
                      <div className="form-group-modern">
                        <label>EMAIL</label>
                        <div className="input-container-modern">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="input-icon">
                            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                          </svg>
                          <input 
                            type="email" 
                            value={email} 
                            placeholder="admin@yopmail.com" 
                            onChange={(e) => setEmail(e.target.value)} 
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group-modern">
                        <label>CONTRASEÑA</label>
                        <div className="input-container-modern">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="input-icon">
                            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/>
                          </svg>
                          <input 
                            type="password" 
                            value={password} 
                            placeholder="••••" 
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <button type="submit" disabled={loading} className="login-btn-modern">
                        <span>{loading ? 'INGRESANDO...' : 'INGRESAR'}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                        </svg>
                      </button>
                    </form>

                    <div className="login-credentials-info">
                      <h6>CREDENCIALES DE ACCESO</h6>
                      <p>Usa las credenciales provistas por el administrador o presiona el botón inferior.</p>
                      <button onClick={handleAutocomplete} className="autocomplete-link">
                        Auto-completar credenciales admin
                      </button>
                    </div>
                  </div>
                  
                  <div className="back-to-site">
                    <Link to="/">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                      </svg>
                      VOLVER AL SITIO
                    </Link>
                  </div>

                </div>}
            </TrackVisibility>
          </Col>
        </Row>
      </Container>
    </section>
  );
};
