import { useEffect, useRef, useState } from "react";
import { motion } from 'framer-motion';
import profilePicture from "C:/xampp/htdocs/ideastone/src/assets/IMG_20240106_195144_425.jpg";
import "../../src/Style/Admin.css";

function Admin() {
  const containerRef = useRef(null);
  const [visibleIds, setVisibleIds] = useState(new Set());

  const people = [
    {
      id: 1,
      name: "Eugen Paul Cosme",
      role: "UI/UX Designer",
      age: 22,
      img: profilePicture,
    },
    {
      id: 2,
      name: "Fernando Bernales Jr.",
      role: "Backend Developer",
      age: 20,
      img: profilePicture,
    },
    {
      id: 3,
      name: "Kenneth Baculpo",
      role: "Frontend Developer",
      age: 20,
      img: profilePicture,
    },
    {
      id: 4,
      name: "Jelson Intina",
      role: "DevOps Engineer",
      age: 20,
      img: profilePicture,
    },
    {
      id: 5,
      name: "Donesa Mendez",
      role: "QA Tester",
      age: 22,
      img: profilePicture,
    },
    {
      id: 6,
      name: "John Mark Cajes",
      role: "Full Stack Developer",
      age: 20,
      img: profilePicture,
    },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-id");
          if (entry.isIntersecting) {
            setVisibleIds((prev) => new Set(prev).add(id));
          }
        });
      },
      { threshold: 0.15 }
    );

    const nodes = containerRef.current?.querySelectorAll(".admin-card");
    nodes?.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="admin-section">
      <div className="admin-background-elements">
        <div className="admin-orb admin-orb-1"></div>
        <div className="admin-orb admin-orb-2"></div>
        <div className="admin-orb admin-orb-3"></div>
      </div>

      <motion.h1 
        className="admin-heading"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        Meet Our Development Team
      </motion.h1>

      <motion.p 
        className="admin-subtitle"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        The brilliant minds behind IdeaStone - passionate developers dedicated to innovation
      </motion.p>

      <div className="admin-grid" ref={containerRef}>
        {people.map((person, index) => (
          <motion.div
            key={person.id}
            data-id={person.id}
            className={`admin-card ${visibleIds.has(String(person.id)) ? "visible" : ""}`}
            style={{ ["--i"]: index }}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
            whileHover={{ 
              y: -10,
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
            viewport={{ once: true, margin: "-50px" }}
          >
            <div className="card-glow"></div>
            
            <div className="admin-avatar-container">
              <div className="avatar-border-glow"></div>
              <img 
                className="admin-profile" 
                src={person.img} 
                alt={`${person.name} profile`} 
              />
              <div className="avatar-shine"></div>
            </div>

            <div className="admin-card-content">
              <h3 className="admin-name">{person.name}</h3>
              <p className="admin-role">{person.role}</p>
              <div className="admin-details">
                <span className="admin-age">{person.age} years old</span>
              </div>
              

              <div className="tech-indicator">
                <div className="tech-dot"></div>
                <span>Available for projects</span>
              </div>
            </div>
            <div className="card-hover-overlay"></div>
          </motion.div>
        ))}
      </div>

      {/* Team Stats */}
      <motion.div 
        className="team-stats"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        <div className="stat-item">
          <div className="stat-number">{people.length}</div>
          <div className="stat-label">Team Members</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">100%</div>
          <div className="stat-label">Dedicated</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">24/7</div>
          <div className="stat-label">Support Ready</div>
        </div>
      </motion.div>
    </section>
  );
}

export default Admin;