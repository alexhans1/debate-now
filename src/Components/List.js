import React, { Component } from 'react';
import update from 'react/lib/update';
import Card from './Card';
import { DropTarget } from 'react-dnd';
import '../stylesheets/List.css'

class List extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cards: [
        {
          id: 1,
          name: 'Hans',
          vorname: 'Alexander',
          role: 'speaker',
          format: 'bps',
          language: 'de',
        },
        {
          id: 2,
          name: 'Maham',
          vorname: 'Pegah',
          role: 'judge',
          format: 'opd',
          language: 'en',
        },
        {
          id: 3,
          name: 'Sommerfeld',
          vorname: 'Georg',
          role: 'speaker',
          format: 'bps',
          language: 'de',
        },
        {
          id: 4,
          name: 'Münch',
          vorname: 'Tobias',
          role: 'speaker',
          format: 'opd',
          language: 'de',
        },
        {
          id: 5,
          name: 'Tarbuk',
          vorname: 'Lara',
          role: 'speaker',
          format: 'opd',
          language: 'de',
        },
        {
          id: 6,
          name: 'Niederschuh',
          vorname: 'Katrin',
          role: 'judge',
          format: 'bps',
          language: 'de',
        },
        {
          id: 7,
          name: 'Dexel',
          vorname: 'Christina',
          role: 'judge',
          format: 'bps',
          language: 'en',
        },
      ],
    };
  }


  pushCard(card) {
    this.setState(update(this.state, {
      cards: {
        $push: [ card ]
      }
    }));
  }

  removeCard(index) {
    this.setState(update(this.state, {
      cards: {
        $splice: [
          [index, 1]
        ]
      }
    }));
  }

  moveCard(dragIndex, hoverIndex) {
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
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log(this.state.cards.length !== nextState.cards.length);
    // You can access `this.props` and `this.state` here
    // This function should return a boolean, whether the component should re-render.
    return true;
  }

  render() {
    const { cards } = this.state;
    const { canDrop, isOver, connectDropTarget } = this.props;
    const isActive = canDrop && isOver;

    const backgroundColor = isActive ? 'lightgreen' : 'rgba(0, 0, 0, 0.0)';

    return connectDropTarget(
      <div className={"list"} style={{backgroundColor}}>
        <h5>Unassigned</h5>
        {cards.map((card, i) => {
          return (
            <Card
              key={card.id}
              index={i}
              listId={this.props.id}
              card={card}
              removeCard={this.removeCard.bind(this)}
              moveCard={this.moveCard.bind(this)} />
          );
        })}
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
