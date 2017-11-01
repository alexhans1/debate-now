import {EventEmitter} from "events";
import dispatcher from "../dispatcher";
import remove from 'lodash/remove';

class RoomStore extends EventEmitter {
  constructor() {
    super();
    this.rooms = [];

    this.baseURL = (process.env.NODE_ENV === 'production') ? 'https://debate-now-api.herokuapp.com/'
      : 'http://localhost:3030/';
  }

  async fetchRooms (eventId) {
    try {
      await fetch(this.baseURL + 'room/byEvent/' + eventId)
      .then(res => res.json())
      .then(rooms => {
        this.rooms = rooms;
        this.emit('change');
      });
    } catch (ex) {
      console.error(ex);
    }
  }

  async createRoom(location, format, language, eventId) {
    if (typeof format !== 'string' || typeof language !== 'string') {
      console.error('Wrong type at createRoom in RoomStore.');
      return
    }

    if (eventId) {
      try {
        await fetch(this.baseURL + 'room', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            location,
            format,
            language,
            eventId,
          })
        }).then((response) => {
          if (response.ok) {
            this.fetchRooms(eventId);
          }
        });
      } catch (ex) {
        console.error(ex);
      }
    }
  }

  async updateRoom(room) {
    if (typeof room !== 'object') {
      console.error('Wrong type at updateRoom in RoomStore.');
      return
    }

    try {
      await fetch(this.baseURL + 'room/' + room.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: room.location,
          format: room.format,
          language: room.language,
        })
      }).then((response) => {
        if (response.ok) {
          let newRoomsArray = this.rooms.slice();
          remove(newRoomsArray, {id: room.id});
          newRoomsArray.push(
            {
              location: room.location,
              format: room.format,
              language: room.language,
              id: room.id,
              eventId: room.eventId,
            }
          );
          this.rooms = newRoomsArray;
          this.emit('change');
        }
      });
    } catch (ex) {
      console.error(ex);
    }
  }

  async deleteRoom(id) {
    if (id) {
      try {
        await fetch(this.baseURL + 'room/' + id, {
          method: 'DELETE',
        }).then((response) => {
          if (response.ok) {
            let newRoomsArray = this.rooms.slice();
            remove(newRoomsArray, {id});
            this.rooms = newRoomsArray;
            this.emit('change');
          }
        });
      } catch (ex) {
        console.error(ex);
      }
    }
  }

  getAllRooms() {
    return this.rooms;
  }

  handleAction(action) {
    switch (action.type){
      case "GET_ROOMS": {
        this.fetchRooms(action.eventId);
        break;
      }
      case "CREATE_ROOM": {
        this.createRoom(action.location, action.format, action.language, action.eventId);
        break;
      }
      case "DELETE_ROOM": {
        this.deleteRoom(action.id);
        break;
      }
      case "UPDATE_ROOM": {
        this.updateRoom(action.room);
        break;
      }
      default: {
        // do nothing
      }
    }
  }
}

const roomStore = new RoomStore();
dispatcher.register(roomStore.handleAction.bind(roomStore));

export default roomStore;
