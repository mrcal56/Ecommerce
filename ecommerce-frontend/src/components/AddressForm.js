// components/AddressForm.js
import React, { useState, useEffect } from 'react';

const AddressForm = () => {
  const [address, setAddress] = useState('');

  useEffect(() => {
    // Cargar la API de Google Maps
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyATogSQsl9E7hFe0IENLnItkJTHu9YH0jo&libraries=places`;
    script.async = true;
    script.onload = () => initAutocomplete();
    document.body.appendChild(script);
  }, []);

  const initAutocomplete = () => {
    const input = document.getElementById('address-input');
    const autocomplete = new window.google.maps.places.Autocomplete(input, { types: ['address'] });
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      setAddress(place.formatted_address);
    });
  };

  return (
    <div className="address-form">
      <label htmlFor="address">Address</label>
      <input
        type="text"
        id="address-input"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter your address"
      />
    </div>
  );
};

export default AddressForm;
