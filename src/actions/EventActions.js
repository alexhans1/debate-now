import dispatcher from "../dispatcher";

export function getAllEvents() {
  dispatcher.dispatch({
    type: "GET_EVENTS",
  });
}

export function createEvent(institution, type, date, password) {
  dispatcher.dispatch({
    type: "CREATE_EVENT",
    institution,
    eventType: type,
    date,
    password,
  });
}

export function updateEvent(event) {
  dispatcher.dispatch({
    type: "UPDATE_EVENT",
    event,
  });
}

export function deleteEvent(id) {
  dispatcher.dispatch({
    type: "DELETE_EVENT",
    id,
  });
}
