import React, { Component } from 'react';
import '../../stylesheets/App.css';
import EventTile from "./EventTile";
import EventStore from '../../stores/EventStore';
import * as EventActions from '../../actions/EventActions';

class Main extends Component {

  constructor() {
    super();
    this.getEvents = this.getEvents.bind(this);
    this.state = {
      // get all Events
      events: [],
    };
  }

  componentWillMount() {
    EventStore.on('change', this.getEvents);
    EventActions.getAllEvents();
  }

  componentWillUnmount() {
    EventStore.removeListener('change', this.getEvents);
  }

  getEvents() {
    let eventPromise = EventStore.getAllEvents();
    eventPromise.then((events) => {
      this.setState({
        events,
      });
    })

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

        <div id="header" className="row">
          <div className={"mt-2 ml-3"}>
            <h2>Current Events</h2>
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

      </div>
    );
  }

}

export default Main;
