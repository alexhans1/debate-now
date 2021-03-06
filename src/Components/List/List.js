import React, { Component } from 'react';
import update from 'react/lib/update';
import NewUserModal from './NewUserModal';
import Card from '../Card';
import EventPasswordModal from '../EventPasswordModal';
import { DropTarget } from 'react-dnd';
import '../../stylesheets/List.css'
import * as UserActions from '../../actions/UserActions';

import {FormGroup, Label, Input} from 'reactstrap'

class List extends Component {

  newUserDefaults = {
    name: '',
    role: 'speaker',
    format: 'bps',
    language: 'de',
    teamPartner: '',
  };

  constructor(props) {
    super();
    this.state = {
      cards: props.users || [],
      showPasswordModal: false,
      newUser: this.newUserDefaults,
      showModal: false,
      fixListPosition: null,
      scrollableList: null,
    };

    this.togglePasswordModal = this.togglePasswordModal.bind(this);
    this.handleAddUserSubmit = this.handleAddUserSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(JSON.stringify(this.props.users) !== JSON.stringify(nextProps.users)) {
      this.setState({
        cards: nextProps.users,
      });

      setTimeout(() => {
        let listElement = document.getElementById("list");
        if (listElement) {
          if (listElement.scrollHeight + 30 > window.innerHeight && !this.state.scrollableList) {
            this.setState({
              scrollableList: "scrollableList",
            });
          }
          if (listElement.scrollHeight + 30 < window.innerHeight && this.state.scrollableList) {
            this.setState({
              scrollableList: null,
            });
          }
        }
      }, 10)
    }
  }

  componentWillMount(){
    document.addEventListener("keypress", this.handleKeyPress.bind(this));
    document.addEventListener("scroll", this.handleScroll.bind(this));
  }

  componentWillUnmount(){
    document.removeEventListener("keypress", this.handleKeyPress.bind(this));
    document.removeEventListener("scroll", this.handleScroll.bind(this));
  }

  componentDidMount() {
    this.listTopY = document.getElementById("list").getBoundingClientRect().top + window.scrollY;
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.showModal && prevState.showModal) {
      setTimeout(() => {
        this.newUserInput.focus();
      }, 10)
    }
  }

  handleScroll() {
    let listElement = document.getElementById("list");
    if (listElement) {
      let listClientRect = listElement.getBoundingClientRect();
      if (!this.state.fixListPosition && listClientRect.top < 15) {
        // set position: fixed
        listElement.style.maxWidth = listElement.offsetWidth + 'px';
        this.setState({
          fixListPosition: 'fixListPosition',
        });
      } else if (this.state.fixListPosition && window.scrollY < this.listTopY - 15) {
        // remove position: fixed
        this.setState({
          fixListPosition: null,
        });
      }
    }
  }

  togglePasswordModal() {
    this.setState({
      showPasswordModal: !this.state.showPasswordModal,
    });
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      if (this.state.newUser.name === '') {
        // TODO mark input box red

      } else {
        // open modal
        this.setState({
          showModal: true,
        });
      }
    }
  }

  handleChangeFor = (propertyName) => (event) => {
    const { newUser } = this.state;
    const userToAdd = {
      ...newUser,
      [propertyName]: event.target.value
    };
    if (propertyName === 'role' && event.target.value === 'judge' && userToAdd.teamPartner !== '') {
      userToAdd.teamPartner = '';
    }
    this.setState({ newUser: userToAdd, });
  };

  handleAddUserSubmit() {
    if (this.state.newUser.name !== '') {
      this.props.createUser(
        this.state.newUser.name,
        this.state.newUser.role,
        this.state.newUser.format,
        this.state.newUser.language,
        this.state.newUser.teamPartner,
        this.props.event.id
      );
      this.setState({
        newUser: this.newUserDefaults,
        showModal: false,
      });
    }
  };

  deleteCard(id) {
    if (JSON.parse(localStorage.getItem('canEdit')).includes(this.props.event.id)) {
      this.props.deleteUser(id);
    } else {
      this.togglePasswordModal();
    }
  }

  toggleModal() {
    this.setState({
      showModal: !this.state.showModal,
    });
  }

  pushCard(card) {
    if (JSON.parse(localStorage.getItem('canEdit')).includes(this.props.event.id)) {
      card.position = null;
      card.roomId = null;
      UserActions.updateUser(card);
      this.setState(update(this.state, {
        cards: {
          $push: [ card ]
        }
      }));
    } else {
      this.togglePasswordModal();
    }
  }

  removeCard(index) {
    if (JSON.parse(localStorage.getItem('canEdit')).includes(this.props.event.id)) {
      this.setState(update(this.state, {
        cards: {
          $splice: [
            [index, 1]
          ]
        }
      }));
    }
  }

  moveCard(dragIndex, hoverIndex) {
    if (JSON.parse(localStorage.getItem('canEdit')).includes(this.props.event.id)) {
      const { cards } = this.state;
      const dragCard = cards[dragIndex];

      this.setState(update(this.state, {
        cards: {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard]
          ]
        }
      }));
    } else {
      this.togglePasswordModal();
    }
  }

  render() {
    const { cards, newUser, showModal, showPasswordModal } = this.state;
    const { canDrop, isOver, connectDropTarget, event } = this.props;
    const isActive = canDrop && isOver;

    const backgroundColor = isActive ? 'lightgreen' : 'rgba(0, 0, 0, 0.0)';

    let newUserInput = <Input type="text" value={this.state.newUser.name} onChange={this.handleChangeFor('name')}
                              name="user name" id="userName" placeholder="Register"
                              innerRef={ref => {this.newUserInput = ref}} />;
    if (this.props.event) {
      if (this.props.event.status === 'CLOSED') {
        newUserInput = <Input type="text" value={this.state.newUser.name}
                              name="user name" id="userName" placeholder="Event Closed" disabled />
      }
    }

    return connectDropTarget(
      <div id={"list"} style={{backgroundColor}}
           className={this.state.fixListPosition + ' ' + this.state.scrollableList}>
        <FormGroup>
          <Label for="userName" hidden>User Name</Label>

          {newUserInput}
        </FormGroup>
        {cards.map((card, i) => {
          return (
            <Card
              key={card.id}
              index={i}
              listId={this.props.id}
              card={card}
              removeCard={this.removeCard.bind(this)}
              moveCard={this.moveCard.bind(this)}
              deleteCard={this.deleteCard.bind(this)} />
          );
        })}

        {/*initialize new user modal*/}
        <NewUserModal showModal={showModal}
                      toggle={this.toggleModal.bind(this)}
                      handleChange={this.handleChangeFor}
                      newUser={newUser}
                      handleSubmit={this.handleAddUserSubmit} />

        <EventPasswordModal showModal={showPasswordModal}
                            toggle={this.togglePasswordModal}
                            event={event} />
      </div>
    );
  }
}

const cardTarget = {
  drop(props, monitor, component ) {
    const { id } = props;
    const sourceObj = monitor.getItem();
    if ( id !== sourceObj.listId ) component.pushCard(sourceObj.card);
    return {
      listId: id
    };
  }
};

export default DropTarget("CARD", cardTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))(List);
