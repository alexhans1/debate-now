import {EventEmitter} from "events";
import dispatcher from "../dispatcher";
import remove from 'lodash/remove';

class UserStore extends EventEmitter {
  constructor() {
    super();
    this.users = [];

    this.baseURL = (process.env.NODE_ENV === 'production') ? 'https://debate-now-api.herokuapp.com/'
      : 'http://localhost:3030/';
  }

  async fetchUsers (eventId) {
    try {
      await fetch(this.baseURL + 'user/byEvent/' + eventId)
      .then(res => res.json())
      .then(users => {
        this.users = users;
        this.emit('change');
      });
    } catch (ex) {
      console.error(ex);
    }
  }

  async createUser(name, role, format, language, teamPartner, eventId) {
    if (typeof format !== 'string' || typeof language !== 'string') {
      console.error('Wrong type at createRoom in RoomStore.');
      return
    }

    if (eventId) {
      try {
        await fetch(this.baseURL + 'user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            role,
            format,
            language,
            teamPartner,
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

  async updateUser(user) {
    if (typeof user !== 'object') {
      console.error('Wrong type at updateRoom in UserStore.');
      return
    }

    try {
      await fetch(this.baseURL + 'user/' + user.id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user.name,
          role: user.role,
          format: user.format,
          language: user.language,
          position: user.position,
          roomId: user.roomId,
        })
      }).then((response) => {
        if (response.ok) {
          let newUserArray = this.users.slice();
          remove(newUserArray, {id: user.id});
          newUserArray.push(
            {
              name: user.name,
              role: user.role,
              format: user.format,
              language: user.language,
              position: user.position,
              roomId: user.roomId,
              id: user.id,
              eventId: user.eventId,
            }
          );
          this.users = newUserArray;
          this.emit('change');
        }
      });
    } catch (ex) {
      console.error(ex);
    }
  }

  async deleteUser(id) {
    if (id) {
      try {
        await fetch(this.baseURL + 'user/' + id, {
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
        this.createUser(action.name, action.role, action.format, action.language, action.teamPartner, action.eventId);
        break;
      }
      case "DELETE_USER": {
        this.deleteUser(action.id);
        break;
      }
      case "UPDATE_USER": {
        this.updateUser(action.user);
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
