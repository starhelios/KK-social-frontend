import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Input } from 'antd';
import './Dashboard.scss';

import DirectionIcon from '../../assets/img/direction-icon.png';
import SearchIcon from '../../assets/img/search-icon.png';

import Script from 'react-load-script';

const SearchBar = () => {
  const [query, setQuery] = useState('')
  const googleKey = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`
  let autocomplete;

  useEffect(() => {
    
  }, [query])

  const handleScriptLoad = () => {
    // Declare Options For Autocomplete
    const options = {
      types: ['(cities)'],
    };

    // Initialize Google Autocomplete
    /*global google*/ // To disable any eslint 'google not defined' errors
    autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete'),
      options,
    );

    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components and formatted
    // address.
    autocomplete.setFields(['address_components', 'formatted_address']);

    // Fire Event when a suggested name is selected
    autocomplete.addListener('place_changed', handlePlaceSelect);
  }
  
  
  const handlePlaceSelect = () => {

    // Extract City From Address Object
    const addressObject = autocomplete.getPlace();
    const address = addressObject.address_components;

    // Check if address is valid
    if (address) {
      // Set State
      setQuery(addressObject.formatted_address)
    }
  }


    return (
      <div>
        <Script
          url={googleKey}
          onLoad={handleScriptLoad}
        />
        <Row md={6} className='location-search-box-item'>
          <Col>
            <Input id="autocomplete" className="searchlocationbox" placeholder="Search City" onChange={(e) => setQuery(e.target.value)} value={query}
              style={{
                margin: '0 auto',
                maxWidth: 800
              }}
              prefix={<img src={SearchIcon} alt='' />}
              suffix={<img src={DirectionIcon} alt='' />}
            />
            
          </Col>
        </Row>
      </div>
    );

}

export default SearchBar;