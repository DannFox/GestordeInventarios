// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white text-center py-7 mt-auto">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Mi Empresa. Todos los derechos reservados.
      </p>
      <div className="flex justify-center space-x-4 mt-2">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300">Facebook</a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300">Twitter</a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-300">LinkedIn</a>
      </div>
    </footer>
  );
};

export default Footer;
