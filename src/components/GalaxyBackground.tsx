import React from 'react';

const GalaxyBackground: React.FC = () => {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 galaxy-bg">
      {/* Base starfield (twinkle) */}
      <div className="galaxy-stars galaxy-stars--layer1" />
      <div className="galaxy-stars galaxy-stars--layer2" />

      {/* Nebula / drift */}
      <div className="galaxy-nebula galaxy-nebula--1" />
      <div className="galaxy-nebula galaxy-nebula--2" />
      <div className="galaxy-nebula galaxy-nebula--3" />

      {/* subtle vignette */}
      <div className="galaxy-vignette" />
    </div>
  );
};

export default GalaxyBackground;

