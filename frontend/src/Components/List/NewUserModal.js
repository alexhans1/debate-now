import React, { Component } from 'react';

import {Button, Form, FormGroup, Label, Col, Input, Modal, ModalHeader, ModalBody,} from 'reactstrap'

class NewUserModal extends Component {

  constructor() {
    super();
    this.state = {
      nameClass: '',
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.props.toggle();
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.props.newUser.name !== '') {
      this.props.handleSubmit();
    } else {
      this.setState({
        nameClass: 'border--red',
      });
    }
  }

  render() {

    return (
      <div>
        <Modal isOpen={this.props.showModal} toggle={this.toggle}>
          <ModalHeader className={"black"} toggle={this.toggle}>Add new user</ModalHeader>
          <ModalBody className={"black"}>
            <Form onSubmit={this.handleSubmit.bind(this)}>
              <FormGroup row>
                <Label for="userName" sm={3}>User name</Label>
                <Col sm={9}>
                  <Input type="text" onChange={this.props.handleChange('name').bind(this)}
                         value={this.props.newUser.name}
                         name="user name" id="userName" placeholder="User Name" required />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="userRole" sm={3}>Role</Label>
                <Col sm={9}>
                  <Input type="select" onChange={this.props.handleChange('role').bind(this)}
                         value={this.props.newUser.role}
                         name="user role" id="userRole">
                    <option>speaker</option>
                    <option>judge</option>
                    <option />
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="userFormat" sm={3}>Format</Label>
                <Col sm={9}>
                  <Input type="select" onChange={this.props.handleChange('format').bind(this)}
                         value={this.props.newUser.format} className={"uppercase"}
                         name="user format" id="userFormat">
                    <option className={"uppercase"}>bps</option>
                    <option className={"uppercase"}>opd</option>
                    <option />
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="userLanguage" sm={3}>Language</Label>
                <Col sm={9}>
                  <Input type="select" onChange={this.props.handleChange('language').bind(this)}
                         value={this.props.newUser.language}
                         name="user language" id="userLanguage">
                    <option>de</option>
                    <option>en</option>
                    <option />
                  </Input>
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

export default NewUserModal;
