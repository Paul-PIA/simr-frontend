import React from 'react';
const HomePageButton = ({st}) => {


  return (
    <a
      href={typeof window!=='undefined'? window.location.origin:'/'}>
    <button
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
    </button> </a>
  );
};

export default HomePageButton;
