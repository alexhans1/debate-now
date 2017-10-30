import {EventEmitter} from "events";
import dispatcher from "../dispatcher";
import remove from 'lodash/remove';

class RoomStore extends EventEmitter {
  constructor() {
    super();
    this.rooms = [
      // {
      //   id: 1,
      //   location: 123,
      //   format: 'bps',
      //   language: 'de',
      // }
    ]
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

  createRoom(location, format, language) {
    if (typeof format !== 'string' || typeof language !== 'string') {
      console.error('Wrong type at createRoom in RoomStore.');
      return
    }

    const id = Date.now();
    let newRoomsArray = this.rooms.slice();
    newRoomsArray.push(
      {
        location,
        format,
        language,
        id,
      }
    );
    this.rooms = newRoomsArray;
    this.emit('change');
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

  deleteRoom(id) {
    let newRoomsArray = this.rooms.slice();
    remove(newRoomsArray, {id});
    this.rooms = newRoomsArray;
    this.emit('change');
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
        this.createRoom(action.location, action.format, action.language);
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
