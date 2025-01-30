import React, { useState, useEffect } from 'react';
import './Servicios.css'; // Tu archivo CSS
import imagen1 from '../labSer.jpg'; // Imagen del carrusel 1
import imagen2 from '../labSer2.jpg'; // Imagen del carrusel 2
import imagen3 from '../labSer3.jpg'; // Imagen del carrusel 3

// Íconos para los botones
import diabetesIcon from '../diabetes.svg';
import ultrasonidoIcon from '../ultrasonido.svg';
import rayosXIcon from '../rayosx.svg';
import generalIcon from '../General.svg';
import etsIcon from '../ets.svg';
import metabolicoIcon from '../metabolico.svg';

const Servicios = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [previousImageIndex, setPreviousImageIndex] = useState(null); // Índice de la imagen saliente
  const [animationClass, setAnimationClass] = useState('slide-in'); // Controla la animación inicial

  const images = [imagen1, imagen2, imagen3]; // Lista de imágenes del carrusel

  useEffect(() => {
    console.log('Current Image Index:', currentImageIndex);
    console.log('Previous Image Index:', previousImageIndex);
  
    const interval = setInterval(() => {
      setPreviousImageIndex(currentImageIndex); // Marca la imagen actual como saliente
      setAnimationClass('slide-out'); // Aplica la clase de salida
  
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length); // Cambia la imagen
        setAnimationClass('slide-in'); // Aplica la clase de entrada
      }, 500); // Duración de la animación de salida
    }, 5000); // Cambia cada 5 segundos
  
    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, [currentImageIndex]);

  const servicios = [
    { nombre: 'Diabetes', icono: diabetesIcon, link: '/diabetes' },
    { nombre: 'Ultrasonido', icono: ultrasonidoIcon, link: '/ultrasonido' },
    { nombre: 'Rayos X', icono: rayosXIcon, link: '/rayosx' },
    { nombre: 'ETS', icono: etsIcon, link: '/ets' },
    { nombre: 'General', icono: generalIcon, link: '/general' },
    { nombre: 'Metabólico', icono: metabolicoIcon, link: '/metabolico' },
  ];

  return (
    <div className="servicios-container">
      {/* Carrusel de imágenes */}
      <div className="carrusel">
        {images.map((image, index) => (
          <div
            key={index}
            className={`carrusel-imagen-container ${
              index === currentImageIndex
                ? 'slide-in-active'
                : index === previousImageIndex
                ? 'slide-out-active'
                : 'hidden'
              }`}
          >
            <img
              src={image}
              alt={`Imagen ${index + 1}`}
              className="carrusel-imagen"
            />
          </div>
        ))}
      </div>

      {/* Botones de servicios */}
      <div className="botones-servicios">
        <div className="fila-botones">
          {servicios.slice(0, 3).map((servicio, index) => (
            <a href={servicio.link} className="btn-servicio" key={index}>
              <img src={servicio.icono} alt={servicio.nombre} />
              <span>{servicio.nombre}</span>
            </a>
          ))}
        </div>
        <div className="fila-botones">
          {servicios.slice(3, 6).map((servicio, index) => (
            <a href={servicio.link} className="btn-servicio" key={index}>
              <img src={servicio.icono} alt={servicio.nombre} />
              <span>{servicio.nombre}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Servicios;
