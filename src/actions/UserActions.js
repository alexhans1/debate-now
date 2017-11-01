import dispatcher from "../dispatcher";

export function getAllUsers(eventId) {
  dispatcher.dispatch({
    type: "GET_USERS",
    eventId: eventId,
  });
}

export function createUser(name, role, format, language, eventId) {
  dispatcher.dispatch({
    type: "CREATE_USER",
    name,
    role,
    format,
    language,
    eventId,
  });
}

export function deleteUser(id) {
  dispatcher.dispatch({
    type: "DELETE_USER",
    id,
  });
}

export function updateUser(user) {
  dispatcher.dispatch({
    type: "UPDATE_USER",
    user,
  });
}
