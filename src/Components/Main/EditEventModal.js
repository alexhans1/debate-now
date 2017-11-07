import React, { Component } from 'react';
import '../../stylesheets/toggleSlider.css';

import {Button, Form, FormGroup, Label, Col, Input, Modal, ModalHeader, ModalBody,} from 'reactstrap'

class NewEventModal extends Component {

  constructor(props) {
    super(props);
    if (props.event) {
      props.event.date = new Date(props.event.date).toISOString().substring(0, 10);
    }
    this.state = {
      event: props.event,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.props.toggle();
  }

  handleSubmit(e) {
    e.preventDefault();
    const { event } = this.state;
    if (event) {
      this.props.handleSubmit(event);
    }
    this.toggle();
  };

  handleChangeFor = (propertyName) => (e) => {
    const { event } = this.state;
    event[propertyName] = e.target.value;
    this.setState({ event, });
  };

  toggleEventStatus() {
    const { event } = this.state;
    event.status = (event.status === 'OPEN') ? 'CLOSED' : 'OPEN';
    this.setState({ event, });
  };

  render() {



    return (
      <div>
        <Modal isOpen={this.props.showModal} toggle={this.toggle}>
          <ModalHeader className={"black"} toggle={this.toggle}>Edit event</ModalHeader>
          <ModalBody className={"black"}>
            <Form onSubmit={this.handleSubmit.bind(this)}>

              <FormGroup row>
                <Label for="eventInstitution" sm={3}>Institution</Label>
                <Col sm={9}>
                  <Input type="text" onChange={this.handleChangeFor('institution').bind(this)}
                         value={this.state.event.institution}
                         name="event institution" id="eventInstitution"
                         placeholder="BDU / Berlin IV 2018" required />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="eventRole" sm={3}>Type</Label>
                <Col sm={9}>
                  <Input type="text" onChange={this.handleChangeFor('type').bind(this)}
                         value={this.state.event.type}
                         name="event type" id="eventType"
                         placeholder="Club Debate / Berlin IV Semifinals" required />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="eventDate" sm={3}>Date</Label>
                <Col sm={9}>
                  <Input type="date" onChange={this.handleChangeFor('date').bind(this)}
                         value={this.state.event.date}
                         name="event date" id="eventDate" />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="eventPassword" sm={3}>Password</Label>
                <Col sm={9}>
                  <Input type="text" onChange={this.handleChangeFor('password').bind(this)}
                         value={this.state.event.password}
                         name="event password" id="eventPassword"
                         placeholder="Password for editing this event" required />
                </Col>
              </FormGroup>

              <FormGroup row>
                <Label for="eventStatus" sm={3}>Status</Label>
                <Col sm={9}>
                  <div className="slider">
                    <input type="checkbox" onChange={this.toggleEventStatus.bind(this)}
                           value={this.state.event.status === 'OPEN'} checked={this.state.event.status === 'OPEN'}
                           name="event status" id="eventStatus" />
                    <label htmlFor="eventStatus" />
                  </div>
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
