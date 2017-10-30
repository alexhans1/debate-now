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

  deleteUser(id) {
    let newUsersArray = this.users.slice();
    remove(newUsersArray, {id});
    this.users = newUsersArray;
    this.emit('change');
  }

  async refreshUsers() {
    let newUsersArray = this.users.slice();
    try {
      await fetch('app/user')
      .then(res => res.json())
      .then(users => {
        window.users = users;
        console.log(users);
        users.forEach((user) => {
          if (users.find((existingUser) => {
            return existingUser.id === user.id
          })) {
            newUsersArray.push({
              id: user.id,
              name: user.vorname,
              role: (Math.random() > 0.5) ? 'speaker' : 'judge',
              format: (Math.random() > 0.5) ? 'opd' : 'bps',
              language: (Math.random() > 0.5) ? 'de' : 'en',
            })
          }
        })
      });
    } catch (ex) {
        console.error(ex);
    }

    console.log(newUsersArray);
    this.users = newUsersArray;
    this.emit('change');
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
      case "REFRESH_USERS": {
        this.refreshUsers();
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
