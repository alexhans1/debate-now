import React, { Component } from 'react';
import LoaderSqaures from './LoaderSqares';
import '../../../stylesheets/Loader.css';

class Loader extends Component {

  render() {
    return (
      <div className={"loader-container"}>
        <LoaderSqaures />
      </div>

    )
  }
}

export default Loader;


