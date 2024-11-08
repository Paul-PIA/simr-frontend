import React, { useState } from 'react';
const HomePageButton = ({st}) => {
  const [mouse,setMouse]=useState(false)

  return (
      <a
      href={typeof window !== 'undefined' ? window.location.origin : '/'}>
      <button className="button"
        style={Object.assign({}, st, {
          top: '20px',
          left: '10px',
          padding: '10px 15px',
          backgroundColor: mouse?'#0056b3':'#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        })}
        onMouseEnter={()=>setMouse(true)}
        onMouseLeave={()=>setMouse(false)}
      >

        Accueil
      </button> </a>
  );
};

export default HomePageButton;
