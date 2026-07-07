import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import * as FiIcons from "react-icons/fi";
import { skillsApi } from "../api";

export const Skills = () => {
  const { t } = useLanguage();
  const [skillCategories, setSkillCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Use translations if available, otherwise fallback to static text
  const sectionTitle = t('skills') && t('skills').title ? t('skills').title : "Skills & ";
  const sectionDesc = t('skills') && t('skills').description ? t('skills').description : "Herramientas y tecnologías que domino para construir soluciones backend robustas";

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await skillsApi.getSkills();
        setSkillCategories(res.data);
      } catch (err) {
        console.error("Error fetching skills", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  return (
    <section className="skills-grid-wrapper" id="skills">
      <div className="container">
        <div className="skills-header wow zoomIn">
          <h2>
            Skills & <span className="highlight">Tecnologías</span>
          </h2>
          <p>{sectionDesc}</p>
        </div>
        
        {loading ? (
          <p className="text-center text-white">Loading...</p>
        ) : (
          <div className="skills-grid wow zoomIn">
            {skillCategories.map((category, index) => {
              const IconComponent = FiIcons[category.icon] || FiIcons.FiCode;
              return (
                <div className="skill-card" key={index}>
                  <IconComponent className="skill-icon" />
                  <h3>{category.title}</h3>
                  <div className="skill-tags">
                    {category.skills.map((skill, idx) => (
                      <span className="skill-tag" key={idx}>{skill}</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
