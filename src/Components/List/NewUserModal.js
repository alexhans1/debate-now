import React, { Component } from 'react';
import UserStore from '../../stores/UserStore';

import {Form, FormGroup, Label, Col, Input, Modal, ModalHeader, ModalBody,} from 'reactstrap'

class NewUserModal extends Component {

  constructor() {
    super();
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.props.toggle();
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.props.newUser.name !== '') {
      this.props.handleSubmit();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.showModal && nextProps.showModal) {
      setTimeout(() => {
        this.submitButton.focus();
      }, 10)
    }
  }

  render() {

    const {showModal, handleChange, newUser,} = this.props;
    const users = UserStore.getAllUsers();

    return (
      <div>
        <Modal isOpen={showModal} toggle={this.toggle}>
          <ModalHeader className={"black"} toggle={this.toggle}>Add new user</ModalHeader>
          <ModalBody className={"black"}>
            <Form onSubmit={this.handleSubmit.bind(this)}>
              <FormGroup row>
                <Label for="userName" sm={3}>User name</Label>
                <Col sm={9}>
                  <Input type="text" onChange={handleChange('name').bind(this)}
                         value={newUser.name}
                         name="user name" id="userName" placeholder="User Name" required />
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="userRole" sm={3}>Role</Label>
                <Col sm={9}>
                  <Input type="select" onChange={handleChange('role').bind(this)}
                         value={newUser.role}
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
                  <Input type="select" onChange={handleChange('format').bind(this)}
                         value={newUser.format} className={"uppercase"}
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
                  <Input type="select" onChange={handleChange('language').bind(this)}
                         value={newUser.language}
                         name="user language" id="userLanguage">
                    <option>de</option>
                    <option>en</option>
                    <option />
                  </Input>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label for="teamPartner" sm={3}>Team Partner</Label>
                <Col sm={9}>
                  <Input type="select"
                         onChange={handleChange('teamPartner').bind(this)}
                         value={newUser.teamPartner}
                         name="team partner"
                         className="capitalize"
                         id="teamPartner"
                         disabled={newUser.role === 'judge'}>
                    <option />
                    {users.map((user) => {
                      return <option key={user.id} className="capitalize">{user.name}</option>
                    })}
                  </Input>
                </Col>
              </FormGroup>
              <button className={"pull-right btn btn-info pull-right"}
                      ref={ref => {this.submitButton = ref}} >
                Submit
              </button>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default NewUserModal;
