import {EventEmitter} from "events";
import dispatcher from "../dispatcher";
import remove from 'lodash/remove';

class RoomStore extends EventEmitter {
  constructor() {
    super();
    this.rooms = []
  }

  createRoom(location, format, language) {
    if (typeof format !== 'string') {
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
      case "CREATE_ROOM": {
        this.createRoom(action.location, action.format, action.language);
        break;
      }
      case "DELETE_ROOM": {
        this.deleteRoom(action.id);
        break;
      }
      default: {
        console.log('No corresponding action found for requested room action:', action);
      }
    }
  }
}

const roomStore = new RoomStore();
dispatcher.register(roomStore.handleAction.bind(roomStore));

export default roomStore;
