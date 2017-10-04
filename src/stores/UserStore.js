import {EventEmitter} from "events";
import dispatcher from "../dispatcher";
import remove from 'lodash/remove';

class UserStore extends EventEmitter {
  constructor() {
    super();
    this.users = [
      {
        id: 1,
        name: 'Hans',
        vorname: 'Alexander',
        role: 'speaker',
        format: 'bps',
        language: 'de',
      },
      {
        id: 2,
        name: 'Maham',
        vorname: 'Pegah',
        role: 'judge',
        format: 'opd',
        language: 'en',
      },
      {
        id: 3,
        name: 'Sommerfeld',
        vorname: 'Georg',
        role: 'speaker',
        format: 'bps',
        language: 'de',
      },
      {
        id: 4,
        name: 'Münch',
        vorname: 'Tobias',
        role: 'speaker',
        format: 'opd',
        language: 'de',
      },
      {
        id: 5,
        name: 'Tarbuk',
        vorname: 'Lara',
        role: 'speaker',
        format: 'opd',
        language: 'de',
      },
      {
        id: 6,
        name: 'Niederschuh',
        vorname: 'Katrin',
        role: 'judge',
        format: 'bps',
        language: 'de',
      },
      {
        id: 7,
        name: 'Dexel',
        vorname: 'Christina',
        role: 'judge',
        format: 'bps',
        language: 'en',
      },
    ]
  }

  createUser(last_name, first_name, role, format, language) {
    console.log(last_name, first_name, role, format, language);
    const id = Date.now();
    let newUsersArray = this.users.slice();
    newUsersArray.push(
      {
        last_name,
        first_name,
        role,
        format,
        language,
        id,
      }
    );
    this.users = newUsersArray;
    this.emit('change');
  }

  deleteUser(id) {
    let newUsersArray = this.state.users.slice();
    remove(newUsersArray, {id});
    this.users = newUsersArray;
    this.emit('change');
  }

  getAllUsers() {
    return this.users;
  }

  handleAction(action) {
    switch (action.type){
      case "CREATE_USER": {
        this.createUser(action.first_name, action.last_name, action.role, action.format, action.language);
        break;
      }
      case "DELETE_USER": {
        this.deleteUser(action.id);
        break;
      }
    }
  }
}

const userStore = new UserStore();

dispatcher.register(userStore.handleAction.bind(userStore));

export default userStore;
