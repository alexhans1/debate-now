import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import '../stylesheets/App.css';
import Room from "./Room";
import List from "./List/List";
import RoomStore from '../stores/RoomStore'
import UserStore from '../stores/UserStore'
import * as RoomActions from '../actions/RoomActions'
import * as UserActions from '../actions/UserActions'

import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Col } from 'reactstrap';

class App extends Component {

  constructor() {
    super();
    this.state = {
      // initialize with sample data
      users: UserStore.getAllUsers(),
      rooms: RoomStore.getAllRooms(),

      newRoom: {
        roomName: '',
        roomFormat: 'BPS',
        roomLanguage: 'de',

      },
      showModal: false,
    };

    this.toggleModal = this.toggleModal.bind(this);

  }

  toggleModal() {
    this.setState({
      showModal: !this.state.showModal,
    });
  }

  handleChangeFor = (propertyName) => (event) => {
    const { newRoom } = this.state;
    const roomToAdd = {
      ...newRoom,
      [propertyName]: event.target.value
    };
    this.setState({ newRoom: roomToAdd, });
  };

  handleAddRoomSubmit(e) {
    e.preventDefault();
    RoomActions.createRoom(this.state.newRoom.roomName, this.state.newRoom.roomFormat, this.state.newRoom.roomLanguage);
    this.setState({
      newRoom: {
        roomName: '',
        roomFormat: 'BPS',
        roomLanguage: 'de',
      },
      showModal: false,
    });
  };

  componentWillMount() {
    RoomStore.on('change', () => {
      this.setState({
        rooms: RoomStore.getAllRooms(),
      });
    });

    UserStore.on('change', () => {
      this.setState({
        users: UserStore.getAllUsers(),
      });
    });
  }

  render() {

    let addRoomNotice = null;
    if (!this.state.rooms.length) {
      addRoomNotice = <a onClick={this.toggleModal} className={"text-danger font-weight-bold ml-2 pointer"}
                         style={{fontSize: 17}}>Add room</a>
    }

    return (
      <div className="container mb-3">

        <div id="header" className="row">
          <div className={"mt-2 ml-3"}>
            <h2>Set your debates</h2>
          </div>
        </div>

        <div className="row">
          <div className={"col-md-10 mb-4"}>
            {
              this.state.rooms.map((room) => {
                return <Room key={room.id} room={room}
                             deleteRoom={RoomActions.deleteRoom.bind(this)}
                             deleteUser={UserActions.deleteUser.bind(this)} />;
              })
            }
            <div id="addNewRoom" className={"mt-3"}>
              <Button outline color="danger" onClick={this.toggleModal} className={"btn-circle btn-xl"}>
                <i className="fa fa-plus" aria-hidden="true"/>
              </Button>
              {addRoomNotice}

              <Modal isOpen={this.state.showModal} toggle={this.toggleModal}>
                <ModalHeader toggle={this.toggleModal} className={"black"}>Add new room</ModalHeader>
                <ModalBody className={"black"}>
                  <Form onSubmit={this.handleAddRoomSubmit.bind(this)}>
                    <FormGroup row>
                      <Label for="roomName" sm={4}>Name / Location</Label>
                      <Col sm={8}>
                        <Input type="text" onChange={this.handleChangeFor('roomName')}
                               value={this.state.newRoom.roomName}
                               name="room name" id="roomName" placeholder="Room name / location" required />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="roomFormat" sm={4}>Format</Label>
                      <Col sm={8}>
                        <Input type="select" onChange={this.handleChangeFor('roomFormat')}
                               value={this.state.newRoom.roomFormat}
                               name="room format" id="roomFormat">
                          <option>BPS</option>
                          <option>OPD</option>
                        </Input>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label for="roomLanguage" sm={4}>Language</Label>
                      <Col sm={8}>
                        <Input type="select" onChange={this.handleChangeFor('roomLanguage')}
                               value={this.state.newRoom.roomLanguage}
                               name="room language" id="roomLanguage">
                          <option>de</option>
                          <option>en</option>
                        </Input>
                      </Col>
                    </FormGroup>
                    <Button color={"info"} className={"pull-right"}>Submit</Button>
                  </Form>
                </ModalBody>
              </Modal>
            </div>
          </div>

          <div className={"col-md-2"}>
            <List key={"userList"}
                  users={this.state.users}
                  createUser={UserActions.createUser.bind(this)}
                  deleteUser={UserActions.deleteUser.bind(this)} />
          </div>
        </div>

      </div>
    );
  }

}

export default DragDropContext(HTML5Backend)(App);
