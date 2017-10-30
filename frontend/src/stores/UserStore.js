import {EventEmitter} from "events";
import dispatcher from "../dispatcher";
import remove from 'lodash/remove';

class UserStore extends EventEmitter {
  constructor() {
    super();
    this.users = [];
  }

  async fetchUsers (eventId) {
    try {
      await fetch('/user/byEvent/' + eventId)
      .then(res => res.json())
      .then(users => {
        this.users = users;
        this.emit('change');
      });
    } catch (ex) {
      console.error(ex);
    }
  }

  async createUser(name, role, format, language, eventId) {
    if (typeof format !== 'string' || typeof language !== 'string') {
      console.error('Wrong type at createRoom in RoomStore.');
      return
    }

    if (eventId) {
      try {
        await fetch('/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            role,
            format,
            language,
            eventId,
          })
        }).then((response) => {
          if (response.ok) {
            this.fetchUsers(eventId);
          }
        });
      } catch (ex) {
        console.error(ex);
      }
    }
  }

  async deleteUser(id) {
    if (id) {
      try {
        await fetch('/user/' + id, {
          method: 'DELETE',
        }).then((response) => {
          if (response.ok) {
            let newUsersArray = this.users.slice();
            remove(newUsersArray, {id});
            this.users = newUsersArray;
            this.emit('change');
          }
        });
      } catch (ex) {
        console.error(ex);
      }
    }
  }

  getAllUsers() {
    return this.users;
  }

  handleAction(action) {
    switch (action.type){
      case "GET_USERS": {
        this.fetchUsers(action.eventId);
        break;
      }
      case "CREATE_USER": {
        this.createUser(action.name, action.role, action.format, action.language, action.eventId);
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
