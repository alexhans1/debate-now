import React, { Component } from 'react';
import '../../../stylesheets/Loader.css';

class LoaderSqaures extends Component {

  render() {

    let dark = this.props.dark || null;
    let small = this.props.small || null;

    return (
      <div className={"sk-folding-cube"}>
        <div className={small + " sk-cube1 sk-cube " + dark} />
        <div className={small + " sk-cube2 sk-cube " + dark} />
        <div className={small + " sk-cube4 sk-cube " + dark} />
        <div className={small + " sk-cube3 sk-cube " + dark} />
      </div>
    )
  }
}

export default LoaderSqaures;


