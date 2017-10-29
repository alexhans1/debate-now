import dispatcher from "../dispatcher";

export function getAllEvents() {
  dispatcher.dispatch({
    type: "GET_EVENTS",
  });
}

export function createEvent(institution, type) {
  dispatcher.dispatch({
    type: "CREATE_EVENT",
    institution,
    eventType: type,
  });
}

export function deleteEvent(id) {
  dispatcher.dispatch({
    type: "DELETE_EVENT",
    id,
  });
}
