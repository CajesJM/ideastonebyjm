import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './Style/AboutPage.css';

const AboutPage = () => {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: "Levi",
      role: "Founder & Full-Stack Developer",
      bio: "Passionate about helping students bring their capstone ideas to life with cutting-edge technology.",
      skills: ["React", "Node.js", "AI/ML", "Cloud Architecture"],
      avatar: "👨‍💻"
    },
    {
      name: "Sarah",
      role: "UI/UX Designer",
      bio: "Creating beautiful and intuitive interfaces that make capstone projects stand out.",
      skills: ["Figma", "UI Design", "User Research", "Prototyping"],
      avatar: "🎨"
    },
    {
      name: "Mike",
      role: "Backend Specialist",
      bio: "Building robust and scalable backend systems for complex capstone requirements.",
      skills: ["Python", "Database Design", "API Development", "DevOps"],
      avatar: "⚙️"
    }
  ];

  const stats = [
    { number: "50+", label: "Projects Completed" },
    { number: "100+", label: "Students Helped" },
    { number: "4.9", label: "Average Rating" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <div className="about-page">
      {/* Background Elements */}
      <div className="about-background">
        <div className="floating-shapes shape-1"></div>
        <div className="floating-shapes shape-2"></div>
        <div className="floating-shapes shape-3"></div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="about-container"
      >
        {/* Header Section */}
        <section className="about-hero">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-content"
          >
            <h1 className="about-title">
              About <span className="gradient-text">IdeaStone</span>
            </h1>
            <p className="about-subtitle">
              Empowering students to transform innovative ideas into exceptional capstone projects
            </p>
            <motion.button
              onClick={() => navigate(-1)}
              className="back-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="bi bi-arrow-left"></i>
              Back to Home
            </motion.button>
          </motion.div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mission-card"
          >
            <div className="mission-icon">
              <i className="bi bi-bullseye"></i>
            </div>
            <h2>Our Mission</h2>
            <p>
              At IdeaStone, we believe every student has the potential to create something extraordinary. 
              Our mission is to provide the tools, guidance, and support needed to turn your capstone 
              vision into a reality. We combine technical expertise with creative problem-solving to 
              help you build projects that stand out.
            </p>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="stat-card"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="stat-number">{stat.number}</h3>
                <p className="stat-label">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2>Meet Our Team</h2>
            <p>The passionate developers behind IdeaStone</p>
          </motion.div>

          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                className="team-card"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div className="member-avatar">
                  {member.avatar}
                </div>
                <h3 className="member-name">{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <p className="member-bio">{member.bio}</p>
                <div className="skills-list">
                  {member.skills.map(skill => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="section-header"
          >
            <h2>Our Values</h2>
          </motion.div>

          <div className="values-grid">
            <motion.div
              className="value-card"
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <i className="bi bi-heart"></i>
              <h4>Student-First Approach</h4>
              <p>Your success is our priority. We tailor our support to your specific needs and goals.</p>
            </motion.div>

            <motion.div
              className="value-card"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <i className="bi bi-lightning"></i>
              <h4>Innovation</h4>
              <p>We stay at the forefront of technology to bring you the latest tools and methodologies.</p>
            </motion.div>

            <motion.div
              className="value-card"
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <i className="bi bi-shield-check"></i>
              <h4>Quality</h4>
              <p>We maintain high standards in every project, ensuring professional and reliable results.</p>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="about-cta">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="cta-card"
          >
            <h2>Ready to Start Your Capstone Journey?</h2>
            <p>Join hundreds of students who have successfully brought their ideas to life with IdeaStone</p>
            <motion.button
              onClick={() => navigate('/Generator')}
              className="cta-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Today
              <i className="bi bi-arrow-right"></i>
            </motion.button>
          </motion.div>
        </section>
      </motion.div>
    </div>
  );
};

export default AboutPage;