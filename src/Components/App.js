import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import '../stylesheets/App.css';
import Room from "./Room";
import List from "./List";
import RoomStore from '../stores/RoomStore'
import UserStore from '../stores/UserStore'
import * as RoomActions from '../actions/RoomActions'

class App extends Component {

  constructor() {
    super();
    this.state = {
      // initialize with sample data
      users: UserStore.getAllUsers(),
      rooms: RoomStore.getAllRooms(),
    }

  }

  componentWillMount() {
    window.roomStore = RoomStore;
    RoomStore.on('change', () => {
      this.setState({
        rooms: RoomStore.getAllRooms(),
      });
    });

    window.userStore = UserStore;
    UserStore.on('change', () => {
      console.log(234567);
      this.setState({
        users: UserStore.getAllUsers(),
      });
    });
  }

  render() {

    return (
      <div className="container mb-5">

        <div id="header" className="row">
          <div className={"mt-3"}>
            <h2>Clubabend</h2>
          </div>
        </div>

        <div className="row">
          <div className={"col-md-10"}>
            {
              this.state.rooms.map((room) => {
                return <Room key={makeid(5)} room={room} deleteRoom={RoomActions.deleteRoom.bind(this)} />;
              })
            }
            <div id="addNewRoom" className={"mt-3"}>
              <button className="btn btn-outline-danger btn-xl btn-circle"
                      data-toggle="dropdown">
                <i className="fa fa-plus" aria-hidden="true"/>
              </button>
              <ul className={"dropdown-menu"}>
                <li><a className={"dropdown-item"} onClick={() => RoomActions.createRoom('1.605', 'bps')}>
                  Add BPS Room
                </a></li>
                <li><a className={"dropdown-item"} onClick={() => RoomActions.createRoom('1.605', 'opd')}>
                  Add OPD Room
                </a></li>
              </ul>
            </div>
          </div>

          <div className={"col-md-2"}>
            <List key={makeid(5)} users={this.state.users} />
          </div>
        </div>

      </div>
    );
  }

}

let makeid = (n) => {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < n; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};


export default DragDropContext(HTML5Backend)(App);
