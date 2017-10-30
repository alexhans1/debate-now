import {EventEmitter} from "events";
import dispatcher from "../dispatcher";
import remove from 'lodash/remove';

class RoomStore extends EventEmitter {
  constructor() {
    super();
    this.rooms = [];
  }

  async fetchRooms (eventId) {
    try {
      await fetch('/room/byEvent/' + eventId)
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
        await fetch('/room', {
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

  updateRoom(room) {
    if (typeof room !== 'object') {
      console.error('Wrong type at updateRoom in RoomStore.');
      return
    }

    try {
      let newRoomsArray = this.rooms.slice();
      remove(newRoomsArray, {id: room.id});
      newRoomsArray.push(
        {
          location: room.location,
          format: room.format,
          language: room.language,
          id: room.id,
        }
      );
      this.rooms = newRoomsArray;
      this.emit('change');
    } catch (ex) {
      console.error(ex);
    }
  }

  async deleteRoom(id, eventId) {
    if (id) {
      try {
        await fetch('/room/' + id, {
          method: 'DELETE',
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

  // deleteRoom(id) {
  //   let newRoomsArray = this.rooms.slice();
  //   remove(newRoomsArray, {id});
  //   this.rooms = newRoomsArray;
  //   this.emit('change');
  // }

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
        this.deleteRoom(action.id, action.eventId);
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
