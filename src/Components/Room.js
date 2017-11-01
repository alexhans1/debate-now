import React, { Component } from 'react';
import Team from './Team';
import '../stylesheets/Room.css';
import '../stylesheets/btn-circle.css';

import { Button, Form, FormGroup, Input } from 'reactstrap';

class Room extends Component {

  constructor(props) {
    super();
    this.state = {
      containers: [],
      editLocation: false,
      editFormat: false,
      editLanguage: false,
      editableRoom: props.room,
    };
  }

  checkRoom(includeJudges = true) {
    let isEmpty = true;
    let BreakException = {};
    try {
      this.state.containers.forEach((container) => {
        // exclude judges on demand
        if (container.props.id.indexOf('judge') > 0 && !includeJudges) {
          return
        }
        if (container.decoratedComponentInstance && container.decoratedComponentInstance.state.cards.length) {
          isEmpty = false;
          throw BreakException
        }
      });
    } catch (ex) {
      if(ex !== BreakException) console.error(ex);
    }
    return isEmpty;
  }

  deleteRoom (id) {
    // check if there are users in this room
    if (this.checkRoom()) this.props.deleteRoom(id);
    else alert('You can´t delete a room if there are people in there.. it´s dangerous!');
  }

  addContainer(team) {
    if (team !== null) {
      this.state.containers.push(team);
    }
  }

  toggleEdit = (propertyName) => () => {
    this.setState({ [propertyName]: !this.state[propertyName], });

    // add event listener for Escape event
    document.addEventListener("keydown", this.handleKeyPress);
  };

  handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      document.removeEventListener("keydown", this.handleKeyPress);
      this.setState({
        editLocation: false,
        editFormat: false,
        editLanguage: false,
      });
    }
  };

  handleChangeFor = (propertyName, shouldSubmit = false, submitProperty = null) => (event) => {
    if (propertyName === 'format' && !this.checkRoom(false)) {
      alert('You can´t change the format if speakers are already assigned.');
      return;
    }

    const editableRoom = {
      ...this.state.editableRoom,
      [propertyName]: event.target.value
    };
    this.setState(
      {
        editableRoom
      },
      (shouldSubmit) ? this.handleEditSubmit(submitProperty, editableRoom)(event) : () => {}
    )
  };

  handleEditSubmit = (propertyName, givenRoom = null) => (e) => {
    e.preventDefault();

    let editableRoom = (givenRoom) ? givenRoom : this.state.editableRoom;

    if (!Object.is(editableRoom, this.props.room)) {
      this.props.updateRoom(editableRoom);
    }
    this.setState({
      [propertyName]: false,
    });
  };

  static moveCaretAtEnd(e) {
    let temp_value = e.target.value;
    e.target.value = '';
    e.target.value = temp_value;
  }

  render() {
    const { room, users } = this.props;

    let teams = null;
    if (room.format.toLowerCase() === 'bps') {
      teams = <div>
        <div className="row teams">
          <Team id={room.id + '_og'} position={"og"}
                deleteUser={this.props.deleteUser.bind(this)}
                ref={(team) => { this.addContainer(team) }}
                event={this.props.event}
                users={users.filter((user) => { return user.position === 'og'; })} />
          <Team id={room.id + '_oo'} position={"oo"}
                deleteUser={this.props.deleteUser.bind(this)}
                ref={(team) => { this.addContainer(team) }}
                event={this.props.event}
                users={users.filter((user) => { return user.position === 'oo'; })} />
        </div>
        <div className="row teams">
          <Team id={room.id + '_cg'} position={"cg"}
                deleteUser={this.props.deleteUser.bind(this)}
                ref={(team) => { this.addContainer(team) }}
                event={this.props.event}
                users={users.filter((user) => { return user.position === 'cg'; })} />
          <Team id={room.id + '_co'} position={"co"}
                deleteUser={this.props.deleteUser.bind(this)}
                ref={(team) => { this.addContainer(team) }}
                event={this.props.event}
                users={users.filter((user) => { return user.position === 'co'; })} />
        </div>
      </div>;

    } else if (room.format.toLowerCase() === 'opd') {
      teams = <div>
        <div className="row teams">
          <Team id={room.id + '_reg'} position={"reg"}
                deleteUser={this.props.deleteUser.bind(this)}
                ref={(team) => { this.addContainer(team) }}
                event={this.props.event}
                users={users.filter((user) => { return user.position === 'reg'; })} />
          <Team id={room.id + '_opp'} position={"opp"}
                deleteUser={this.props.deleteUser.bind(this)}
                ref={(team) => { this.addContainer(team) }}
                event={this.props.event}
                users={users.filter((user) => { return user.position === 'opp'; })} />
        </div>
        <div className="row teams mt-1">
          <Team id={room.id + '_ffr'} position={"ffr"}
                deleteUser={this.props.deleteUser.bind(this)}
                ref={(team) => { this.addContainer(team) }}
                event={this.props.event}
                users={users.filter((user) => { return user.position === 'ffr'; })} />
        </div>

      </div>;
    }

    let location, format, language = null;
    if (this.state.editLocation) {
      location = <Form onSubmit={this.handleEditSubmit('editLocation').bind(this)}>
        <FormGroup>
          <Input type="text" autoFocus onFocus={Room.moveCaretAtEnd} size={"sm"}
                 onChange={this.handleChangeFor('location').bind(this)}
                 value={this.state.editableRoom.location}
                 name="roomName" id="editLocation" placeholder="Room Name" required />
        </FormGroup>
      </Form>
    } else {
      location = <span onClick={this.toggleEdit('editLocation').bind(this)} className={"pointer editButtons"}>
        <b>{room.location}</b>
      </span>
    }

    if (this.state.editFormat) {
      format = <Form onSubmit={this.handleEditSubmit('editFormat').bind(this)}>
        <FormGroup>
          <Input type="select" size={"sm"}
                 onChange={this.handleChangeFor('format', true, 'editFormat').bind(this)}
                 value={this.state.editableRoom.format} className={"uppercase"}
                 name="roomFormat" id="editFormat" placeholder="Format" required >
            <option className={"uppercase"}>opd</option>
            <option className={"uppercase"}>bps</option>
          </Input>
        </FormGroup>
      </Form>
    } else {
      format = <span onClick={this.toggleEdit('editFormat').bind(this)} className={"pointer editButtons"}>
        <b className={"uppercase"}>{room.format}</b>
      </span>
    }

    if (this.state.editLanguage) {
      language = <Form onSubmit={this.handleEditSubmit('editLanguage').bind(this)}>
        <FormGroup>
          <Input type="select" size={"sm"}
                 onChange={this.handleChangeFor('language', true, 'editLanguage').bind(this)}
                 value={this.state.editableRoom.language}
                 name="roomLanguage" id="editLanguage" placeholder="Language" required >
            <option>de</option>
            <option>en</option>
          </Input>
        </FormGroup>
      </Form>
    } else {
      language = <span onClick={this.toggleEdit('editLanguage').bind(this)} className={"pointer editButtons"}>
          <b>{room.language}</b>
        </span>
    }

    return (
      <div className={"room"}>
        <div className={"row info"}>
          <h5>Room:
            <br/>
            {location}
          </h5>
          <h5>Format:
            <br/>
            {format}
          </h5>
          <h5>Language:
            <br/>
            {language}
          </h5>
        </div>

        <div className={"teams"}>
          {teams}
          <Team ref={(team) => { this.addContainer(team) }}
                event={this.props.event}
                deleteUser={this.props.deleteUser.bind(this)}
                class={"ml-2"} id={room.id + '_judge'} position={"judge"}
                users={users.filter((user) => { return user.position === 'judge'; })} />
        </div>

        <Button outline color="danger deleteRoom"
                onClick={() => this.deleteRoom(room.id)}
                className={"btn-circle"}>
          <i className="fa fa-times" aria-hidden="true"/>
        </Button>
      </div>
    );
  }

}

export default Room;
