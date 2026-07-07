import { useState, useEffect } from "react";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import { ArrowRightCircle, Calendar, Person, ArrowLeft } from 'react-bootstrap-icons';
import { useLanguage } from "../context/LanguageContext";
import { blogApi } from "../api";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const Blog = () => {
  const { t, language } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const lang = language || 'en';
        const res = await blogApi.getBlogs(lang);
        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [language]);

  const handleClose = () => setShowModal(false);
  const handleShow = (article) => {
    setSelectedArticle(article);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', options);
  };

  return (
    <section className="blog" id="blog">
      <Container>
        <div className="blog-bx wow zoomIn">
          <h2>{t('blog').title}</h2>
          <p>{t('blog').description}</p>
          <Row>
            {loading ? (
              <p className="text-white text-center w-100">Cargando blog...</p>
            ) : blogs.length === 0 ? (
              <p className="text-white text-center w-100">No hay artículos registrados en este idioma.</p>
            ) : (
              blogs.map((article, index) => {
                return (
                  <Col size={12} sm={6} md={4} key={index}>
                    <div className="blog-card" onClick={() => handleShow(article)} style={{ cursor: 'pointer' }}>
                      <div className="blog-imgbx">
                        <img src={article.cover_image || 'https://via.placeholder.com/500x300'} alt={article.title} />
                      </div>
                      <div className="blog-txtx">
                        <h4>{article.title}</h4>
                        <p>{article.excerpt}</p>
                        <span className="read-more" onClick={(e) => { e.stopPropagation(); handleShow(article); }}>
                          {t('blog').readMore} <ArrowRightCircle size={20}/>
                        </span>
                      </div>
                    </div>
                  </Col>
                )
              })
            )}
          </Row>
        </div>
      </Container>
      
      {/* Article Modal */}
      <Modal show={showModal} onHide={handleClose} fullscreen className="blog-modal">
        <Modal.Header closeButton closeVariant="white" style={{ backgroundColor: '#121212', borderBottom: 'none' }}>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: '#121212', color: '#E0E0E0', padding: '0 20px 60px 20px' }}>
          {selectedArticle && (
            <Container className="blog-reading-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <button 
                onClick={handleClose} 
                className="btn-modern-outline mb-4 d-flex align-items-center"
                style={{ border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff', padding: '8px 20px', borderRadius: '50px', background: 'transparent' }}
              >
                <ArrowLeft className="me-2" /> {language === 'es' ? 'Volver al Inicio' : 'Back to Home'}
              </button>

              <h1 className="blog-title mb-4" style={{ color: '#fff', fontSize: '3rem', fontWeight: 'bold' }}>{selectedArticle.title}</h1>
              
              <div className="blog-meta d-flex align-items-center mb-4 text-muted">
                {selectedArticle.author_name && (
                  <span className="me-4 d-flex align-items-center">
                    <Person className="me-2" /> {selectedArticle.author_name}
                  </span>
                )}
                {selectedArticle.published_at && (
                  <span className="d-flex align-items-center">
                    <Calendar className="me-2" /> {formatDate(selectedArticle.published_at)}
                  </span>
                )}
              </div>

              {selectedArticle.cover_image && (
                <img src={selectedArticle.cover_image} alt={selectedArticle.title} className="img-fluid mb-5 rounded" style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }} />
              )}
              
              <div className="blog-content text-start" style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {selectedArticle.content || selectedArticle.excerpt || ''}
                </ReactMarkdown>
              </div>

              <hr style={{ borderColor: 'rgba(255, 255, 255, 0.1)', margin: '40px 0' }} />
              
              <div className="d-flex justify-content-center">
                <button 
                  onClick={handleClose} 
                  className="btn-modern-outline d-flex align-items-center"
                  style={{ border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff', padding: '10px 24px', borderRadius: '50px', background: 'transparent' }}
                >
                  <ArrowLeft className="me-2" /> {language === 'es' ? 'Volver al Inicio' : 'Back to Home'}
                </button>
              </div>
            </Container>
          )}
        </Modal.Body>
      </Modal>
    </section>
  )
}
