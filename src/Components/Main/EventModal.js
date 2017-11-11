import React, { Component } from 'react';
import LoaderSquares from '../layout/Loader/LoaderSqares';
import '../../stylesheets/toggleSlider.css';
import noimage from '../../images/noimage.png';

import {Button, Row, Form, FormGroup, Label, Col, Input, Modal, ModalHeader, ModalBody,} from 'reactstrap'

class EventModal extends Component {

  constructor(props) {
    super(props);
    if (props.event) {
      props.event.date = new Date(props.event.date).toISOString().substring(0, 10);
    }
    this.state = {
      event: props.event || this.newEventDefaults,
      imageSearchString: '',
      displayImages: [],
      loadImages: false,
    };
    this.imagesPage = 1;
    this.toggle = this.toggle.bind(this);
  }

  newEventDefaults = {
    institution: '',
    type: '',
    date: new Date().toISOString().substring(0,10),
    password: '',
    image: '',
  };

  componentWillMount() {
    this.timer = null;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showModal) {
      this.fetchImages();
    }
  }

  async fetchImages () {
    if (!this.state.loadImages) {
      this.setState({
        loadImages: true,
      });
    }

    try {
      await fetch('http://localhost:3030/images/pexels/' +
        (this.imagesPage || 1) + '/' +
        ((window.innerWidth <= 768) ? 1 : 3) + '/' + // only load one image when on xs screens
        (!this.state.imageSearchString ? '' : this.state.imageSearchString), {
        method: 'GET',
      }).then(res => res.json())
      .then(res => {
        let photoArray = [];
        for (let i = 0; i < 4; i++) {
          photoArray.push(
            res.photos[i] ? res.photos[i].src.tiny : noimage
          );
        }
        this.setState({
          displayImages: photoArray,
          loadImages: false,
        });
      });
    } catch (ex) {
      console.error(ex);
    }
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

  handleChangeImage = (imageURL) => () => {
    const { event } = this.state;
    if (imageURL !== noimage) {
      event.image = imageURL;
      this.setState({ event, });
    }
  };

  handleChangeForImageSearch(e) {
    clearTimeout(this.timer);
    this.setState({
      imageSearchString: e.target.value,
      loadImages: true,
    });

    this.timer = setTimeout(() => {
      this.fetchImages()
    }, 1000)
  };

  toggleEventStatus() {
    const { event } = this.state;
    event.status = (event.status === 'OPEN') ? 'CLOSED' : 'OPEN';
    this.setState({ event, });
  };

  render() {

    return (
      <div>
        <Modal isOpen={this.props.showModal} toggle={this.toggle} size={"lg"}>
          <ModalHeader className={"black"} toggle={this.toggle}>
            { this.props.editMode ? "Edit event" : "Add new event" }
          </ModalHeader>
          <ModalBody className={"black"}>
            <Form onSubmit={this.handleSubmit.bind(this)}>

              <FormGroup row className={"justify-content-center"}>
                <Label for="eventInstitution" sm={3} md={2}>Institution</Label>
                <Col sm={9} md={5} >
                  <Input type="text" onChange={this.handleChangeFor('institution').bind(this)}
                         value={this.state.event.institution}
                         name="event institution" id="eventInstitution"
                         placeholder="BDU / Berlin IV 2018" required />
                </Col>
              </FormGroup>

              <FormGroup row className={"justify-content-center"}>
                <Label for="eventRole" sm={3} md={2}>Type</Label>
                <Col sm={9} md={5}>
                  <Input type="text" onChange={this.handleChangeFor('type').bind(this)}
                         value={this.state.event.type}
                         name="event type" id="eventType"
                         placeholder="Club Debate / Berlin IV Semifinals" required />
                </Col>
              </FormGroup>

              <FormGroup row className={"justify-content-center"}>
                <Label for="eventDate" sm={3} md={2}>Date</Label>
                <Col sm={9} md={5}>
                  <Input type="date" onChange={this.handleChangeFor('date').bind(this)}
                         value={this.state.event.date}
                         name="event date" id="eventDate" />
                </Col>
              </FormGroup>

              <FormGroup row className={"justify-content-center"}>
                <Label for="eventPassword" sm={3} md={2}>Password</Label>
                <Col sm={9} md={5}>
                  <Input type="text" onChange={this.handleChangeFor('password').bind(this)}
                         value={this.state.event.password}
                         name="event password" id="eventPassword"
                         placeholder="Password for editing this event" required />
                </Col>
              </FormGroup>

              { this.props.editMode ?
                <FormGroup row className={"justify-content-center"}>
                  <Label for="eventStatus" sm={3} md={2}>Status</Label>
                  <Col sm={9} md={5}>
                    <div className="slider">
                      <input type="checkbox" onChange={this.toggleEventStatus.bind(this)}
                             value={this.state.event.status === 'OPEN'} checked={this.state.event.status === 'OPEN'}
                             name="event status" id="eventStatus" />
                      <label htmlFor="eventStatus" />
                    </div>
                  </Col>
                </FormGroup> :
                null
              }


              <FormGroup row className={"justify-content-center"}>
                <Label for="eventImage" sm={3} md={2}>Image</Label>
                <Col sm={9} md={5}>
                  <Input type="text" onChange={this.handleChangeForImageSearch.bind(this)}
                         value={this.state.imageSearchString}
                         name="event image" id="eventImage" placeholder={"Search for your image"} />
                </Col>
              </FormGroup>

              { this.state.loadImages ?
                <Row className={"flex-column"}>
                  <LoaderSquares dark={'dark'} small={'small'} />
                  <p className={"text-center"}>Loading images...</p>
                </Row>
                :
                <div>
                  <Row id={"pexel-images"}  className={"mb-4 mt-2 d-flex justify-content-center"}>
                    <Col xs={1} className={"d-flex align-items-center justify-content-center pointer pexel-navigate"}
                         onClick={() => {
                           this.imagesPage--;
                           this.fetchImages();
                         }} >
                      <i className="fa fa-chevron-left fa-lg" aria-hidden="true" />
                    </Col>
                    <Col xs={10} md={3}>
                      <img src={this.state.displayImages[0]} alt=""
                           className={(this.state.event.image === this.state.displayImages[0]) ? 'highlight' : null}
                           onClick={this.handleChangeImage(this.state.displayImages[0])} />
                    </Col>
                    <Col md={3} className={"d-none d-md-block"}>
                      <img src={this.state.displayImages[1]} alt=""
                           className={(this.state.event.image === this.state.displayImages[1]) ? 'highlight' : null}
                           onClick={this.handleChangeImage(this.state.displayImages[1])} />
                    </Col>
                    <Col md={3} className={"d-none d-md-block"}>
                      <img src={this.state.displayImages[2]} alt=""
                           className={(this.state.event.image === this.state.displayImages[2]) ? 'highlight' : null}
                           onClick={this.handleChangeImage(this.state.displayImages[2])} />
                    </Col>
                    <Col xs={1} className={"d-flex align-items-center justify-content-center pointer pexel-navigate"}
                         onClick={() => {
                           this.imagesPage++;
                           this.fetchImages();
                         }} >
                      <i className="fa fa-chevron-right fa-lg" aria-hidden="true" />
                    </Col>

                  </Row>
                  { this.state.event.image ?
                    <Row className={"d-flex justify-content-center"}>
                      <Col sm={10}>
                        <p className={"text-center"} style={{fontSize: '10px', wordBreak: 'break-all'}}>{this.state.event.image.substring(0,200)}</p>
                      </Col>
                    </Row> : null
                  }

                  <Row className={"mt-2 d-flex justify-content-center"}>
                    <p className={"text-center"}>
                      Photos provided by <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer">
                      Pexels</a>.
                    </p>
                  </Row>
                </div>

              }

              <Button color={"info"} className={"pull-right"}>Submit</Button>
            </Form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default EventModal;
