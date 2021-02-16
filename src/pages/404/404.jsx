import { Card } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import './404.scss'

function NoMatch() {
  return (
    <div className="NoMatchWrapper">
      <div className="NoMatch">
        <Card>
        <h1>404 Page Not Found</h1>
        <div style={{textAlign: 'center'}}>
        <Link to="/">Back to home</Link>
        </div>
        </Card>
      </div>
    </div>
  );
}

export default NoMatch;
