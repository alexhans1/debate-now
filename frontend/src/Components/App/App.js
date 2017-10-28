import React, { Component } from 'react';
import '../../stylesheets/App.css';
import EventTile from "./EventTile";
import EventStore from '../../stores/EventStore'
import * as EventActions from '../../actions/EventActions'

class App extends Component {

  constructor() {
    super();
    this.state = {
      // get all Events
      events: [],
    };

    EventActions.getAllEvents();
  }

  componentWillMount() {
    EventStore.on('change', () => {
      this.setState({
        events: EventStore.getAllEvents(),
      });
    });
  }

  render() {
    let openEvents = this.state.events.filter((event) => {
      return event.status === 'OPEN';
    }).sort((a, b) => {
      if (a.createdAt > b.createdAt) {
        return 1;
      }
      if (a.createdAt < b.createdAt) {
        return -1;
      }
      // a muss gleich b sein
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
      // a muss gleich b sein
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
                  return <div className={"col-md-2 eventTile border--olive pointer"}>
                    <EventTile key={event.id} event={event} />
                  </div>
                })
              }
            </div>
          </div>
        </div>

        <div className="row">
          <div className={"col-md-12 mb-4"}>
            <h4>Close</h4>
            <hr/>
            <div className={"row"}>
              {
                closedEvents.map((event) => {
                  return <div className={"col eventTile border--olive bg-navy"}>
                    <EventTile key={event.id} event={event} />
                  </div>
                })
              }
            </div>
          </div>
        </div>

      </div>
    );
  }

}

export default App;
