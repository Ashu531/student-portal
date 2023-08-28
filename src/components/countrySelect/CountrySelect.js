import React, { useEffect, useState } from "react";
import countries from '../../assets/json/countries.json';


export const CountrySelect = ({
    onSelect,
    selectedCountry,
}) => {
    
    return (
      <select
        style={{
            cursor: 'pointer',
            width: '80px',
            appearance: 'none',
            WebkitAppearance: 'none',
            padding: '1.6rem 0.4rem',
            borderRadius: '1rem',
            border: '1px solid rgba(64, 64, 64, 0.1)',
            background: 'rgba(64, 64, 64, 0.1)',
            margin: '1.2rem 0'
        }}
        value={selectedCountry}
        onChange={(selectedOption) => onSelect(selectedOption.target.value)}
      >
          {countries.map(country => (
              <option value={country.dial_code} style={{width: '80px', textAlign: 'center'}}>{country.name} {country.flag}</option>
          ))}
      </select>
    );
  };