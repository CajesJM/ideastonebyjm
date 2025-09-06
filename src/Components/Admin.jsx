import { useEffect, useRef, useState } from 'react';
import profilePicture from 'C:/xampp/htdocs/ideastone/src/assets/IMG_20240106_195144_425.jpg';
import 'C:/xampp/htdocs/ideastone/src/HomePage.css';

function Admin() {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        setTimeout(() => {
          entry.target.classList.remove('visible');
        }, 200); 
      }
    },
    { threshold: 0.1 }
  );

  if (cardRef.current) {
    observer.observe(cardRef.current);
  }

  return () => observer.disconnect();
}, []);


  return (
    <div className='padd'>
      <div
        ref={cardRef}
        className={`card ${isVisible ? 'visible' : ''}`}
      >
        <img className="profile" src={profilePicture} alt="Profile Picture" />
        <h2 className='name'>John Mark Cajes</h2>
        <p className="text">BSIT</p>
        <p className='text'>20</p>
      </div>
    </div>
  );
}

export default Admin;