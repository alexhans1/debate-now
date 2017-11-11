import {EventEmitter} from "events";
import dispatcher from "../dispatcher";

class EventStore extends EventEmitter {
  constructor() {
    super();
    this.events = [];

    this.baseURL = (process.env.NODE_ENV === 'production') ? 'https://debate-now-api.herokuapp.com/'
      : 'http://localhost:3030/';
  }

  async fetchEvents () {
    try {
      await fetch(this.baseURL + 'event')
      .then(res => res.json())
      .then(events => {
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

  getEvent (id) {
    let event = this.events.find((event) => {
      return event.id === parseInt(id, 10);
    });
    return event || null;
  }

  async createEvent(institution, type, date, password, image) {
    if (institution && type && password) {
      try {
        await fetch(this.baseURL + 'event', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            institution,
            type,
            date,
            password,
            image,
          })
        }).then((response) => {
          if (response.ok) {
            this.fetchEvents();
            response.json().then((newEvent) => {
              let canEditIds = JSON.parse(localStorage.getItem('canEdit'));
              canEditIds.push(newEvent.id);
              localStorage.setItem('canEdit', JSON.stringify(canEditIds));
            });
          }
        });
      } catch (ex) {
          console.error(ex);
      }
    }
  }

  async updateEvent(event) {
    if (event) {
      try {
        await fetch(this.baseURL + 'event/' + event.id, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            institution: event.institution,
            type: event.type,
            status: event.status,
            date: event.date,
            password: event.password,
            image: event.image,
          }),
        }).then((response) => {
          if (response.ok) {
            this.fetchEvents();
          }
        });
      } catch (ex) {
          console.error(ex);
      }
    }
  }

  async deleteEvent(id) {
    if (id) {
      try {
        await fetch(this.baseURL + 'event/' + id, {
          method: 'DELETE',
        }).then((response) => {
          if (response.ok) {
            this.fetchEvents();
          }
        });
      } catch (ex) {
          console.error(ex);
      }
    }
  }

  handleAction(action) {
    switch (action.type){
      case "GET_EVENTS": {
        this.fetchEvents();
        break;
      }
      case "CREATE_EVENT": {
        this.createEvent(action.institution, action.eventType, action.date, action.password, action.image);
        break;
      }
      case "UPDATE_EVENT": {
        this.updateEvent(action.event);
        break;
      }
      case "DELETE_EVENT": {
        this.deleteEvent(action.id);
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
