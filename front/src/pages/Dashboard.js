import { useState, useEffect } from 'react';
import { Container, Row, Col, Tab, Nav } from 'react-bootstrap';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/img/logo.png';
import { cvApi, skillsApi, experienceApi } from '../api';


export const Dashboard = () => {
  const { translations, updateTranslation } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cvUploadStatusEn, setCvUploadStatusEn] = useState('');
  const [cvUploadStatusEs, setCvUploadStatusEs] = useState('');

  const [skills, setSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);

  const [experiencesEn, setExperiencesEn] = useState([]);
  const [experiencesEs, setExperiencesEs] = useState([]);
  const [loadingExp, setLoadingExp] = useState(false);

  useEffect(() => {
    fetchSkills();
    fetchExperiences();
  }, []);

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

  const sections = [
    { id: 'banner', name: 'Hero section' },
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
                      {sec.id === 'banner' ? renderHeroEditor() : sec.id === 'skills' ? renderSkillsEditor() : sec.id === 'experience' ? renderExperienceEditor() : renderStringEditor(sec.id)}
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
