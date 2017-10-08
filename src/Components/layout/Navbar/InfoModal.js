import React, { Component } from 'react';

import {Button, Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

class InfoModal extends Component {
  constructor() {
    super();
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.props.toggle();
  }

  render() {

    return (
      <div>
        <Modal isOpen={this.props.showModal} toggle={this.toggle}>
          <ModalHeader className={"black"} toggle={this.toggle}>Info</ModalHeader>
          <ModalBody className={"black"}>
            <p>Created by Alexander Hans for the Berlin Debating Union</p>
            <p>Collaborations welcome through [github link]</p>
          </ModalBody>
          <ModalFooter className={"black"}>
            <Button outline color={"danger"} onClick={this.toggle}>Close</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default InfoModal;


