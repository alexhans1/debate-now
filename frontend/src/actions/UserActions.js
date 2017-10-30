import dispatcher from "../dispatcher";

export function getAllUsers(eventId) {
  dispatcher.dispatch({
    type: "GET_USERS",
    eventId: eventId,
  });
}

export function createUser(name, role, format, language) {
  dispatcher.dispatch({
    type: "CREATE_USER",
    name,
    role,
    format,
    language,
  });
}

export function deleteUser(id) {
  dispatcher.dispatch({
    type: "DELETE_USER",
    id,
  });
}

export function refreshUsers() {
  dispatcher.dispatch({
    type: "REFRESH_USERS",
  });
}
