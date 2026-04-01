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

const FullscreenGallery = ({ images, initialIndex = 0, alt, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    const originalBody = document.body.style.overflow;
    const originalHtml = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    setVisible(true);

    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        nextImage();
      } else if (e.key === "ArrowLeft") {
        prevImage();
      } else if (e.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalBody;
      document.documentElement.style.overflow = originalHtml;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentIndex]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return ReactDOM.createPortal(
    <div
      className={`fixed top-0 left-0 w-screen h-screen bg-[#000000d9] z-[9999] flex items-center justify-center transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <button
        className="absolute left-4 md:left-8 text-white text-5xl font-light hover:scale-110 transition-transform z-10"
        onClick={(e) => {
          e.stopPropagation();
          prevImage();
        }}
      >
        ‹
      </button>

      <div
        className="relative flex flex-col items-center px-12"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[currentIndex]}
          alt={`${alt} ${currentIndex + 1}`}
          className={`object-contain max-w-[90vw] max-h-[80vh] rounded-xl transition-all duration-300 ${
            visible ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
        />

        <div className="mt-4 flex gap-2 flex-wrap justify-center">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                currentIndex === index
                  ? "border-white scale-105"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt={`thumbnail-${index}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        <div className="mt-3 text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      <button
        className="absolute right-4 md:right-8 text-white text-5xl font-light hover:scale-110 transition-transform z-10"
        onClick={(e) => {
          e.stopPropagation();
          nextImage();
        }}
      >
        ›
      </button>

      <button
        className="absolute top-4 right-4 text-white text-4xl font-bold hover:text-gray-300"
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
  const [galleryOpen, setGalleryOpen] = useState(false);

  const { name, imageKey } = project;
  const image = PROJECT_IMAGES[imageKey];

  useEffect(() => {
    const node = projectCard.current;
    if (node) {
      VanillaTilt.init(node, tiltOptions);
    }

    return () => node?.vanillaTilt?.destroy();
  }, []);

  return (
    <>
      <div
        onClick={() => setGalleryOpen(true)}
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
            unoptimized
          />
        </div>
      </div>

      {galleryOpen && (
        <FullscreenGallery
          images={project.gallery }
          initialIndex={0}
          alt={name}
          onClose={() => setGalleryOpen(false)}
        />
      )}
    </>
  );
};

export default ProjectTile;