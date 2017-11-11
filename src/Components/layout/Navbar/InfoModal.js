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
            <p>Created by Alexander Hans for the Berlin Debating Union.</p>
            <p>Collaborations welcome via &nbsp;
              <a target={"_blank"} href="https://github.com/alexhans1/debate-now">
              https://github.com/alexhans1/debate-now
            </a>.
            </p>
            <p>
              If you like this project feel free to <b>donate</b> via &nbsp;
              <a href="https://www.paypal.me/debatenow" target={"_blank"}>
                <img src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png"
                   alt="PayPal Logo" />
              </a>
            </p>
          </ModalBody>
          <ModalFooter className={"black"}>
            <p className={"mr-auto"}>Photos provided by <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer">Pexels</a>.</p>
            <Button outline color={"danger"} onClick={this.toggle}>Close</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default InfoModal;


