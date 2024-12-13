import React from 'react';

const Spinner = ({ className = "", color="" }) => {
  return (
    <div 
      className={`spinner-wrapper ${className}`} 
  
    >
      <div className={`spinner ${color}`}></div>
    </div>
  );
};

export default Spinner;