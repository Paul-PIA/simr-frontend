import React, { useState } from 'react';
import Link from 'next/link';

//Ce code crée le bouton de retour à l'accueil qui est utilisé par les autres pages. Le paramètre st permet de rajouter des styles supplémentaires
const HomePageButton = ({st}) => {
  const [mouse,setMouse]=useState(false)

  return (
      <Link
      href='/'>
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
      </button> </Link>
  );
};

export default HomePageButton;
