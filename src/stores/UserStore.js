import {EventEmitter} from "events";
import dispatcher from "../dispatcher";
import remove from 'lodash/remove';

class UserStore extends EventEmitter {
  constructor() {
    super();
    this.users = [];
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
    let newUsersArray = this.users.slice();
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
        // do nothing
      }
    }
  }
}

const userStore = new UserStore();

dispatcher.register(userStore.handleAction.bind(userStore));

export default userStore;
