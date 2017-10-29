import React, { Component } from 'react';

import {Button, Form, FormGroup, Label, Col, Input, Modal, ModalHeader, ModalBody,} from 'reactstrap'

class NewEventModal extends Component {

  constructor() {
    super();
    this.state = {
      alertClass: ''
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.props.toggle();
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.props.newEvent.institution && this.props.newEvent.type) {
      this.props.handleSubmit();
    } else {
      this.setState({
        alertClass: 'border--red',
      });
    }
  }

  render() {

    return (
      <div>
        <Modal isOpen={this.props.showModal} toggle={this.toggle}>
          <ModalHeader className={"black"} toggle={this.toggle}>Add new event</ModalHeader>
          <ModalBody className={"black"}>
            <Form onSubmit={this.handleSubmit.bind(this)}>
              <FormGroup row>
                <Label for="eventInstitution" sm={3}>Institution</Label>
                <Col sm={9}>
                  <Input type="text" onChange={this.props.handleChange('institution').bind(this)}
                         value={this.props.newEvent.institution}
                         name="event institution" id="eventInstitution"
                         placeholder="BDU / Berlin IV 2018" required />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="eventRole" sm={3}>Type</Label>
                <Col sm={9}>
                  <Input type="text" onChange={this.props.handleChange('type').bind(this)}
                         value={this.props.newEvent.type}
                         name="event type" id="eventType"
                         placeholder="Club Debate / Berlin IV Semifinals" required />
                </Col>
              </FormGroup>

              <Button color={"info"} className={"pull-right"}>Submit</Button>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default NewEventModal;
