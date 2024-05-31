import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white py-4">
      <Container>
        <Row>
          <Col md={4} className="text-center text-md-left mb-3 mb-md-0">
            <img src="/logo.png" alt="E-commerce Logo" className="mb-2" />
            <p>Tu tienda de confianza para todas tus necesidades.</p>
          </Col>
          <Col md={4} className="text-center mb-3 mb-md-0">
            <p><strong>Contacto</strong></p>
            <p>Teléfono: (123) 456-7890</p>
            <p>Email: contacto@ecommerce.com</p>
          </Col>
          <Col md={4} className="text-center text-md-right">
            <p><strong>Ubicación</strong></p>
            <p>Calle Falsa 123</p>
            <p>Ciudad, País</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
