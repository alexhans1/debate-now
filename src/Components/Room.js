import React, { Component } from 'react';
import Team from './Team';
import '../stylesheets/Room.css'

class Room extends Component {

  deleteRoom (id) {
    this.props.deleteRoom(id);
  }

  render() {
    const { room } = this.props;

    let teams = null;
    if (room.format.toLowerCase() === 'bps') {
      teams = <div>
        <div className="row teams">
          <Team id={room.location + '_og'} position={"OG"} />
          <Team id={room.location + '_oo'} position={"OO"} />
        </div>
        <div className="row teams">
          <Team id={room.location + '_cg'} position={"CG"} />
          <Team id={room.location + '_co'} position={"CO"} />
        </div>
      </div>;

    } else if (room.format.toLowerCase() === 'opd') {
      teams = <div>
        <div className="row teams">
          <Team id={room.location + '_reg'} position={"Reg"} />
          <Team id={room.location + '_opp'} position={"Opp"} />
        </div>
        <div className="row mt-1">
          <Team id={room.location + '_ffr'} position={"FFR"} />
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
          <Team ref={(dndContainer) => { this.dndContainer = dndContainer; }}
                class={"ml-2"} id={room.location + '_judge'} position={"Judges"} />
        </div>

        <button onClick={() => this.deleteRoom(room.id) } className="btn btn-outline-danger btn-circle deleteRoom">
          <i className="fa fa-times" aria-hidden="true"/>
        </button>
      </div>
    );
  }

}

export default Room;
