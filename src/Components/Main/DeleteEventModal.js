import React, { Component } from 'react';

import {Button, Form, FormGroup, Label, Col, Input, Modal, ModalHeader, ModalBody,} from 'reactstrap'

class DeleteEventModal extends Component {

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
      this.setState({
        correctPassword: true,
      });
    } else if (this.state.correctPassword) {
      this.setState({
        correctPassword: false,
      });
    }
  };

  handleSubmit(e) {
    e.preventDefault();
    this.props.handleSubmit(this.props.event.id);
    this.toggle();
  }

  render() {

    let deleteButton = (this.state.correctPassword) ?
      <Button color={"info"} className={"pull-right"}>
        Delete
      </Button> :
      <Button color={"info"} className={"pull-right"} disabled>
        Delete
      </Button>;

    let modal =
      <Modal isOpen={this.props.showModal} toggle={this.toggle}>
        <ModalHeader className={"black"} toggle={this.toggle}>Type the password for the event to delete it.</ModalHeader>
        <ModalBody className={"black"}>
          <Form onSubmit={this.handleSubmit.bind(this)}>

            <FormGroup row>
              <Label for="eventPassword" sm={3}>Password</Label>
              <Col sm={9}>
                <Input type="text" onChange={this.handlePasswordChange.bind(this)}
                       name="event password" id="eventPassword"
                       placeholder="Password for editing this event" required />
              </Col>
            </FormGroup>

            {deleteButton}
          </Form>
        </ModalBody>
      </Modal>;

    if (this.props.event) {
      if (JSON.parse(localStorage.getItem('canEdit')).includes(this.props.event.id)) {
        modal =
          <Modal isOpen={this.props.showModal} toggle={this.toggle}>
            <ModalHeader className={"black"} toggle={this.toggle}>Are you sure you want to delete this event?</ModalHeader>
            <ModalBody className={"black"}>
              <Form onSubmit={this.handleSubmit.bind(this)}>

                <p>{this.props.event.institution} - {this.props.event.type}</p>

                <Button color={"info"} className={"pull-right"}>
                  Delete
                </Button>
              </Form>
            </ModalBody>
          </Modal>;
      }
    }

    return (
      <div>
        {modal}
      </div>
    );
  }
}

export default DeleteEventModal;
