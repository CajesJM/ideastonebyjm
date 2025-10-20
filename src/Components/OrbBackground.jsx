
import React from 'react';
import Orb from "./Orb";  
import "../Style/Orb.css";


const OrbBackground = () => {
  return (
 <div style={{  position: 'center' }}>
  <Orb
    hoverIntensity={0.5}
    rotateOnHover={true}
    hue={0}
    forceHoverState={false}
  />
</div>

  );
};

export default OrbBackground;