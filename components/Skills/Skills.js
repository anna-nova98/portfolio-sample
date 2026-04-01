/* eslint-disable @next/next/no-img-element */
import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const SKILLS = {
  core: ["ProductAdvertising", "BrandStrategy", "VisualIdentity"],
  tools: ["Photoshop", "Illustrator", "AfterEffects", "Figma", "XD"],
  campaigns: ["PrintDesign", "DigitalDesign", "SocialMedia", "MotionGraphics"],
  storytelling: ["UXDesign", "VisualStorytelling", "UserExperience"],
};

const Skills = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Section titles animation
      gsap.from(".skills-title", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      // Skill cards animation
      gsap.from(".skill-card", {
        y: 50,
        opacity: 0,
        scale: 0.8,
        rotate: () => gsap.utils.random(-5, 5),
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="w-full relative select-none mt-44 py-16 bg-gradient-to-r from-purple-50 via-pink-50 to-yellow-50"
    >
      <div className="section-container mx-auto px-6 flex flex-col items-center">
        <p className="uppercase tracking-widest text-gray-500 skills-title">
          SKILLS
        </p>
        <h1 className="text-6xl mt-2 font-bold skills-title text-center text-gray-900">
          My Designer Skills
        </h1>
        <h2 className="text-xl md:max-w-2xl text-center mt-4 text-gray-700 skills-title">
          My work is rooted in product advertising. I take pride in designing engaging experiences that merge aesthetics, brand strategy, and storytelling.
        </h2>

        {/* Skills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 mt-16 w-full">
          {Object.entries(SKILLS).map(([category, items]) =>
            items.map((skill) => (
              <div
                key={skill}
                className="skill-card flex flex-col items-center rounded-xl p-6 cursor-pointer
                          bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-200
                          shadow-2xl hover:scale-110 hover:-rotate-1 transition-transform duration-500"
                style={{ transformOrigin: "center" }}
              >
                <Image
                  src={`/skills/${skill}.svg`}
                  alt={skill}
                  width={64}
                  height={64}
                  className="mb-3"
                  unoptimized 
                />
                <p className="text-center font-semibold text-gray-900 text-base">
                  {skill.replace(/([A-Z])/g, " $1").trim()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Skills;