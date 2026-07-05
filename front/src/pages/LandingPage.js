import { NavBar } from "../components/NavBar";
import { Banner } from "../components/Banner";
import { Skills } from "../components/Skills";
import { Projects } from "../components/Projects";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { Experience } from "../components/Experience";
import { Blog } from "../components/Blog";

export const LandingPage = () => {
  return (
    <>
      <NavBar />
      <Banner />
      <Skills />
      <Experience />
      <Projects />
      <Blog />
      <Contact />
      <Footer />
    </>
  );
};
