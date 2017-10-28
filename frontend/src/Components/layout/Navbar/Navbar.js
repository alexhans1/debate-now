import React, { Component } from 'react';
import InfoModal from './InfoModal'

class Navbar extends Component {

  constructor() {
    super();
    this.state = {
      showModal: false,
    };
  }

  toggleModal() {
    this.setState({
      showModal: !this.state.showModal,
    });
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-2">
            <img className={""} src="images/logo.png" width="120" height="120" alt="" />
          </div>
          <div className="col-10">
            <nav className="navbar pr-5">
            <span onClick={this.toggleModal.bind(this)} className={"ml-auto p-2 pointer"}>
              <i className="fa fa-question-circle-o fa-lg" aria-hidden="true" />
            </span>
            </nav>
          </div>

          <InfoModal showModal={this.state.showModal} toggle={this.toggleModal.bind(this)} />
        </div>
      </div>

    )
  }
}

export default Navbar;


