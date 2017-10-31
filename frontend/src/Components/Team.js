import React, { Component } from 'react';
import update from 'react/lib/update';
import Card from './Card';
import EventPasswordModal from './EventPasswordModal';
import { DropTarget } from 'react-dnd';
import '../stylesheets/Team.css'
import remove from 'lodash/remove';
import * as UserActions from '../actions/UserActions';

class Team extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cards: props.users || [],
      showPasswordModal: false,
    };
    this.togglePasswordModal = this.togglePasswordModal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if(JSON.stringify(this.props.users) !== JSON.stringify(nextProps.users)) {
      this.setState({
        cards: nextProps.users,
      });
    }
  }

  togglePasswordModal() {
    this.setState({
      showPasswordModal: !this.state.showPasswordModal,
    });
  }

  pushCard(card) {
    if (JSON.parse(localStorage.getItem('canEdit')).includes(this.props.event.id)) {
      card.position = this.props.position;
      card.roomId = parseInt(this.props.id.substring(0, this.props.id.indexOf('_')), 10);
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

  deleteCard(id) {
    if (JSON.parse(localStorage.getItem('canEdit')).includes(this.props.event.id)) {
      let newUsersArray = this.state.cards.slice();
      remove(newUsersArray, {id});
      this.setState({
        cards: newUsersArray,
      });
      this.props.deleteUser(id);
    } else {
      this.togglePasswordModal();
    }

  }

  render() {
    const { cards } = this.state;
    const { canDrop, isOver, connectDropTarget } = this.props;
    const isActive = canDrop && isOver;

    const backgroundColor = isActive ? 'lightgreen' : 'rgba(0, 0, 0, 0.0)';

    return connectDropTarget(
      <div className={`team border--white uppercase ${ this.props.class }`} style={{backgroundColor}}>
        <h5>{this.props.position}</h5>
        {cards.map((card, i) => {
          return (
            <Card
              key={card.id}
              index={i}
              listId={this.props.id}
              card={card}
              removeCard={this.removeCard.bind(this)}
              moveCard={this.moveCard.bind(this)}
              deleteCard={this.deleteCard.bind(this)}/>
          );
        })}

        <EventPasswordModal showModal={this.state.showPasswordModal}
                            toggle={this.togglePasswordModal}
                            event={this.props.event} />
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
}))(Team);
