import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-5 p-4 text-center">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <img src="ruta-del-icono.png" alt="E-commerce Logo" style={{ width: '100px' }} />
          </div>
          <div className="col-md-4">
            <p className="mb-1">Descripción breve del e-commerce.</p>
            <p className="mb-1">Teléfono: (123) 456-7890</p>
            <p className="mb-1">Email: contacto@ecommerce.com</p>
            <p>Ubicación: Calle Falsa 123, Ciudad, País</p>
          </div>
          <div className="col-md-4">
            <p>&copy; {new Date().getFullYear()} E-commerce. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
