import {EventEmitter} from "events";
import dispatcher from "../dispatcher";

class EventStore extends EventEmitter {
  constructor() {
    super();
    this.events = [];
  }

  async fetchEvents () {
    try {
      await fetch('event')
      .then(res => res.json())
      .then(events => {
        window.events = events;
        console.log(events);
        this.events = events;
        this.emit('change');
      });
    } catch (ex) {
      console.error(ex);
    }
  }

  getAllEvents () {
    return this.events;
  }

  handleAction(action) {
    switch (action.type){
      case "GET_EVENTS": {
        this.fetchEvents();
        break;
      }
      default: {
        // do nothing
      }
    }
  }
}

const eventStore = new EventStore();

dispatcher.register(eventStore.handleAction.bind(eventStore));

export default eventStore;
