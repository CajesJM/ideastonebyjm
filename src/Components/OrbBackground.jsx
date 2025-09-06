
import React from 'react';
import Orb from './Orb';

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