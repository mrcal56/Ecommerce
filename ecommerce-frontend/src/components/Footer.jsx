import React from 'react';
import { FaInstagram } from 'react-icons/fa';
import logo from "../flammeB.png";

const Footer = () => {
  return (
    <footer className="relative flex justify-center items-center p-5 border-t border-black/5"
      style={{ background: 'rgba(89, 121, 180, 0.4)', backdropFilter: 'blur(8px)' }}>
      
      {/* Instagram — esquina izquierda */}
      <div className="absolute left-5 bottom-2.5">
        <a
          href="https://www.instagram.com/flammestore__/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#E1306C] text-4xl no-underline"
        >
          <FaInstagram className="transition-transform duration-300 hover:scale-125" />
        </a>
      </div>
 
      {/* Centro — logo y texto */}
      <div className="flex flex-col items-center">
        <img src={logo} alt="Flamme Logo" className="w-40 h-auto" />
        <p className="text-base font-medium" style={{ fontFamily: 'Outfit, sans-serif' }}>
          We do what we like 🔥
        </p>
      </div>
 
    </footer>
  );
};
 
export default Footer;