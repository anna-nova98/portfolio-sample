import { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import Image from "next/image";
import VanillaTilt from "vanilla-tilt";
import styles from "./ProjectTile.module.scss";
import { PROJECT_IMAGES } from "../images";

const tiltOptions = {
  max: 5,
  speed: 400,
  glare: true,
  "max-glare": 0.2,
  gyroscope: false,
};

const FullscreenImage = ({ src, alt, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {

    const originalBody = document.body.style.overflow;
    const originalHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";


    setVisible(true);

    return () => {
      document.body.style.overflow = originalBody;
      document.documentElement.style.overflow = originalHtml;
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300); 
  };

  return ReactDOM.createPortal(
    <div
      className={`fixed top-0 left-0 w-screen h-screen bg-[#000000c7] bg- z-[9999] flex items-center justify-center transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      } cursor-auto`}
      onClick={handleClose} 
    >
      <img
        src={src}
        alt={alt}
        className={`object-contain max-w-full max-h-full transition-transform duration-300 ${
          visible ? "scale-100" : "scale-90"
        } cursor-auto`}
        onClick={(e) => e.stopPropagation()} 
      />
      <button
        className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-300 cursor-pointer"
        onClick={handleClose}
      >
        &times;
      </button>
    </div>,
    document.body
  );
};

const ProjectTile = ({ project, classes, isDesktop }) => {
  const projectCard = useRef(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  const { name, imageKey } = project;
  const image = PROJECT_IMAGES[imageKey];

  useEffect(() => {
    const node = projectCard.current;
    VanillaTilt.init(node, tiltOptions);
    return () => node?.vanillaTilt?.destroy();
  }, []);

  return (
    <>
      
      <div
        onClick={() => setFullscreenImage(project.image)}
        className={`overflow-hidden rounded-3xl snap-start cursor-pointer ${classes || ""}`}
        style={{
          maxWidth: isDesktop ? "calc(100vw - 2rem)" : "calc(100vw - 4rem)",
          flex: "1 0 auto",
          WebkitMaskImage: "-webkit-radial-gradient(white, black)",
        }}
      >
        <div
          ref={projectCard}
          className={`${styles.projectTile} rounded-3xl relative p-6 flex flex-col justify-between max-w-full`}
        >
          <Image
            src={project.image}
            alt={name}
            className="absolute w-full h-full top-0 left-0 rounded-3xl object-cover"
            fill
          />
        </div>
      </div>

     
      {fullscreenImage && (
        <FullscreenImage
          src={fullscreenImage}
          alt={name}
          onClose={() => setFullscreenImage(null)}
        />
      )}
    </>
  );
};

export default ProjectTile;