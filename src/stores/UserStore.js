import {EventEmitter} from "events";
import dispatcher from "../dispatcher";
import remove from 'lodash/remove';

class UserStore extends EventEmitter {
  constructor() {
    super();
    this.users = [
      {
        id: 1,
        name: 'Alexander',
        role: 'speaker',
        format: 'bps',
        language: 'de',
      },
      {
        id: 2,
        name: 'Pegah',
        role: 'judge',
        format: 'opd',
        language: 'en',
      },
      {
        id: 3,
        name: 'Georg',
        role: 'speaker',
        format: 'bps',
        language: 'de',
      },
      {
        id: 4,
        name: 'Tobias',
        role: '',
        format: '',
        language: 'de',
      },
      {
        id: 5,
        name: 'Lara',
        role: 'speaker',
        format: 'opd',
        language: 'de',
      },
      {
        id: 6,
        name: 'Katrin',
        role: 'judge',
        format: 'bps',
        language: 'de',
      },
      {
        id: 7,
        name: 'Christina',
        role: 'judge',
        format: 'bps',
        language: 'en',
      },
    ]
  }

  createUser(name, role, format, language) {
    if (name !== '' && name !== null) {
      const id = Date.now();
      let newUsersArray = this.users.slice();
      newUsersArray.push(
        {
          id,
          name,
          role,
          format,
          language,
        }
      );
      this.users = newUsersArray;
      this.emit('change');
    }
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
        this.createUser(action.name, action.role, action.format, action.language);
        break;
      }
      case "DELETE_USER": {
        this.deleteUser(action.id);
        break;
      }
      default: {
        console.log('No corresponding action found for requested user action:', action);
      }
    }
  }
}

const userStore = new UserStore();

dispatcher.register(userStore.handleAction.bind(userStore));

export default userStore;
