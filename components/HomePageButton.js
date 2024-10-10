import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePageButton = ({st}) => {

  const handleClick = () => {
    window.location='/';
  };

  return (
    <button
      onClick={handleClick}
      style={Object.assign({},st,{
        
        top: '20px',
        left: '10px',
        padding: '10px 15px',
        backgroundColor: '#007BFF',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      })}
    >
      Accueil
    </button>
  );
};

export default HomePageButton;
