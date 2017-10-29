import React, { Component } from 'react';
import Team from './Team';
import '../stylesheets/Room.css';
import '../stylesheets/btn-circle.css';

import { Button } from 'reactstrap';

class Room extends Component {

  constructor() {
    super();
    this.state = {
      judges: null,
      containers: [],
    };
  }

  deleteRoom (id) {
    // check if there are users in this room
    let BreakException = {};
    try {
      this.state.containers.forEach((container) => {
        if (container.decoratedComponentInstance.state.cards.length) {
          alert('You can´t delete a room if there are people in there.. it´s dangerous!');
          throw BreakException
        }
      });
      this.props.deleteRoom(id);
    } catch (ex) {
      if(ex !== BreakException) console.error(ex);
    }
  }

  addContainer(team) {
    if (team !== null) {
      this.state.containers.push(team);
    }

  }

  render() {
    const { room } = this.props;

    let teams = null;
    if (room.format.toLowerCase() === 'bps') {
      teams = <div>
        <div className="row teams">
          <Team id={room.location + '_og'} position={"OG"}
                deleteUser={this.props.deleteUser.bind(this)}
                ref={(team) => { this.addContainer(team) }} />
          <Team id={room.location + '_oo'} position={"OO"}
                deleteUser={this.props.deleteUser.bind(this)}
                 ref={(team) => { this.addContainer(team) }} />
        </div>
        <div className="row teams">
          <Team id={room.location + '_cg'} position={"CG"}
                deleteUser={this.props.deleteUser.bind(this)}
                 ref={(team) => { this.addContainer(team) }} />
          <Team id={room.location + '_co'} position={"CO"}
                deleteUser={this.props.deleteUser.bind(this)}
                 ref={(team) => { this.addContainer(team) }} />
        </div>
      </div>;

    } else if (room.format.toLowerCase() === 'opd') {
      teams = <div>
        <div className="row teams">
          <Team id={room.location + '_reg'} position={"Reg"}
                deleteUser={this.props.deleteUser.bind(this)}
                 ref={(team) => { this.addContainer(team) }} />
          <Team id={room.location + '_opp'} position={"Opp"}
                deleteUser={this.props.deleteUser.bind(this)}
                 ref={(team) => { this.addContainer(team) }} />
        </div>
        <div className="row teams mt-1">
          <Team id={room.location + '_ffr'} position={"FFR"}
                deleteUser={this.props.deleteUser.bind(this)}
                 ref={(team) => { this.addContainer(team) }} />
        </div>

      </div>;
    }

    return (
      <div className={"room"}>
        <div className={"row info"}>
          <h5>Room:
            <br/>
            <b>{room.location}</b>
          </h5>
          <h5>Format:
            <br/>
            <b className={"uppercase"}>{room.format}</b>
          </h5>
          <h5>Language:
            <br/>
            <b>{room.language}</b>
          </h5>
        </div>

        <div className={"teams"}>
          {teams}
          <Team ref={(team) => { this.addContainer(team) }}
                deleteUser={this.props.deleteUser.bind(this)}
                class={"ml-2"} id={room.location + '_judge'} position={"Judges"} />
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
