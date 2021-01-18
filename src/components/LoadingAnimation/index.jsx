import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Spinner from 'react-spinkit'
import './LoadingAnimation.scss'

function LoadingAnimation(props) {
  if (props.loading) {
    return (
      <div className="loading-animation">
        <div className="loading-block">
          <Spinner name={props.name} className={props.size} color={props.color} />
          <span className={props.size}>{props.text}</span>
        </div>
      </div>
    )
  }
  return null
}

LoadingAnimation.propTypes = {
  name: PropTypes.string,
  size: PropTypes.string,
  color: PropTypes.string,
  text: PropTypes.string,
  loading: PropTypes.bool,
}

LoadingAnimation.defaultProps = {
  name: 'three-bounce',
  size: 'large',
  color: '#343f4b',
  loading: false,
}

export default memo(LoadingAnimation)
