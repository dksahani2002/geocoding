// src/AddressInput.js
import React, { useState } from 'react';
import Button from './Button';
import './AddressInput.css';  // Import the CSS file

const AddressInput = ({ onSubmit }) => {
  const [address, setAddress] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (address.trim()) {
      onSubmit(address.trim());
    //   setAddress('');
    }
  };

  return (
    <div className="address-input-container">
      <div className="address-form-container">
        <h3>Enter Address</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address"
            required
          />
          <Button submit={handleSubmit} text="Get Geocode" />
        </form>
      </div>
    </div>
  );
};

export default AddressInput;
