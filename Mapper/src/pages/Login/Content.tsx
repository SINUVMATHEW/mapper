import React from 'react';
import LoginPageImage from '../../assets/Login Page Side Image.png'

const LoginPageSideImage: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '97vh' }}>
      <img 
        src={LoginPageImage} 
        alt="Login Page Side" 
        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} 
      />
    </div>
  );
};

export default LoginPageSideImage;
