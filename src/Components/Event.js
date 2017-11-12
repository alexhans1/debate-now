import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import '../stylesheets/Main.css';
import Room from "./Room";
import List from "./List/List";
import RoomStore from '../stores/RoomStore';
import UserStore from '../stores/UserStore';
import EventStore from '../stores/EventStore';
import * as RoomActions from '../actions/RoomActions';
import * as UserActions from '../actions/UserActions';
import * as EventActions from '../actions/EventActions';

import { Button, Modal, ModalHeader, ModalBody, Form, FormGroup, Label, Input, Col } from 'reactstrap';

class Event extends Component {

  constructor(props) {
    super(props);
    this.getRooms = this.getRooms.bind(this);
    this.getUsers = this.getUsers.bind(this);
    this.getEvent = this.getEvent.bind(this);
    this.state = {
      // initialize with sample data
      users: UserStore.getAllUsers(),
      rooms: RoomStore.getAllRooms(),
      event: EventStore.getEvent(props.match.params.id),

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
    EventStore.on('change',this.getEvent);

    RoomActions.getAllRooms(this.props.match.params.id);
    UserActions.getAllUsers(this.props.match.params.id);
    EventActions.getAllEvents();
  }

  componentWillUnmount() {
    RoomStore.removeListener('change',this.getRooms);
    UserStore.removeListener('change',this.getUsers);
    EventStore.removeListener('change',this.getEvent);
  }

  getEvent() {
    this.setState({
      event: EventStore.getEvent(this.props.match.params.id),
    });
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

  setEventStatus() {
    if (this.state.event) {
      let event = this.state.event;
      event.status = (event.status === 'OPEN') ? 'CLOSED' : 'OPEN';
      EventActions.updateEvent(event);
    }
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

    let header = <h3>Set your debates</h3>;
    let closeEventButton;
    if (this.state.event) {
      header = <h3>
        <b>
          {this.state.event.institution || "Set your debates"}
        </b> - {this.state.event.type}&nbsp;&nbsp;
        {this.state.event.date.substring(8,10)}.
        {this.state.event.date.substring(5,7)}.
        {this.state.event.date.substring(0,4)}
      </h3>;

      if (JSON.parse(localStorage.getItem('canEdit')).includes(this.state.event.id)) {
        if (this.state.event.status === 'OPEN') {
          closeEventButton = <Button outline color={"light"}
                                     onClick={this.setEventStatus.bind(this)} >
            Close Event
          </Button>
        } else {
          closeEventButton = <Button outline color={"light"}
                                     onClick={this.setEventStatus.bind(this)} >
            Reopen Event
          </Button>
        }
      }
    }

    return (
      <div className="container mb-5">

        <div id="header" className="row">
          <div className={"mt-2 ml-3"}>
            {header}
          </div>
        </div>

        <div className="row">
          <div className={"col-md-10 mb-4"}>
            <div className={"d-flex"}>
              <h4 className={"mr-auto"}>Rooms</h4>
              {closeEventButton}
              <Button color={"danger"} onClick={this.toggleModal} className={"ml-3"}>
                Add Room
              </Button>
            </div>
            <hr/>
            {
              this.state.rooms.sort((a, b) => { return b.id - a.id }).map((room) => {
                let users = this.state.users.filter((user) => {
                  return user.roomId === room.id;
                });
                return <Room key={room.id} room={room} users={users} event={this.state.event}
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
            <div className={"d-flex justify-content-between"}>
              <h4>
                Users
              </h4>
              <Button outline color={"light"}
                      onClick={ () => { UserActions.getAllUsers(this.state.event.id) }}
                      style={{paddingBottom: "-2px"}}>
                <i className="fa fa-refresh pointer" aria-hidden="true" />
              </Button>
            </div>

            <hr/>
            <List key={"userList"}
                  users={unassignedUsers} event={this.state.event}
                  createUser={UserActions.createUser.bind(this)}
                  deleteUser={UserActions.deleteUser.bind(this)} />
          </div>
        </div>

      </div>
    );
  }

}

export default DragDropContext(HTML5Backend)(Event);
