import React, { Component } from 'react';
import '../../stylesheets/App.css';

class InfoModal extends Component {

  constructor() {
    super();
    this.state = {
      isHovering: false,
    }
  }

  handleMouseOver() {
    this.setState({isHovering: true});
  }

  handleMouseOut() {
    this.setState({isHovering: false});
  }

  render() {

    let hoverStyle = {};
    if (this.state.isHovering) {
      hoverStyle = {
        backgroundColor: "#e9352c",
        color: "#e5e5e5",
      };
    }

    const { event } = this.props;

    const day = event.createdAt.substring(8,10),
      month = event.createdAt.substring(5,7),
      year = event.createdAt.substring(0,4);

    return (
      <div onMouseOver={this.handleMouseOver.bind(this)} onMouseOut={this.handleMouseOut.bind(this)}
           style={hoverStyle}
           className={"col-md-2 pointer eventTile border--olive bg-navy"}>
        <div>
          <p>
            {event.institution}
          </p>

          <p>
            {event.type}
          </p>

          <p>
            {day}.{month}.{year}
          </p>
        </div>
      </div>
    );
  }
}

export default InfoModal;


