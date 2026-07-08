import { useState, useEffect } from 'react';
import { Container, Row, Col, Tab, Nav } from 'react-bootstrap';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/img/logo.png';
import { cvApi, skillsApi, experienceApi, projectApi, blogApi, contactApi, authApi } from '../api';


export const Dashboard = () => {
  const { translations, updateTranslation } = useLanguage();
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('banner');
  const [unreadCount, setUnreadCount] = useState(0);
  
  const [contactFilterStatus, setContactFilterStatus] = useState('all');
  const [contactStartDate, setContactStartDate] = useState('');
  const [contactEndDate, setContactEndDate] = useState('');
  
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profileCurrentPassword, setProfileCurrentPassword] = useState('');
  const [profileNewPassword, setProfileNewPassword] = useState('');
  const [profileConfirmPassword, setProfileConfirmPassword] = useState('');
  const [profileUpdateStatus, setProfileUpdateStatus] = useState(null);

  const [cvUploadStatusEn, setCvUploadStatusEn] = useState('');
  const [cvUploadStatusEs, setCvUploadStatusEs] = useState('');

  const [skills, setSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);

  const [experiencesEn, setExperiencesEn] = useState([]);
  const [experiencesEs, setExperiencesEs] = useState([]);
  const [loadingExp, setLoadingExp] = useState(false);

  const [projectsEn, setProjectsEn] = useState([]);
  const [projectsEs, setProjectsEs] = useState([]);
  const [loadingProj, setLoadingProj] = useState(false);

  const [blogsEn, setBlogsEn] = useState([]);
  const [blogsEs, setBlogsEs] = useState([]);
  const [loadingBlog, setLoadingBlog] = useState(false);

  const [contactMessages, setContactMessages] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);

  useEffect(() => {
    fetchSkills();
    fetchExperiences();
    fetchProjects();
    fetchBlogs();
    fetchContactMessages();

    // Poll for new messages every 30 seconds
    const interval = setInterval(() => {
      fetchContactMessages(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoadingBlog(true);
      const resEn = await blogApi.getBlogs('en');
      const resEs = await blogApi.getBlogs('es');
      setBlogsEn(resEn.data);
      setBlogsEs(resEs.data);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoadingBlog(false);
    }
  };

  const fetchContactMessages = async (isPolling = false) => {
    try {
      if (!isPolling) setLoadingContacts(true);
      const res = await contactApi.getMessages();
      setContactMessages(res.data);
      
      // Calculate unread count using is_read attribute
      const unread = res.data.filter(msg => !msg.is_read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Error fetching contact messages:', err);
    } finally {
      if (!isPolling) setLoadingContacts(false);
    }
  };

  const markContactMessageRead = async (id, currentStatus) => {
    try {
      const res = await contactApi.updateMessage(id, { is_read: !currentStatus });
      setContactMessages(contactMessages.map(msg => msg.id === id ? res.data.data : msg));
      
      // Update unread count immediately
      const updatedMessages = contactMessages.map(msg => msg.id === id ? res.data.data : msg);
      setUnreadCount(updatedMessages.filter(msg => !msg.is_read).length);
    } catch (err) {
      console.error('Error updating message status:', err);
      alert('Error al actualizar el estado del mensaje.');
    }
  };

  const deleteContactMessage = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este mensaje?')) return;
    try {
      await contactApi.deleteMessage(id);
      setContactMessages(contactMessages.filter(msg => msg.id !== id));
      alert('Mensaje de contacto eliminado.');
    } catch (err) {
      console.error('Error deleting contact message:', err);
      alert('Error al eliminar el mensaje.');
    }
  };

  const fetchProjects = async () => {
    try {
      setLoadingProj(true);
      const resEn = await projectApi.getProjects('en');
      const resEs = await projectApi.getProjects('es');
      setProjectsEn(resEn.data);
      setProjectsEs(resEs.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoadingProj(false);
    }
  };

  const fetchExperiences = async () => {
    try {
      setLoadingExp(true);
      const resEn = await experienceApi.getExperiences('en');
      const resEs = await experienceApi.getExperiences('es');
      setExperiencesEn(resEn.data);
      setExperiencesEs(resEs.data);
    } catch (err) {
      console.error('Error fetching experiences:', err);
    } finally {
      setLoadingExp(false);
    }
  };

  const fetchSkills = async () => {
    try {
      setLoadingSkills(true);
      const res = await skillsApi.getSkills();
      setSkills(res.data);
    } catch (err) {
      console.error('Error fetching skills:', err);
    } finally {
      setLoadingSkills(false);
    }
  };

  const handleCVUpload = async (e, lang) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('cv', file);
    formData.append('lang', lang);

    const setStatus = lang === 'en' ? setCvUploadStatusEn : setCvUploadStatusEs;

    setStatus('Uploading...');
    try {
      await cvApi.uploadCV(formData);
      setStatus('CV uploaded successfully!');
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      console.error(err);
      setStatus('Error uploading CV.');
    }
  };

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
        if (section === 'footer' && !['linkedin', 'github'].includes(key)) return null;
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

  const renderHeroEditor = () => {
    const bannerEn = translations['en']['banner'] || {};
    const bannerEs = translations['es']['banner'] || {};

    const handleFieldChange = (lang, key, value) => {
      updateTranslation(lang, 'banner', key, value);
    };

    const handleRoleChange = (lang, index, value) => {
      const currentRoles = [...(lang === 'en' ? bannerEn.roles : bannerEs.roles)];
      currentRoles[index] = value;
      updateTranslation(lang, 'banner', 'roles', currentRoles);
    };

    const addRole = (lang) => {
      const currentRoles = [...(lang === 'en' ? bannerEn.roles : bannerEs.roles)];
      currentRoles.push('');
      updateTranslation(lang, 'banner', 'roles', currentRoles);
    };

    const removeRole = (lang, index) => {
      const currentRoles = [...(lang === 'en' ? bannerEn.roles : bannerEs.roles)];
      if (currentRoles.length > 1) {
        currentRoles.splice(index, 1);
        updateTranslation(lang, 'banner', 'roles', currentRoles);
      }
    };

    return (
      <div className="hero-config-form">
        {/* Row for basic string fields */}
        <div className="dashboard-subsection mb-5">
          <h5 className="subsection-title">Información Principal / Main Info</h5>
          <p className="subsection-desc">Configura los textos principales que aparecen estáticos en tu banner de presentación.</p>
          
          {/* Tagline */}
          <div className="dashboard-edit-group mb-4">
            <label className="dashboard-label">TAGLINE</label>
            <Row>
              <Col md={6}>
                <div className="input-container-modern mb-2">
                  <span className="lang-badge">EN</span>
                  <input
                    type="text"
                    className="dashboard-input"
                    value={bannerEn.tagline || ''}
                    onChange={(e) => handleFieldChange('en', 'tagline', e.target.value)}
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="input-container-modern mb-2">
                  <span className="lang-badge">ES</span>
                  <input
                    type="text"
                    className="dashboard-input"
                    value={bannerEs.tagline || ''}
                    onChange={(e) => handleFieldChange('es', 'tagline', e.target.value)}
                  />
                </div>
              </Col>
            </Row>
          </div>

          {/* Greeting */}
          <div className="dashboard-edit-group mb-4">
            <label className="dashboard-label">GREETING / SALUDO</label>
            <Row>
              <Col md={6}>
                <div className="input-container-modern mb-2">
                  <span className="lang-badge">EN</span>
                  <input
                    type="text"
                    className="dashboard-input"
                    value={bannerEn.greeting || ''}
                    onChange={(e) => handleFieldChange('en', 'greeting', e.target.value)}
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="input-container-modern mb-2">
                  <span className="lang-badge">ES</span>
                  <input
                    type="text"
                    className="dashboard-input"
                    value={bannerEs.greeting || ''}
                    onChange={(e) => handleFieldChange('es', 'greeting', e.target.value)}
                  />
                </div>
              </Col>
            </Row>
          </div>

          {/* Description */}
          <div className="dashboard-edit-group mb-4">
            <label className="dashboard-label">DESCRIPTION / DESCRIPCIÓN</label>
            <Row>
              <Col md={6}>
                <div className="input-container-modern mb-2">
                  <span className="lang-badge">EN</span>
                  <textarea
                    className="dashboard-input"
                    value={bannerEn.description || ''}
                    onChange={(e) => handleFieldChange('en', 'description', e.target.value)}
                    rows={4}
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="input-container-modern mb-2">
                  <span className="lang-badge">ES</span>
                  <textarea
                    className="dashboard-input"
                    value={bannerEs.description || ''}
                    onChange={(e) => handleFieldChange('es', 'description', e.target.value)}
                    rows={4}
                  />
                </div>
              </Col>
            </Row>
          </div>

          {/* Connect / CTA Button Text */}
          <div className="dashboard-edit-group mb-4">
            <label className="dashboard-label">CONNECT BUTTON / BOTÓN CONECTAR</label>
            <Row>
              <Col md={6}>
                <div className="input-container-modern mb-2">
                  <span className="lang-badge">EN</span>
                  <input
                    type="text"
                    className="dashboard-input"
                    value={bannerEn.connect || ''}
                    onChange={(e) => handleFieldChange('en', 'connect', e.target.value)}
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="input-container-modern mb-2">
                  <span className="lang-badge">ES</span>
                  <input
                    type="text"
                    className="dashboard-input"
                    value={bannerEs.connect || ''}
                    onChange={(e) => handleFieldChange('es', 'connect', e.target.value)}
                  />
                </div>
              </Col>
            </Row>
          </div>
          
          {/* CV Upload */}
          <div className="dashboard-edit-group mb-4">
            <label className="dashboard-label">CURRICULUM VITAE (PDF)</label>
            <Row>
              <Col md={6}>
                <div className="input-container-modern mb-2">
                  <span className="lang-badge">EN</span>
                  <input
                    type="file"
                    accept=".pdf"
                    className="dashboard-input"
                    onChange={(e) => handleCVUpload(e, 'en')}
                  />
                </div>
                {cvUploadStatusEn && <p className={`mt-2 ${cvUploadStatusEn.includes('Error') ? 'text-danger' : 'text-success'}`}>{cvUploadStatusEn}</p>}
              </Col>
              <Col md={6}>
                <div className="input-container-modern mb-2">
                  <span className="lang-badge">ES</span>
                  <input
                    type="file"
                    accept=".pdf"
                    className="dashboard-input"
                    onChange={(e) => handleCVUpload(e, 'es')}
                  />
                </div>
                {cvUploadStatusEs && <p className={`mt-2 ${cvUploadStatusEs.includes('Error') ? 'text-danger' : 'text-success'}`}>{cvUploadStatusEs}</p>}
              </Col>
            </Row>
          </div>
        </div>

        {/* Roles Section */}
        <div className="dashboard-subsection mt-5">
          <h5 className="subsection-title">Roles de Rotación / Rotating Roles</h5>
          <p className="subsection-desc">Configura los títulos profesionales que cambian con la animación de escritura en la cabecera.</p>
          
          <Row>
            {/* English Roles */}
            <Col md={6}>
              <div className="roles-column-box p-3 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="lang-badge bg-primary">EN - English</span>
                  <button className="btn-modern-small-success" onClick={() => addRole('en')}>+ Add Role</button>
                </div>
                {(bannerEn.roles || []).map((role, idx) => (
                  <div key={idx} className="input-container-modern mb-2 d-flex align-items-center">
                    <input
                      type="text"
                      className="dashboard-input flex-grow-1"
                      value={role}
                      onChange={(e) => handleRoleChange('en', idx, e.target.value)}
                      placeholder={`Role #${idx + 1}`}
                    />
                    {(bannerEn.roles || []).length > 1 && (
                      <button className="btn-role-delete ms-2" onClick={() => removeRole('en', idx)} title="Remove role">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                          <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </Col>

            {/* Spanish Roles */}
            <Col md={6}>
              <div className="roles-column-box p-3 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="lang-badge bg-warning text-dark">ES - Español</span>
                  <button className="btn-modern-small-success" onClick={() => addRole('es')}>+ Añadir Rol</button>
                </div>
                {(bannerEs.roles || []).map((role, idx) => (
                  <div key={idx} className="input-container-modern mb-2 d-flex align-items-center">
                    <input
                      type="text"
                      className="dashboard-input flex-grow-1"
                      value={role}
                      onChange={(e) => handleRoleChange('es', idx, e.target.value)}
                      placeholder={`Rol #${idx + 1}`}
                    />
                    {(bannerEs.roles || []).length > 1 && (
                      <button className="btn-role-delete ms-2" onClick={() => removeRole('es', idx)} title="Eliminar rol">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                          <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  };

  const renderSkillsEditor = () => {
    const handleSkillChange = (index, field, value) => {
      const newSkills = [...skills];
      newSkills[index][field] = value;
      setSkills(newSkills);
    };

    const handleTagsChange = (index, value) => {
      const newSkills = [...skills];
      newSkills[index].skills = value.split(',').map(s => s.trim());
      setSkills(newSkills);
    };

    const saveSkill = async (index) => {
      try {
        const skill = skills[index];
        if (skill.id) {
          await skillsApi.updateSkill(skill.id, skill);
        } else {
          const res = await skillsApi.createSkill(skill);
          const newSkills = [...skills];
          newSkills[index] = res.data;
          setSkills(newSkills);
        }
        alert('Skill saved successfully!');
      } catch (err) {
        console.error(err);
        alert('Error saving skill');
      }
    };

    const deleteSkill = async (index) => {
      if (!window.confirm('Are you sure you want to delete this category?')) return;
      try {
        const skill = skills[index];
        if (skill.id) {
          await skillsApi.deleteSkill(skill.id);
        }
        const newSkills = [...skills];
        newSkills.splice(index, 1);
        setSkills(newSkills);
      } catch (err) {
        console.error(err);
        alert('Error deleting skill');
      }
    };

    const addNewSkill = () => {
      setSkills([...skills, { title: '', icon: 'FiCode', skills: [], order_index: skills.length + 1 }]);
    };

    return (
      <div className="hero-config-form">
        <div className="dashboard-subsection mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="subsection-title">Categorías de Skills</h5>
              <p className="subsection-desc">Añade o edita las categorías y habilidades tecnológicas.</p>
            </div>
            <button className="btn-modern-small-success" onClick={addNewSkill}>+ Nueva Categoría</button>
          </div>
          
          {loadingSkills ? <p className="text-white">Cargando skills...</p> : skills.map((skill, index) => (
            <div key={index} className="dashboard-edit-group mb-4 p-3 border border-secondary rounded">
              <Row className="mb-3">
                <Col md={6}>
                  <label className="dashboard-label">TÍTULO DE CATEGORÍA</label>
                  <input
                    type="text"
                    className="dashboard-input w-100"
                    value={skill.title || ''}
                    onChange={(e) => handleSkillChange(index, 'title', e.target.value)}
                    placeholder="Ej: Backend Development"
                  />
                </Col>
                <Col md={3}>
                  <label className="dashboard-label">ICONO</label>
                  <select
                    className="dashboard-input w-100"
                    value={skill.icon || 'FiCode'}
                    onChange={(e) => handleSkillChange(index, 'icon', e.target.value)}
                  >
                    <option value="FiServer">Servidor / Backend</option>
                    <option value="FiDatabase">Base de Datos</option>
                    <option value="FiCloud">Nube / DevOps</option>
                    <option value="FiCode">Código / APIs</option>
                    <option value="FiLock">Seguridad</option>
                    <option value="FiZap">Rendimiento</option>
                    <option value="FiMonitor">Monitor / UI</option>
                    <option value="FiSmartphone">Móvil</option>
                    <option value="FiCpu">CPU / Hardware</option>
                    <option value="FiGlobe">Web / Redes</option>
                    <option value="FiLayers">Arquitectura</option>
                    <option value="FiTerminal">Consola / Scripts</option>
                    <option value="FiTool">Herramientas</option>
                    <option value="FiSettings">Configuración</option>
                  </select>
                </Col>
                <Col md={3}>
                  <label className="dashboard-label">ORDEN</label>
                  <input
                    type="number"
                    className="dashboard-input w-100"
                    value={skill.order_index || 0}
                    onChange={(e) => handleSkillChange(index, 'order_index', parseInt(e.target.value))}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={12}>
                  <label className="dashboard-label">SKILLS (Separadas por coma)</label>
                  <input
                    type="text"
                    className="dashboard-input w-100"
                    value={(skill.skills || []).join(', ')}
                    onChange={(e) => handleTagsChange(index, e.target.value)}
                    placeholder="Node.js, Python, Java..."
                  />
                </Col>
              </Row>
              <div className="d-flex justify-content-end">
                <button className="btn-modern-small-danger me-2" onClick={() => deleteSkill(index)}>Eliminar</button>
                <button className="btn-modern-outline" onClick={() => saveSkill(index)}>Guardar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderExperienceEditor = () => {
    const handleExpChange = (lang, index, field, value) => {
      const expArray = lang === 'en' ? [...experiencesEn] : [...experiencesEs];
      expArray[index][field] = value;
      if (lang === 'en') setExperiencesEn(expArray);
      else setExperiencesEs(expArray);
    };

    const saveExp = async (lang, index) => {
      try {
        const expArray = lang === 'en' ? experiencesEn : experiencesEs;
        const exp = expArray[index];
        if (exp.id) {
          await experienceApi.updateExperience(exp.id, exp);
        } else {
          const res = await experienceApi.createExperience({ ...exp, lang });
          const newArray = [...expArray];
          newArray[index] = res.data;
          if (lang === 'en') setExperiencesEn(newArray);
          else setExperiencesEs(newArray);
        }
        alert('Experience saved successfully!');
      } catch (err) {
        console.error(err);
        alert('Error saving experience');
      }
    };

    const deleteExp = async (lang, index) => {
      if (!window.confirm('Are you sure you want to delete this experience?')) return;
      try {
        const expArray = lang === 'en' ? experiencesEn : experiencesEs;
        const exp = expArray[index];
        if (exp.id) {
          await experienceApi.deleteExperience(exp.id);
        }
        const newArray = [...expArray];
        newArray.splice(index, 1);
        if (lang === 'en') setExperiencesEn(newArray);
        else setExperiencesEs(newArray);
      } catch (err) {
        console.error(err);
        alert('Error deleting experience');
      }
    };

    const addNewExp = (lang) => {
      const newExp = { lang, title: '', company: '', date: '', description: '', order_index: 0 };
      if (lang === 'en') setExperiencesEn([...experiencesEn, newExp]);
      else setExperiencesEs([...experiencesEs, newExp]);
    };

    const renderColumn = (lang, experiences) => (
      <Col md={6}>
        <div className="roles-column-box p-3 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className={`lang-badge ${lang === 'en' ? 'bg-primary' : 'bg-warning text-dark'}`}>
              {lang === 'en' ? 'EN - English' : 'ES - Español'}
            </span>
            <button className="btn-modern-small-success" onClick={() => addNewExp(lang)}>+ Añadir</button>
          </div>
          {loadingExp ? <p className="text-white">Loading...</p> : experiences.map((exp, idx) => (
            <div key={idx} className="dashboard-edit-group mb-4 p-3 border border-secondary rounded">
              <label className="dashboard-label">TÍTULO DEL PUESTO</label>
              <input
                type="text"
                className="dashboard-input w-100 mb-2"
                value={exp.title || ''}
                onChange={(e) => handleExpChange(lang, idx, 'title', e.target.value)}
              />
              <label className="dashboard-label">COMPAÑÍA</label>
              <input
                type="text"
                className="dashboard-input w-100 mb-2"
                value={exp.company || ''}
                onChange={(e) => handleExpChange(lang, idx, 'company', e.target.value)}
              />
              <label className="dashboard-label">FECHA (Ej. 2021 - Present)</label>
              <input
                type="text"
                className="dashboard-input w-100 mb-2"
                value={exp.date || ''}
                onChange={(e) => handleExpChange(lang, idx, 'date', e.target.value)}
              />
              <label className="dashboard-label">DESCRIPCIÓN</label>
              <textarea
                className="dashboard-input w-100 mb-2"
                rows="4"
                value={exp.description || ''}
                onChange={(e) => handleExpChange(lang, idx, 'description', e.target.value)}
              />
              <label className="dashboard-label">ORDEN</label>
              <input
                type="number"
                className="dashboard-input w-100 mb-3"
                value={exp.order_index || 0}
                onChange={(e) => handleExpChange(lang, idx, 'order_index', parseInt(e.target.value))}
              />
              <div className="d-flex justify-content-end mt-2">
                <button className="btn-modern-small-danger me-2" onClick={() => deleteExp(lang, idx)}>Eliminar</button>
                <button className="btn-modern-outline" onClick={() => saveExp(lang, idx)}>Guardar</button>
              </div>
            </div>
          ))}
        </div>
      </Col>
    );

    return (
      <div className="hero-config-form">
        <div className="dashboard-subsection mb-5">
          <h5 className="subsection-title">Experiencia Profesional</h5>
          <p className="subsection-desc">Gestiona tu historial laboral. Debes guardarlas de forma independiente para cada idioma.</p>
          <Row>
            {renderColumn('en', experiencesEn)}
            {renderColumn('es', experiencesEs)}
          </Row>
        </div>
      </div>
    );
  };

  const renderProjectEditor = () => {
    const handleProjChange = (lang, index, field, value) => {
      const projArray = lang === 'en' ? [...projectsEn] : [...projectsEs];
      projArray[index][field] = value;
      if (lang === 'en') setProjectsEn(projArray);
      else setProjectsEs(projArray);
    };

    const handleMediaChange = (lang, projIndex, mediaIndex, field, value) => {
      const projArray = lang === 'en' ? [...projectsEn] : [...projectsEs];
      if (!projArray[projIndex].media) projArray[projIndex].media = [];
      projArray[projIndex].media[mediaIndex][field] = value;
      if (lang === 'en') setProjectsEn(projArray);
      else setProjectsEs(projArray);
    };

    const addMedia = (lang, projIndex, type) => {
      const projArray = lang === 'en' ? [...projectsEn] : [...projectsEs];
      if (!projArray[projIndex].media) projArray[projIndex].media = [];
      projArray[projIndex].media.push({ type, url: '' });
      if (lang === 'en') setProjectsEn(projArray);
      else setProjectsEs(projArray);
    };

    const removeMedia = (lang, projIndex, mediaIndex) => {
      const projArray = lang === 'en' ? [...projectsEn] : [...projectsEs];
      projArray[projIndex].media.splice(mediaIndex, 1);
      if (lang === 'en') setProjectsEn(projArray);
      else setProjectsEs(projArray);
    };

    const handleImageUpload = async (e, lang, projIndex, mediaIndex) => {
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('image', file);
      try {
        const res = await projectApi.uploadImage(formData);
        handleMediaChange(lang, projIndex, mediaIndex, 'url', res.data.url);
      } catch (err) {
        console.error(err);
        alert('Error uploading image');
      }
    };

    const saveProj = async (lang, index) => {
      try {
        const projArray = lang === 'en' ? projectsEn : projectsEs;
        const proj = projArray[index];
        if (proj.id) {
          await projectApi.updateProject(proj.id, proj);
        } else {
          const res = await projectApi.createProject({ ...proj, lang });
          const newArray = [...projArray];
          newArray[index] = res.data;
          if (lang === 'en') setProjectsEn(newArray);
          else setProjectsEs(newArray);
        }
        alert('Project saved successfully!');
      } catch (err) {
        console.error(err);
        alert('Error saving project');
      }
    };

    const deleteProj = async (lang, index) => {
      if (!window.confirm('Are you sure you want to delete this project?')) return;
      try {
        const projArray = lang === 'en' ? projectsEn : projectsEs;
        const proj = projArray[index];
        if (proj.id) {
          await projectApi.deleteProject(proj.id);
        }
        const newArray = [...projArray];
        newArray.splice(index, 1);
        if (lang === 'en') setProjectsEn(newArray);
        else setProjectsEs(newArray);
      } catch (err) {
        console.error(err);
        alert('Error deleting project');
      }
    };

    const addNewProj = (lang) => {
      const newProj = { lang, title: '', description: '', long_description: '', github_url: '', deploy_url: '', media: [], order_index: 0 };
      if (lang === 'en') setProjectsEn([...projectsEn, newProj]);
      else setProjectsEs([...projectsEs, newProj]);
    };

    const renderColumn = (lang, projects) => (
      <Col md={6}>
        <div className="roles-column-box p-3 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className={`lang-badge ${lang === 'en' ? 'bg-primary' : 'bg-warning text-dark'}`}>
              {lang === 'en' ? 'EN - English' : 'ES - Español'}
            </span>
            <button className="btn-modern-small-success" onClick={() => addNewProj(lang)}>+ Añadir</button>
          </div>
          {loadingProj ? <p className="text-white">Loading...</p> : projects.map((proj, idx) => (
            <div key={idx} className="dashboard-edit-group mb-4 p-3 border border-secondary rounded">
              <label className="dashboard-label">TÍTULO DEL PROYECTO</label>
              <input type="text" className="dashboard-input w-100 mb-2" value={proj.title || ''} onChange={(e) => handleProjChange(lang, idx, 'title', e.target.value)} />
              
              <label className="dashboard-label">DESCRIPCIÓN CORTA</label>
              <input type="text" className="dashboard-input w-100 mb-2" value={proj.description || ''} onChange={(e) => handleProjChange(lang, idx, 'description', e.target.value)} />
              
              <label className="dashboard-label">DESCRIPCIÓN LARGA (Modal)</label>
              <textarea className="dashboard-input w-100 mb-2" rows="4" value={proj.long_description || ''} onChange={(e) => handleProjChange(lang, idx, 'long_description', e.target.value)} />
              
              <Row>
                <Col md={6}>
                  <label className="dashboard-label">URL GITHUB</label>
                  <input type="text" className="dashboard-input w-100 mb-2" value={proj.github_url || ''} onChange={(e) => handleProjChange(lang, idx, 'github_url', e.target.value)} />
                </Col>
                <Col md={6}>
                  <label className="dashboard-label">URL DEPLOY</label>
                  <input type="text" className="dashboard-input w-100 mb-2" value={proj.deploy_url || ''} onChange={(e) => handleProjChange(lang, idx, 'deploy_url', e.target.value)} />
                </Col>
              </Row>
              
              <label className="dashboard-label">ORDEN</label>
              <input type="number" className="dashboard-input w-100 mb-3" value={proj.order_index || 0} onChange={(e) => handleProjChange(lang, idx, 'order_index', parseInt(e.target.value))} />

              <div className="media-section mt-3 p-2 rounded" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <label className="dashboard-label">MULTIMEDIA (Imágenes o Videos de YT)</label>
                {(proj.media || []).map((m, mIdx) => (
                  <div key={mIdx} className="d-flex align-items-center mb-2 gap-2">
                    <span className="badge bg-secondary">{m.type === 'image' ? 'IMG' : 'YT'}</span>
                    {m.type === 'youtube' ? (
                      <input type="text" className="dashboard-input flex-grow-1 m-0" placeholder="Ej: https://youtube.com/watch?v=..." value={m.url || ''} onChange={(e) => handleMediaChange(lang, idx, mIdx, 'url', e.target.value)} />
                    ) : (
                      <div className="flex-grow-1">
                        {m.url ? <span className="text-white small text-truncate d-inline-block" style={{maxWidth:'200px'}}>{m.url}</span> : null}
                        <input type="file" className="form-control form-control-sm bg-dark text-white border-0" accept="image/*" onChange={(e) => handleImageUpload(e, lang, idx, mIdx)} />
                      </div>
                    )}
                    <button className="btn btn-sm btn-outline-danger" onClick={() => removeMedia(lang, idx, mIdx)}>x</button>
                  </div>
                ))}
                <div className="d-flex gap-2 mt-2">
                  <button className="btn btn-sm btn-outline-info" onClick={() => addMedia(lang, idx, 'image')}>+ Imagen</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => addMedia(lang, idx, 'youtube')}>+ YouTube</button>
                </div>
              </div>

              <div className="d-flex justify-content-end mt-3">
                <button className="btn-modern-small-danger me-2" onClick={() => deleteProj(lang, idx)}>Eliminar</button>
                <button className="btn-modern-outline" onClick={() => saveProj(lang, idx)}>Guardar</button>
              </div>
            </div>
          ))}
        </div>
      </Col>
    );

    return (
      <div className="hero-config-form">
        <div className="dashboard-subsection mb-5">
          <h5 className="subsection-title">Gestión de Proyectos</h5>
          <p className="subsection-desc">Edita tu portafolio bilingüe con soporte para múltiples imágenes y videos de YouTube.</p>
          <Row>
            {renderColumn('en', projectsEn)}
            {renderColumn('es', projectsEs)}
          </Row>
        </div>
      </div>
    );
  };

  const renderBlogEditor = () => {
    const handleBlogChange = (lang, index, field, value) => {
      const arr = lang === 'en' ? [...blogsEn] : [...blogsEs];
      arr[index][field] = value;
      if (lang === 'en') setBlogsEn(arr);
      else setBlogsEs(arr);
    };

    const handleImageUpload = async (e, lang, index) => {
      const file = e.target.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('image', file);
      try {
        const res = await blogApi.uploadImage(formData);
        handleBlogChange(lang, index, 'cover_image', res.data.url);
      } catch (err) {
        console.error(err);
        alert('Error uploading image');
      }
    };

    const saveBlog = async (lang, index) => {
      try {
        const arr = lang === 'en' ? blogsEn : blogsEs;
        const blog = arr[index];
        if (blog.id) {
          await blogApi.updateBlog(blog.id, blog);
        } else {
          const res = await blogApi.createBlog({ ...blog, lang });
          const newArray = [...arr];
          newArray[index] = res.data;
          if (lang === 'en') setBlogsEn(newArray);
          else setBlogsEs(newArray);
        }
        alert('Blog saved successfully!');
      } catch (err) {
        console.error(err);
        alert('Error saving blog');
      }
    };

    const deleteBlog = async (lang, index) => {
      if (!window.confirm('Are you sure you want to delete this blog post?')) return;
      try {
        const arr = lang === 'en' ? blogsEn : blogsEs;
        const blog = arr[index];
        if (blog.id) {
          await blogApi.deleteBlog(blog.id);
        }
        const newArray = [...arr];
        newArray.splice(index, 1);
        if (lang === 'en') setBlogsEn(newArray);
        else setBlogsEs(newArray);
      } catch (err) {
        console.error(err);
        alert('Error deleting blog');
      }
    };

    const addNewBlog = (lang) => {
      const newBlog = { lang, title: '', excerpt: '', content: '', cover_image: '', author_name: '', order_index: 0, published_at: new Date().toISOString().split('T')[0] };
      if (lang === 'en') setBlogsEn([...blogsEn, newBlog]);
      else setBlogsEs([...blogsEs, newBlog]);
    };

    const renderColumn = (lang, blogs) => (
      <Col md={12} lg={6}>
        <div className="roles-column-box p-3 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className={`lang-badge ${lang === 'en' ? 'bg-primary' : 'bg-warning text-dark'}`}>
              {lang === 'en' ? 'EN - English' : 'ES - Español'}
            </span>
            <button className="btn-modern-small-success" onClick={() => addNewBlog(lang)}>+ Añadir Post</button>
          </div>
          {loadingBlog ? <p className="text-white">Loading...</p> : blogs.map((blog, idx) => (
            <div key={idx} className="dashboard-edit-group mb-4 p-3 border border-secondary rounded">
              <label className="dashboard-label">TÍTULO DEL POST</label>
              <input type="text" className="dashboard-input w-100 mb-2" value={blog.title || ''} onChange={(e) => handleBlogChange(lang, idx, 'title', e.target.value)} />
              
              <label className="dashboard-label">RESUMEN CORTO (Excerpt)</label>
              <textarea className="dashboard-input w-100 mb-2" rows="2" value={blog.excerpt || ''} onChange={(e) => handleBlogChange(lang, idx, 'excerpt', e.target.value)} />
              
              <label className="dashboard-label">IMAGEN DE PORTADA</label>
              <div className="d-flex mb-3 gap-2">
                <input type="text" className="dashboard-input flex-grow-1" placeholder="URL o subir imagen ->" value={blog.cover_image || ''} onChange={(e) => handleBlogChange(lang, idx, 'cover_image', e.target.value)} />
                <input type="file" className="form-control bg-dark text-white border-0" style={{ maxWidth: '150px' }} accept="image/*" onChange={(e) => handleImageUpload(e, lang, idx)} />
              </div>

              <Row>
                <Col md={6}>
                  <label className="dashboard-label">AUTOR</label>
                  <input type="text" className="dashboard-input w-100 mb-2" value={blog.author_name || ''} onChange={(e) => handleBlogChange(lang, idx, 'author_name', e.target.value)} />
                </Col>
                <Col md={6}>
                  <label className="dashboard-label">FECHA (YYYY-MM-DD)</label>
                  <input type="date" className="dashboard-input w-100 mb-2" value={blog.published_at ? blog.published_at.substring(0, 10) : ''} onChange={(e) => handleBlogChange(lang, idx, 'published_at', e.target.value)} />
                </Col>
              </Row>

              <label className="dashboard-label mt-2">CONTENIDO DEL POST (Soporta Markdown)</label>
              <div className="text-muted small mb-2">Puedes usar sintaxis Markdown para formatear el texto. Ejemplo: **negrita**, # Título grande, - lista.</div>
              <textarea className="dashboard-input w-100 mb-3" rows="15" value={blog.content || ''} onChange={(e) => handleBlogChange(lang, idx, 'content', e.target.value)} style={{ fontFamily: 'monospace' }} />

              <label className="dashboard-label">ORDEN</label>
              <input type="number" className="dashboard-input w-100 mb-3" value={blog.order_index || 0} onChange={(e) => handleBlogChange(lang, idx, 'order_index', parseInt(e.target.value))} />

              <div className="d-flex justify-content-end mt-3">
                <button className="btn-modern-small-danger me-2" onClick={() => deleteBlog(lang, idx)}>Eliminar</button>
                <button className="btn-modern-outline" onClick={() => saveBlog(lang, idx)}>Guardar</button>
              </div>
            </div>
          ))}
        </div>
      </Col>
    );

    return (
      <div className="hero-config-form">
        <div className="dashboard-subsection mb-5">
          <h5 className="subsection-title">Gestión del Blog</h5>
          <p className="subsection-desc">Edita tus posts bilingües. Usa sintaxis Markdown para el contenido largo (soporta código, negritas, links, etc.).</p>
          <Row>
            {renderColumn('en', blogsEn)}
            {renderColumn('es', blogsEs)}
          </Row>
        </div>
      </div>
    );
  };

  const renderContactEditor = () => {
    const filteredMessages = contactMessages.filter(msg => {
      // Status Filter
      if (contactFilterStatus === 'read' && !msg.is_read) return false;
      if (contactFilterStatus === 'unread' && msg.is_read) return false;
      
      // Date Filter
      if (contactStartDate) {
        const msgDate = new Date(msg.created_at);
        const startDate = new Date(contactStartDate);
        startDate.setHours(0, 0, 0, 0);
        if (msgDate < startDate) return false;
      }
      if (contactEndDate) {
        const msgDate = new Date(msg.created_at);
        const endDate = new Date(contactEndDate);
        endDate.setHours(23, 59, 59, 999);
        if (msgDate > endDate) return false;
      }
      return true;
    });

    return (
      <div className="contact-editor-container">
        <div className="dashboard-subsection mb-5">
          <h5 className="subsection-title" style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '10px' }}>Traducciones de la Sección</h5>
          <p className="subsection-desc" style={{ color: '#888', fontSize: '0.9rem', marginBottom: '20px' }}>Modifica los textos y etiquetas del formulario de contacto.</p>
          {renderStringEditor('contact')}
        </div>

        <hr className="my-5" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        <div className="dashboard-subsection">
          <h5 className="subsection-title" style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '10px' }}>Mensajes de Contacto Recibidos</h5>
          <p className="subsection-desc" style={{ color: '#888', fontSize: '0.9rem', marginBottom: '20px' }}>Visualiza y gestiona las solicitudes de contacto enviadas por los usuarios.</p>
          
          <div className="filters-container d-flex gap-3 mb-4 p-3 rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
            <div>
              <label className="text-white small mb-1 d-block">Estado</label>
              <select className="form-select bg-dark text-white border-secondary" value={contactFilterStatus} onChange={(e) => setContactFilterStatus(e.target.value)}>
                <option value="all">Todos</option>
                <option value="unread">No Leídos</option>
                <option value="read">Leídos</option>
              </select>
            </div>
            <div>
              <label className="text-white small mb-1 d-block">Desde</label>
              <input type="date" className="form-control bg-dark text-white border-secondary" value={contactStartDate} onChange={(e) => setContactStartDate(e.target.value)} />
            </div>
            <div>
              <label className="text-white small mb-1 d-block">Hasta</label>
              <input type="date" className="form-control bg-dark text-white border-secondary" value={contactEndDate} onChange={(e) => setContactEndDate(e.target.value)} />
            </div>
          </div>

          {loadingContacts ? (
            <p className="text-white">Cargando mensajes...</p>
          ) : filteredMessages.length === 0 ? (
            <p className="text-muted">No se han encontrado mensajes que coincidan con los filtros.</p>
          ) : (
            <div className="table-responsive" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              <table className="table table-dark table-striped table-bordered align-middle text-white" style={{ backgroundColor: '#1a1e23', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <thead>
                  <tr style={{ backgroundColor: '#111' }}>
                    <th style={{ padding: '12px' }}>Nombre</th>
                    <th style={{ padding: '12px' }}>Email</th>
                    <th style={{ padding: '12px' }}>Teléfono</th>
                    <th style={{ padding: '12px' }}>Mensaje</th>
                    <th style={{ padding: '12px' }}>Fecha</th>
                    <th style={{ padding: '12px' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.map(msg => (
                    <tr key={msg.id} style={{ opacity: msg.is_read ? 0.7 : 1 }}>
                      <td style={{ fontWeight: msg.is_read ? 'normal' : 'bold', padding: '12px' }}>
                        {msg.first_name} {msg.last_name}
                        {!msg.is_read && <span className="badge bg-danger ms-2">Nuevo</span>}
                      </td>
                      <td style={{ padding: '12px' }}>
                        <a href={`mailto:${msg.email}`} style={{ color: '#45bafc', textDecoration: 'none' }}>
                          {msg.email}
                        </a>
                      </td>
                      <td style={{ padding: '12px' }}>{msg.phone || '-'}</td>
                      <td style={{ whiteSpace: 'pre-wrap', minWidth: '200px', maxWidth: '300px', padding: '12px', fontWeight: msg.is_read ? 'normal' : '600' }}>{msg.message}</td>
                      <td style={{ padding: '12px', fontSize: '0.85rem' }}>{new Date(msg.created_at).toLocaleString()}</td>
                      <td style={{ padding: '12px' }}>
                        <div className="d-flex flex-column gap-2">
                          <button 
                            className="btn btn-sm btn-outline-info" 
                            onClick={() => markContactMessageRead(msg.id, msg.is_read)}
                            style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                          >
                            {msg.is_read ? 'Marcar No Leído' : 'Marcar Leído'}
                          </button>
                          <button 
                            className="btn-modern-small-danger" 
                            onClick={() => deleteContactMessage(msg.id)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#dc3545',
                              border: 'none',
                              borderRadius: '4px',
                              color: '#fff',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#bd2130'}
                            onMouseOut={(e) => e.target.style.backgroundColor = '#dc3545'}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileUpdateStatus(null);
    try {
      const data = {
        email: profileEmail,
        current_password: profileCurrentPassword,
        password: profileNewPassword,
        password_confirmation: profileConfirmPassword,
      };
      const res = await authApi.updateProfile(data);
      setProfileUpdateStatus({ success: true, message: res.data.message });
      if (res.data.user) {
        updateUser(res.data.user);
      }
      setProfileCurrentPassword('');
      setProfileNewPassword('');
      setProfileConfirmPassword('');
    } catch (err) {
      console.error('Error updating profile:', err);
      const msg = err.response?.data?.message || 'Error al actualizar el perfil.';
      setProfileUpdateStatus({ success: false, message: msg });
    }
  };

  const renderProfileEditor = () => {
    return (
      <div className="profile-editor-container">
        <div className="dashboard-subsection mb-5">
          <h5 className="subsection-title" style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '10px' }}>Ajustes de Perfil</h5>
          <p className="subsection-desc" style={{ color: '#888', fontSize: '0.9rem', marginBottom: '20px' }}>Actualiza tu correo de acceso o cambia tu contraseña.</p>
          
          {profileUpdateStatus && (
            <div className={`alert ${profileUpdateStatus.success ? 'alert-success' : 'alert-danger'} mb-4`}>
              {profileUpdateStatus.message}
            </div>
          )}

          <form onSubmit={handleProfileUpdate} style={{ maxWidth: '600px', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '8px' }}>
            <div className="mb-3">
              <label className="dashboard-label">Correo Electrónico</label>
              <input 
                type="email" 
                className="dashboard-input w-100" 
                value={profileEmail} 
                onChange={(e) => setProfileEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="mb-3">
              <label className="dashboard-label">Contraseña Actual *</label>
              <input 
                type="password" 
                className="dashboard-input w-100" 
                value={profileCurrentPassword} 
                onChange={(e) => setProfileCurrentPassword(e.target.value)} 
                required 
              />
              <small className="text-muted">Necesaria para autorizar cualquier cambio.</small>
            </div>
            <hr className="my-4" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
            <div className="mb-3">
              <label className="dashboard-label">Nueva Contraseña (Opcional)</label>
              <input 
                type="password" 
                className="dashboard-input w-100" 
                value={profileNewPassword} 
                onChange={(e) => setProfileNewPassword(e.target.value)} 
                minLength={8}
              />
            </div>
            <div className="mb-4">
              <label className="dashboard-label">Confirmar Nueva Contraseña</label>
              <input 
                type="password" 
                className="dashboard-input w-100" 
                value={profileConfirmPassword} 
                onChange={(e) => setProfileConfirmPassword(e.target.value)} 
                minLength={8}
              />
            </div>
            <button type="submit" className="btn-modern w-100">Actualizar Perfil</button>
          </form>
        </div>
      </div>
    );
  };

  const sections = [
    { id: 'banner', name: 'Hero section' },
    { id: 'skills', name: 'Skills' },
    { id: 'experience', name: 'Experience' },
    { id: 'projects', name: 'Projects' },
    { id: 'blog', name: 'Blog' },
    { id: 'contact', name: 'Contact' },
    { id: 'footer', name: 'Footer' },
    { id: 'profile', name: 'Perfil' },
  ];

  return (
    <section className="dashboard-layout">
      <div className="login-grid-overlay"></div>
      
      <Tab.Container id="dashboard-tabs" activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <aside className={`sidebar-full ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header" onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
            {sidebarOpen ? (
              <img src={logo} alt="Logo" style={{ maxWidth: '100%', maxHeight: '80px', width: 'auto', objectFit: 'contain' }} />
            ) : (
              <img src={logo} alt="Logo" style={{ maxWidth: '100%', maxHeight: '50px', width: 'auto', objectFit: 'contain' }} />
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
            <div className="header-actions d-flex align-items-center">
              <div 
                className="notification-bell me-4 position-relative" 
                style={{ cursor: 'pointer' }}
                onClick={() => setActiveTab('contact')}
                title="Mensajes de Contacto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#fff" viewBox="0 0 16 16">
                  <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z"/>
                </svg>
                {unreadCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: '0.65rem' }}>
                    {unreadCount}
                    <span className="visually-hidden">mensajes no leídos</span>
                  </span>
                )}
              </div>
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
                      {sec.id === 'banner' ? renderHeroEditor() : sec.id === 'skills' ? renderSkillsEditor() : sec.id === 'experience' ? renderExperienceEditor() : sec.id === 'projects' ? renderProjectEditor() : sec.id === 'blog' ? renderBlogEditor() : sec.id === 'contact' ? renderContactEditor() : sec.id === 'profile' ? renderProfileEditor() : renderStringEditor(sec.id)}
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
