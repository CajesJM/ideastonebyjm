import { useEffect, useRef, useState } from "react";
import profilePicture from "C:/xampp/htdocs/ideastone/src/assets/IMG_20240106_195144_425.jpg";
import "C:/xampp/htdocs/ideastone/src/Style/HomePage.css";

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
    img:profilePicture,
  },
  {
    id: 3,
    name: "Kenneth Baculpo",
    role: "Frontend Developer",
    age: 20,
    img:profilePicture,
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

    const nodes = containerRef.current?.querySelectorAll(".card");
    nodes?.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  return (

  <section className="team-section">
    <h1 className={`heading ${visibleIds.size ? "visible" : ""}`}>Developers</h1>

    <div className="padd" ref={containerRef}>
      {people.map((p, index) => (
        <article
          key={p.id}
          data-id={p.id}
          className={`card ${visibleIds.has(String(p.id)) ? "visible" : ""}`}
          style={{ ["--i"]: index }} 
          tabIndex="0"
        >
          <div className="avatar-wrap">
            <img className="profile" src={p.img} alt={`${p.name} profile`} />
            <div className="avatar-glow" />
          </div>

          <h2 className="name">{p.name}</h2>
          <p className="role">{p.role}</p>
          <p className="text">{p.age}</p>
        </article>
      ))}
    </div>
  </section>
);
}

export default Admin;