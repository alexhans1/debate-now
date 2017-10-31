import React, { Component } from 'react';

import { FormGroup, Label, Col, Input, Modal, ModalHeader, ModalBody,} from 'reactstrap'

class EventPasswordModal extends Component {

  constructor() {
    super();
    this.state = {
      correctPassword: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.props.toggle();
  }

  handlePasswordChange(e) {
    if (e.target.value === this.props.event.password) {
      let canEditIds = JSON.parse(localStorage.getItem('canEdit'));
      console.log(canEditIds);
      canEditIds.push(this.props.event.id);
      localStorage.setItem('canEdit', JSON.stringify(canEditIds));
      this.toggle();
    }
  };

  render() {

    return (
      <div>
        <Modal isOpen={this.props.showModal} toggle={this.toggle}>
          <ModalHeader className={"black"} toggle={this.toggle}>Event password</ModalHeader>
          <ModalBody className={"black"}>

              <FormGroup row>
                <Label for="eventPassword" sm={3}>Password</Label>
                <Col sm={9}>
                  <Input type="text" onChange={this.handlePasswordChange.bind(this)}
                         name="event password" id="eventPassword"
                         placeholder="Password for editing this event" required />
                </Col>
              </FormGroup>

          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default EventPasswordModal;
