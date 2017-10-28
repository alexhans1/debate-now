import React, { Component } from 'react';
import '../../stylesheets/App.css';

class InfoModal extends Component {

  render() {

    const { event } = this.props;

    const day = event.createdAt.substring(8,10),
      month = event.createdAt.substring(5,7),
      year = event.createdAt.substring(0,4);

    return (
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
    );
  }
}

export default InfoModal;


