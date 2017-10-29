import React, { Component } from 'react';
import '../../stylesheets/Main.css';
import { Link } from 'react-router-dom';
import '../../stylesheets/btn-circle.css';
import * as EventActions from '../../actions/EventActions';

import {Button} from 'reactstrap';

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

  handleDeleteClick = (id) => (e) => {
    e.preventDefault();
    EventActions.deleteEvent(id);
  };

  render() {
    const { event } = this.props;

    let hoverStyle = {};
    if (this.state.isHovering) {
      hoverStyle = {
        backgroundColor: "#e9352c",
        color: "#e5e5e5",
      }
    }

    const day = event.createdAt.substring(8,10),
      month = event.createdAt.substring(5,7),
      year = event.createdAt.substring(0,4);

    return (
      <div onMouseOver={this.handleMouseOver.bind(this)} onMouseOut={this.handleMouseOut.bind(this)}
           className={"col-md-2 mb-3 eventTile bg-navy"}
           style={hoverStyle}>
        <Link to={"/event/" + event.id}>
          <p>
            {event.institution}
          </p>

          <p>
            {event.type}
          </p>

          <p>
            {day}.{month}.{year}
          </p>

          <Button outline color={"info"} className={"btn-circle-sm deleteEvent"}
                  onClick={this.handleDeleteClick(event.id).bind(this)}>
            <i className="fa fa-times" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    );
  }
}

export default InfoModal;


