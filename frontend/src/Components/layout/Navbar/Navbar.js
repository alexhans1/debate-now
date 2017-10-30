import React, { Component } from 'react';
import InfoModal from './InfoModal'
import { Link } from 'react-router-dom';
import '../../../stylesheets/Navbar.css';

import { Collapse, Navbar, NavbarToggler, Nav, NavItem, NavLink } from 'reactstrap';

class myNavbar extends Component {

  constructor() {
    super();

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      showModal: false,
      isOpen: false,
    };
  }

  toggleNavbar() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  toggleModal() {
    this.setState({
      showModal: !this.state.showModal,
    });
  }

  render() {
    return (
      <div className="container-fluid">
        <Navbar color="faded" light expand="md">
          <Link to={"/"} className={"navbar-brand"}>
            <img className={""} src="/images/logo.png" width="120" height="120" alt="" />
          </Link>
          <NavbarToggler onClick={this.toggleNavbar} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav navbar>
              <NavItem>
                <Link to={"/"} className={"nav-link"}>
                  Home
                </Link>
              </NavItem>
              <NavItem className={"infoModalButton"}>
                <NavLink onClick={this.toggleModal.bind(this)} className={"p-2 pointer"}>
                  <i className="fa fa-question-circle-o fa-lg" aria-hidden="true" />
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
        <InfoModal showModal={this.state.showModal} toggle={this.toggleModal.bind(this)} />
      </div>
    )
  }
}

export default myNavbar;


