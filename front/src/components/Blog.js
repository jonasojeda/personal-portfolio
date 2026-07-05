import { Container, Row, Col } from "react-bootstrap";
import { ArrowRightCircle } from 'react-bootstrap-icons';
import { useLanguage } from "../context/LanguageContext";

export const Blog = () => {
  const { t } = useLanguage();
  const articles = t('blog').articles.map((art, index) => {
    // Add images since they are not in the translation dict
    const images = [
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    ];
    return {
      ...art,
      imgUrl: images[index],
      link: "#"
    };
  });

  return (
    <section className="blog" id="blog">
      <Container>
        <div className="blog-bx wow zoomIn">
          <h2>{t('blog').title}</h2>
          <p>{t('blog').description}</p>
          <Row>
            {
              articles.map((article, index) => {
                return (
                  <Col size={12} sm={6} md={4} key={index}>
                    <div className="blog-card">
                      <div className="blog-imgbx">
                        <img src={article.imgUrl} alt="Article Img" />
                      </div>
                      <div className="blog-txtx">
                        <h4>{article.title}</h4>
                        <p>{article.description}</p>
                        <a href={article.link} className="read-more">{t('blog').readMore} <ArrowRightCircle size={20}/></a>
                      </div>
                    </div>
                  </Col>
                )
              })
            }
          </Row>
        </div>
      </Container>
    </section>
  )
}
