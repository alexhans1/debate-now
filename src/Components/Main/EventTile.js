import React, { Component } from 'react';
import '../../stylesheets/Main.css';
import '../../stylesheets/btn-circle.css';
import { Link } from 'react-router-dom';
import DeleteEventModal from './DeleteEventModal';
import EditEventModal from './EditEventModal';
import * as EventActions from '../../actions/EventActions';

import {Button} from 'reactstrap';

class EventTile extends Component {

  constructor() {
    super();
    this.state = {
      isHovering: false,
      showDeleteModal: false,
      showEditModal: false,
    }
  }

  handleMouseOver() {
    this.setState({isHovering: true});
  }

  handleMouseOut() {
    this.setState({isHovering: false});
  }

  toggleDeleteModal(e) {
    if (!this.state.showDeleteModal) e.preventDefault();
    this.setState({
      showDeleteModal: !this.state.showDeleteModal,
    });
  }

  toggleEditModal(e) {
    if (!this.state.showEditModal) e.preventDefault();
    this.setState({
      showEditModal: !this.state.showEditModal,
    });
  }

  static handleDeleteClick(id) {
    EventActions.deleteEvent(id);
  };

  static handleEditClick(event) {
    EventActions.updateEvent(event);
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

          <Button outline color={"info"} className={"btn-circle-sm editEvent"}
                  onClick={this.toggleEditModal.bind(this)}>
            <i className="fa fa-pencil" aria-hidden="true" />
          </Button>

          <Button outline color={"info"} className={"btn-circle-sm deleteEvent"}
                  onClick={this.toggleDeleteModal.bind(this)}>
            <i className="fa fa-times" aria-hidden="true" />
          </Button>
        </Link>

        <DeleteEventModal showModal={this.state.showDeleteModal} toggle={this.toggleDeleteModal.bind(this)}
                       event={event} handleSubmit={EventTile.handleDeleteClick.bind(this)} />

        <EditEventModal showModal={this.state.showEditModal} toggle={this.toggleEditModal.bind(this)}
                       event={event} handleSubmit={EventTile.handleEditClick.bind(this)} />
      </div>
    );
  }
}

export default EventTile;


