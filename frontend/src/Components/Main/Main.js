import React, { Component } from 'react';
import '../../stylesheets/Main.css';
import EventTile from "./EventTile";
import NewEventModal from "./NewEventModal";
import EventStore from '../../stores/EventStore';
import * as EventActions from '../../actions/EventActions';

import {Button} from 'reactstrap';

class Main extends Component {

  constructor() {
    super();
    this.getEvents = this.getEvents.bind(this);
    Main.createEvent = Main.createEvent.bind(this);
    this.handleAddEventSubmit = this.handleAddEventSubmit.bind(this);
    this.state = {
      // get all Events
      events: [],
      newEvent: this.newEventDefaults,
      showModal: false,
    };
  }

  newEventDefaults = {
    institution: '',
    type: '',
    date: (new Date()).toISOString().substring(0,10),
    password: '',
  };

  componentWillMount() {
    EventStore.on('change', this.getEvents);
    EventActions.getAllEvents();
  }

  componentWillUnmount() {
    EventStore.removeListener('change', this.getEvents);
  }

  getEvents() {
    this.setState({
      events: EventStore.getAllEvents(),
    });
  }

  static createEvent (institution, type, date, password) {
    EventActions.createEvent(institution, type, date, password);
  }

  handleChangeFor = (propertyName) => (e) => {
    const { newEvent } = this.state;
    const eventToAdd = {
      ...newEvent,
      [propertyName]: e.target.value
    };
    this.setState({ newEvent: eventToAdd, });
  };

  handleAddEventSubmit() {
    if (this.state.newEvent.institution && this.state.newEvent.type) {
      Main.createEvent(this.state.newEvent.institution,
        this.state.newEvent.type,
        this.state.newEvent.date,
        this.state.newEvent.password);
      this.setState({
        newEvent: this.newEventDefaults,
        showModal: false,
      });
    }
  };

  toggleModal() {
    this.setState({
      showModal: !this.state.showModal,
    });
  }

  render() {
    let openEvents = this.state.events.filter((event) => {
      return event.status === 'OPEN';
    }).sort((a, b) => {
      if (b.createdAt > a.createdAt) {
        return 1;
      }
      if (b.createdAt < a.createdAt) {
        return -1;
      }
      return 0;
    });

    let closedEvents = this.state.events.filter((event) => {
      return event.status === 'CLOSED';
    }).sort((a, b) => {
      if (a.createdAt > b.createdAt) {
        return 1;
      }
      if (a.createdAt < b.createdAt) {
        return -1;
      }
      return 0;
    });

    return (
      <div className="container mb-3">

        <div id="header" className="row mb-2">
          <div className={"col-md-6 mt-2"}>
            <h2>Current Events</h2>
          </div>
          <div className={'col-md-6 mt-2 d-flex justify-content-end'}>
            <Button size={"lg"} color={"danger"} onClick={this.toggleModal.bind(this)}>
              <i className="fa fa-plus-circle" aria-hidden="true" /> Add Event
            </Button>
          </div>
        </div>

        <div className="row">
          <div className={"col-md-12 mb-4"}>
            <h4>Open</h4>
            <hr/>
            <div className={"row"}>
              {
                openEvents.map((event) => {
                  return <EventTile key={event.id} event={event} />
                })
              }
            </div>
          </div>
        </div>

        <div className="row">
          <div className={"col-md-12 mb-4"}>
            <h4>Closed</h4>
            <hr/>
            <div className={"row"}>
              {
                closedEvents.map((event) => {
                  return <EventTile key={event.id} event={event} />
                })
              }
            </div>
          </div>
        </div>

        <NewEventModal showModal={this.state.showModal} toggle={this.toggleModal.bind(this)}
                      handleChange={this.handleChangeFor} newEvent={this.state.newEvent}
                      handleSubmit={this.handleAddEventSubmit} />
      </div>
    );
  }

}

export default Main;
