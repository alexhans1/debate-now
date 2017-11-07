import React, { Component } from 'react';
import '../../stylesheets/Main.css';
import '../../stylesheets/btn-circle.css';
import { Link } from 'react-router-dom';
import DeleteEventModal from './DeleteEventModal';
import EventPasswordModal from '../EventPasswordModal';
import EditEventModal from './EditEventModal';
import * as EventActions from '../../actions/EventActions';

import { Collapse, Card, CardImg, CardBody,
  CardTitle, CardSubtitle, Button } from 'reactstrap';

class EventTile extends Component {

  constructor() {
    super();
    this.state = {
      showDeleteModal: false,
      showEditModal: false,
      showPasswordModal: false,
      collapse: false,
    }
  }

  toggleDeleteModal(e) {
    if (!this.state.showDeleteModal) {
      e.preventDefault();
      this.toggleCollapse();
    }
    this.setState({
      showDeleteModal: !this.state.showDeleteModal,
    });
  }

  toggleEditModal(e) {
    if (!this.state.showEditModal) {
      e.preventDefault();
      console.log(123);
      if (JSON.parse(localStorage.getItem('canEdit')).includes(this.props.event.id)) {
        this.setState({
          showEditModal: !this.state.showEditModal,
        });
      } else {
        this.togglePasswordModal();
      }
      this.toggleCollapse();
    } else {
      this.setState({
        showEditModal: !this.state.showEditModal,
      });
    }
  }

  togglePasswordModal() {
    this.setState({
      showPasswordModal: !this.state.showPasswordModal,
    });
  }

  toggleCollapse() {
    this.setState({ collapse: !this.state.collapse });
  }

  static handleDeleteClick(id) {
    EventActions.deleteEvent(id);
  };

  static handleEditClick(event) {
    EventActions.updateEvent(event);
  };

  render() {
    const { event } = this.props;

    const day = event.date.substring(8,10),
      month = event.date.substring(5,7),
      year = event.date.substring(0,4);

    const cardHeader = <CardImg top width="100%"
                          src="https://images.pexels.com/photos/633481/pexels-photo-633481.jpeg?w=1260&h=750&auto=compress&cs=tinysrgb"
                          alt="Card image cap" />;

    return (
      <div className={"col-md-4 mb-3 eventTile"}>
        <Link to={"/event/" + event.id}>
          <Card style={{boxShadow: '2px 3px 3px #424242'}}>
            {cardHeader}
            <CardBody className={"black"}>
              <CardTitle>{event.institution}</CardTitle>
              <CardSubtitle>{event.type} - {day}.{month}.{year}</CardSubtitle>
            </CardBody>
          </Card>
        </Link>

        <Button outline size={"sm"} color="dark" onClick={this.toggleCollapse.bind(this)} className={"editEvent"}>
          <i className="fa fa-bars" aria-hidden="true" />
        </Button>
        <Collapse isOpen={this.state.collapse} cssModule={{transition: 'none'}}>
          <Button size={"sm"} color={"dark"}
                  onClick={this.toggleEditModal.bind(this)}>
            <i className="fa fa-pencil" aria-hidden="true" />
          </Button>
          <br/>
          <Button size={"sm"} color={"dark"}
                  onClick={this.toggleDeleteModal.bind(this)}>
            <i className="fa fa-times" aria-hidden="true" />
          </Button>
        </Collapse>

        <DeleteEventModal showModal={this.state.showDeleteModal} toggle={this.toggleDeleteModal.bind(this)}
                          event={event} handleSubmit={EventTile.handleDeleteClick.bind(this)} />

        <EditEventModal showModal={this.state.showEditModal} toggle={this.toggleEditModal.bind(this)}
                        event={event} handleSubmit={EventTile.handleEditClick.bind(this)} />

        <EventPasswordModal showModal={this.state.showPasswordModal}
                            toggle={this.togglePasswordModal.bind(this)}
                            event={event} />
      </div>

      // <div onMouseOver={this.handleMouseOver.bind(this)} onMouseOut={this.handleMouseOut.bind(this)}
      //      className={"col-md-2 mb-3 eventTile bg-navy"}
      //      style={hoverStyle}>
      //   <Link to={"/event/" + event.id}>
      //     <p>
      //       {event.institution}
      //     </p>
      //
      //     <p>
      //       {event.type}
      //     </p>
      //
      //     <p>
      //       {day}.{month}.{year}
      //     </p>
      //
      //     <Button outline color={"info"} className={"btn-circle-sm editEvent"}
      //             onClick={this.toggleEditModal.bind(this)}>
      //       <i className="fa fa-pencil" aria-hidden="true" />
      //     </Button>
      //
      //     <Button outline color={"info"} className={"btn-circle-sm deleteEvent"}
      //             onClick={this.toggleDeleteModal.bind(this)}>
      //       <i className="fa fa-times" aria-hidden="true" />
      //     </Button>
      //   </Link>
      // </div>
    );
  }
}

export default EventTile;


