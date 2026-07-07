import { useLanguage } from "../context/LanguageContext";
import { FiServer, FiDatabase, FiCloud, FiCode, FiLock, FiZap } from "react-icons/fi";

export const Skills = () => {
  const { t } = useLanguage();
  
  // Use translations if available, otherwise fallback to static text
  const sectionTitle = t('skills') && t('skills').title ? t('skills').title : "Skills & ";
  const sectionDesc = t('skills') && t('skills').description ? t('skills').description : "Herramientas y tecnologías que domino para construir soluciones backend robustas";

  const skillCategories = [
    {
      title: "Backend Development",
      icon: <FiServer className="skill-icon" />,
      skills: ["Node.js", "Python", "Java", "PHP", "Ruby"]
    },
    {
      title: "Databases",
      icon: <FiDatabase className="skill-icon" />,
      skills: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "Firebase"]
    },
    {
      title: "Cloud & DevOps",
      icon: <FiCloud className="skill-icon" />,
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"]
    },
    {
      title: "APIs & Frameworks",
      icon: <FiCode className="skill-icon" />,
      skills: ["Express", "Django", "FastAPI", "GraphQL", "REST"]
    },
    {
      title: "Security",
      icon: <FiLock className="skill-icon" />,
      skills: ["OAuth", "JWT", "SSL/TLS", "Encryption", "OWASP"]
    },
    {
      title: "Performance",
      icon: <FiZap className="skill-icon" />,
      skills: ["Caching", "Load Balancing", "CDN", "Optimization", "Monitoring"]
    }
  ];

  return (
    <section className="skills-grid-wrapper" id="skills">
      <div className="container">
        <div className="skills-header wow zoomIn">
          <h2>
            Skills & <span className="highlight">Tecnologías</span>
          </h2>
          <p>{sectionDesc}</p>
        </div>
        
        <div className="skills-grid wow zoomIn">
          {skillCategories.map((category, index) => (
            <div className="skill-card" key={index}>
              {category.icon}
              <h3>{category.title}</h3>
              <div className="skill-tags">
                {category.skills.map((skill, idx) => (
                  <span className="skill-tag" key={idx}>{skill}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
