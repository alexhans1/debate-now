import React, { Component } from 'react';
import '../../stylesheets/Main.css';
import '../../stylesheets/btn-circle.css';
import { Link } from 'react-router-dom';
import DeleteEventModal from './DeleteEventModal';
import * as EventActions from '../../actions/EventActions';

import {Button} from 'reactstrap';

class EventTile extends Component {

  constructor() {
    super();
    this.state = {
      isHovering: false,
      showModal: false,
    }
  }

  handleMouseOver() {
    this.setState({isHovering: true});
  }

  handleMouseOut() {
    this.setState({isHovering: false});
  }

  toggleModal(e) {
    if (!this.state.showModal) e.preventDefault();
    this.setState({
      showModal: !this.state.showModal,
    });
  }

  static handleDeleteClick(id) {
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

    const day = event.date.substring(8,10),
      month = event.date.substring(5,7),
      year = event.date.substring(0,4);

    return (
      <div onMouseOver={this.handleMouseOver.bind(this)} onMouseOut={this.handleMouseOut.bind(this)}
           className={"col-md-2 mb-3 eventTile bg-navy"}
           style={hoverStyle}>
        <Link to={{ pathname: '/event/' + event.id, state: { event } }}>
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
                  onClick={this.toggleModal.bind(this)}>
            <i className="fa fa-times" aria-hidden="true" />
          </Button>
        </Link>

        <DeleteEventModal showModal={this.state.showModal} toggle={this.toggleModal.bind(this)}
                       event={event} handleSubmit={EventTile.handleDeleteClick.bind(this)} />
      </div>
    );
  }
}

export default EventTile;


