import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Input } from 'antd';
import './Dashboard.scss';

import DirectionIcon from '../../assets/img/direction-icon.png';
import SearchIcon from '../../assets/img/search-icon.png';

import Script from 'react-load-script';

const SearchLocationInput = ({query, setQuery, pageClass, cityChosen, setCityChosen, showIcon}) => {
  
  const [cities, setCities] = useState([])
  const googleKey = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_API_KEY}&libraries=places`
  let autocomplete;

  const renderRows = (item) => {
    return (<Row>{item}</Row>)
  }
  const handleQueryChange = (e) => {
    setQuery(e.target.value)
  }

  useEffect(() => {
    if(cityChosen && !query.length) return setCityChosen(false)
    if(!query.length) { setCities([])}
    else {
      var nodes = document.getElementsByClassName("pac-item") ? document.getElementsByClassName("pac-item"): null;
      if(nodes && nodes.length){
        let array = [];
        for(var i=0; i<nodes.length; i++) {
          const string = nodes[i].outerText;
          const whiteSpaceIndex = string.indexOf(',') - 2
          const newString = string.slice(0, whiteSpaceIndex) + " " + string.slice(whiteSpaceIndex)
          array.push(newString)
        }
        setCities(array)
      }
    }
  }, [query])

  const handleScriptLoad = () => {
    const options = {
      types: ['(cities)'],
    };

    /*global google*/ // To disable any eslint 'google not defined' errors
    autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete'),
      options,
    );

    autocomplete.setFields(['address_components', 'formatted_address']);

   autocomplete.addListener('place_changed', handlePlaceSelect);
  }
  
  
  const handlePlaceSelect = (item) => {
      setCityChosen(true)
      setQuery(item)
  }
  console.log(query.length)


    return (
      <div>
        <Script
          url={googleKey}
          onLoad={handleScriptLoad}
        />
        <Row md={6} className='location-search-box-item'>
          <Col>
            <Input autoComplete={false} id="autocomplete" className="searchlocationbox" placeholder="Search City" onChange={handleQueryChange} value={query}
              style={{
                margin: '0 auto',
                maxWidth: 800
              }}
              prefix={showIcon ? <img src={SearchIcon} alt='' />: null}
              suffix={<img src={DirectionIcon} alt='' />}
            />
          </Col>
        </Row>
            {cities.length && query.length > 1 && !cityChosen ? cities.map((item, idx) => {
              return (<Row key={idx} onClick={() => handlePlaceSelect(item)} md={6} className={pageClass}>{item}</Row>)
            }): <div></div>}
      </div>
    );

}

export default SearchLocationInput;