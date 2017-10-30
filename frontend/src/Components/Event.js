import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import '../stylesheets/Main.css';
import Room from "./Room";
import List from "./List/List";
import RoomStore from '../stores/RoomStore';
import UserStore from '../stores/UserStore';
import * as RoomActions from '../actions/RoomActions';
import * as UserActions from '../actions/UserActions';

import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Col } from 'reactstrap';

class Event extends Component {

  constructor() {
    super();
    this.getRooms = this.getRooms.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.state = {
      // initialize with sample data
      users: UserStore.getAllUsers(),
      rooms: RoomStore.getAllRooms(),

      newRoom: {
        roomName: '',
        roomFormat: 'bps',
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
    RoomActions.createRoom(
      this.state.newRoom.roomName,
      this.state.newRoom.roomFormat,
      this.state.newRoom.roomLanguage,
      this.props.match.params.id
    );
    this.setState({
      newRoom: {
        roomName: '',
        roomFormat: 'bps',
        roomLanguage: 'de',
      },
      showModal: false,
    });
  };

  componentWillMount() {
    RoomStore.on('change',this.getRooms);
    UserStore.on('change',this.getUsers);

    RoomActions.getAllRooms(this.props.match.params.id);
    UserActions.getAllUsers(this.props.match.params.id);
  }

  componentWillUnmount() {
    RoomStore.removeListener('change',this.getRooms);
    UserStore.removeListener('change',this.getUsers);
  }

  getRooms() {
    this.setState({
      rooms: RoomStore.getAllRooms(),
    });
  }

  getUsers() {
    this.setState({
      users: UserStore.getAllUsers(),
    });
  }

  render() {

    let addRoomNotice = null;
    if (!this.state.rooms.length) {
      addRoomNotice = <a onClick={this.toggleModal} className={"text-danger font-weight-bold ml-2 pointer"}
                         style={{fontSize: 17}}>Add room</a>
    }

    let unassignedUsers = this.state.users.filter((user) => {
      return user.position === null;
    });

    return (
      <div className="container mb-5">

        <div id="header" className="row">
          <div className={"mt-2 ml-3"}>
            <h2>Set your debates</h2>
          </div>
        </div>

        <div className="row">
          <div className={"col-md-10 mb-4"}>
            <h4>Rooms</h4>
            <hr/>
            {
              this.state.rooms.sort((a, b) => { return b.id - a.id }).map((room) => {
                let users = this.state.users.filter((user) => {
                  return user.roomId === room.id;
                });
                return <Room key={room.id} room={room} users={users} eventId={this.props.match.params.id}
                             deleteRoom={RoomActions.deleteRoom.bind(this)}
                             updateRoom={RoomActions.updateRoom.bind(this)}
                             deleteUser={UserActions.deleteUser.bind(this)} />;
              })
            }
            <div id="addNewRoom" className={"mt-3"}>
              <Button color="danger" onClick={this.toggleModal} className={"btn-circle btn-xl"}>
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
                               value={this.state.newRoom.roomFormat} className={"uppercase"}
                               name="room format" id="roomFormat">
                          <option className={"uppercase"}>bps</option>
                          <option className={"uppercase"}>opd</option>
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
            <h4>
              Users
              <i onClick={UserActions.refreshUsers.bind(this)} className="fa fa-refresh pull-right" aria-hidden="true" />
            </h4>

            <hr/>
            <List key={"userList"}
                  users={unassignedUsers}
                  createUser={UserActions.createUser.bind(this)}
                  deleteUser={UserActions.deleteUser.bind(this)} />
          </div>
        </div>

      </div>
    );
  }

}

export default DragDropContext(HTML5Backend)(Event);
