import {EventEmitter} from "events";
import dispatcher from "../dispatcher";
import {makeid} from '../customUtils'
import remove from 'lodash/remove';

class RoomStore extends EventEmitter {
  constructor() {
    super();
    this.rooms = [
      {
        location: '1.601',
        format: 'bps',
        language: 'en',
        id: makeid(10),
      },
      {
        location: '1.604',
        format: 'opd',
        language: 'de',
        id: makeid(10),
      },
    ]
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
    console.log('RoomStore received an action.', action);
    switch (action.type){
      case "CREATE_ROOM": {
        this.createRoom(action.location, action.format, action.language);
        break;
      }
      case "DELETE_ROOM": {
        this.deleteRoom(action.id);
        break;
      }
    }
  }
}

const roomStore = new RoomStore();
dispatcher.register(roomStore.handleAction.bind(roomStore));

export default roomStore;
