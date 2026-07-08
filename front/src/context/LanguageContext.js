import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

const defaultTranslations = {
  en: {
    nav: {
      home: "Home",
      skills: "Skills",
      projects: "Projects",
      blog: "Blog",
      connect: "Let's Connect"
    },
    banner: {
      tagline: "Welcome to my Portfolio",
      greeting: "Hi! I'm Jonas",
      roles: ["Web Developer", "Full Stack Developer", "Backend Developer"],
      description: "I am passionate about creating efficient and scalable web applications. I love solving complex problems and turning ideas into reality.",
      connect: "Let's Connect"
    },
    skills: {
      title: "Skills",
      description: "My technical skills and tools I work with:"
    },
    experience: {
      title: "Professional Experience",
      subtitle: "My trajectory in development",
      roles: [
        {
          title: "Full Stack Developer",
          company: "Current Company",
          date: "2023 - Present",
          description: "Development and maintenance of modern web applications. Participation in the complete software development lifecycle, from design to deployment."
        },
        {
          title: "Junior Front-End Developer",
          company: "Digital Agency",
          date: "2021 - 2023",
          description: "Creation of interactive and responsive user interfaces using React and CSS. Close collaboration with design teams."
        },
        {
          title: "Engineering / Systems Student",
          company: "Technological University",
          date: "2018 - 2022",
          description: "Academic training in computer fundamentals, algorithms, databases, and agile methodologies."
        }
      ]
    },
    projects: {
      title: "Projects",
      description: "Here are some of the projects I've worked on recently.",
      tab1: "Tab 1",
      tab2: "Tab 2",
      tab3: "Tab 3"
    },
    blog: {
      title: "Blog & Articles",
      description: "I share knowledge and experiences about backend development, software architecture, and best practices.",
      readMore: "Read article",
      articles: [
        {
          title: "Microservices Architecture",
          description: "Discover the fundamental patterns to build scalable and resilient backend systems."
        },
        {
          title: "SQL Query Optimization",
          description: "Advanced techniques to improve the performance of your relational databases and avoid bottlenecks."
        },
        {
          title: "REST APIs Security",
          description: "Implementation of JWT, OAuth2, and best practices to protect your endpoints against vulnerabilities."
        }
      ]
    },
    contact: {
      title: "Get In Touch",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email Address",
      phone: "Phone No.",
      message: "Message",
      send: "Send",
      sending: "Sending...",
      success: "Message sent successfully",
      error: "Something went wrong, please try again later."
    },
    footer: {
      newsletterTitle: "Subscribe to our Newsletter",
      emailPlaceholder: "Email Address",
      submit: "Submit",
      copyRight: "Copyright 2026. All Rights Reserved",
      linkedin: "https://www.linkedin.com/in/jonas-ojeda-18308a1ab/",
      github: "https://github.com/jonasojeda"
    }
  },
  es: {
    nav: {
      home: "Inicio",
      skills: "Habilidades",
      projects: "Proyectos",
      blog: "Blog",
      connect: "Conectar"
    },
    banner: {
      tagline: "Bienvenido a mi Portafolio",
      greeting: "¡Hola! Soy Jonas",
      roles: ["Desarrollador Web", "Desarrollador Full Stack", "Desarrollador Backend"],
      description: "Me apasiona crear aplicaciones web eficientes y escalables. Me encanta resolver problemas complejos y convertir ideas en realidad.",
      connect: "Conectar"
    },
    skills: {
      title: "Habilidades",
      description: "Mis habilidades técnicas y herramientas con las que trabajo:"
    },
    experience: {
      title: "Experiencia Profesional",
      subtitle: "Mi trayectoria en el desarrollo",
      roles: [
        {
          title: "Desarrollador Full Stack",
          company: "Empresa Actual",
          date: "2023 - Presente",
          description: "Desarrollo y mantenimiento de aplicaciones web modernas. Participación en el ciclo completo de desarrollo de software, desde el diseño hasta el despliegue."
        },
        {
          title: "Desarrollador Front-End Junior",
          company: "Agencia Digital",
          date: "2021 - 2023",
          description: "Creación de interfaces de usuario interactivas y responsivas utilizando React y CSS. Colaboración estrecha con equipos de diseño."
        },
        {
          title: "Estudiante de Ingeniería / Sistemas",
          company: "Universidad Tecnológica",
          date: "2018 - 2022",
          description: "Formación académica en fundamentos de la computación, algoritmos, bases de datos y metodologías ágiles."
        }
      ]
    },
    projects: {
      title: "Proyectos",
      description: "Estos son algunos de los proyectos en los que he trabajado recientemente.",
      tab1: "Pestaña 1",
      tab2: "Pestaña 2",
      tab3: "Pestaña 3"
    },
    blog: {
      title: "Blog & Artículos",
      description: "Comparto conocimientos y experiencias sobre desarrollo backend, arquitectura de software y mejores prácticas.",
      readMore: "Leer artículo",
      articles: [
        {
          title: "Arquitectura de Microservicios",
          description: "Descubre los patrones fundamentales para construir sistemas escalables y resilientes en el backend."
        },
        {
          title: "Optimización de Consultas SQL",
          description: "Técnicas avanzadas para mejorar el rendimiento de tus bases de datos relacionales y evitar cuellos de botella."
        },
        {
          title: "Seguridad en APIs REST",
          description: "Implementación de JWT, OAuth2 y buenas prácticas para proteger tus endpoints contra vulnerabilidades."
        }
      ]
    },
    contact: {
      title: "Contáctame",
      firstName: "Nombre",
      lastName: "Apellido",
      email: "Correo Electrónico",
      phone: "Teléfono",
      message: "Mensaje",
      send: "Enviar",
      sending: "Enviando...",
      success: "Mensaje enviado exitosamente",
      error: "Algo salió mal, inténtalo de nuevo más tarde."
    },
    footer: {
      newsletterTitle: "Suscríbete a nuestro boletín",
      emailPlaceholder: "Correo Electrónico",
      submit: "Enviar",
      copyRight: "Derechos reservados 2026.",
      linkedin: "https://www.linkedin.com/in/jonas-ojeda-18308a1ab/",
      github: "https://github.com/jonasojeda"
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // Default to English
  
  // Load translations from localStorage or use defaults
  const [translations, setTranslations] = useState(() => {
    const saved = localStorage.getItem('portfolio_translations');
    if (saved) {
      const parsed = JSON.parse(saved);
      const merged = JSON.parse(JSON.stringify(defaultTranslations));
      ['en', 'es'].forEach(lang => {
        if (parsed[lang]) {
          Object.keys(defaultTranslations[lang]).forEach(section => {
            if (parsed[lang][section]) {
              merged[lang][section] = {
                ...defaultTranslations[lang][section],
                ...parsed[lang][section]
              };
            }
          });
        }
      });
      return merged;
    }
    return defaultTranslations;
  });

  // Save to localStorage whenever translations change
  useEffect(() => {
    localStorage.setItem('portfolio_translations', JSON.stringify(translations));
  }, [translations]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'es' ? 'en' : 'es');
  };

  const t = (section) => {
    return translations[language][section] || defaultTranslations[language][section];
  };

  const updateTranslation = (lang, section, key, value) => {
    setTranslations(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [section]: {
          ...prev[lang][section],
          [key]: value
        }
      }
    }));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t, translations, updateTranslation }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
