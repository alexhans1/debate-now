import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';
import flow from 'lodash/flow';
import '../stylesheets/Card.css';

class Card extends Component {

  render() {
    const { card, isDragging, connectDragSource, connectDropTarget } = this.props;
    const opacity = isDragging ? 0.5 : 1;
    let backgroundColor = 'bg-gray';
    if (card.role.toLowerCase() === 'speaker') {
      if (card.format.toLowerCase() === 'bps') backgroundColor = 'bg-green';
      else if (card.format.toLowerCase() === 'opd') backgroundColor = 'bg-red';
    } else if (card.role.toLowerCase() === 'judge') {
      if (card.format.toLowerCase() === 'bps') backgroundColor = 'bg-olive';
      else if (card.format.toLowerCase() === 'opd') backgroundColor = 'bg-maroon';
    }

    backgroundColor += ' cardItem';

    return connectDragSource(connectDropTarget(
      <div className={backgroundColor} style={{ opacity }} >
        <span>
            {card.name}
          </span>

        <a className="deleteCard">
          <i className="fa fa-times" aria-hidden="true"/>
        </a>
      </div>
    ));
  }
}

const cardSource = {

  beginDrag(props) {
    return {
      index: props.index,
      listId: props.listId,
      card: props.card
    };
  },

  endDrag(props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if ( dropResult && dropResult.listId !== item.listId ) {
      props.removeCard(item.index);
    }
  }
};

const cardTarget = {

  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    const sourceListId = monitor.getItem().listId;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    if ( props.listId === sourceListId ) {
      props.moveCard(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      monitor.getItem().index = hoverIndex;
    }
  }
};

export default flow(
  DropTarget("CARD", cardTarget, connect => ({
    connectDropTarget: connect.dropTarget()
  })),
  DragSource("CARD", cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }))
)(Card);
