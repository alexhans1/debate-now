import dispatcher from "../dispatcher";

export function getAllRooms(eventId) {
  dispatcher.dispatch({
    type: "GET_ROOMS",
    eventId: eventId,
  });
}

export function createRoom(location, format, language, eventId) {
  dispatcher.dispatch({
    type: "CREATE_ROOM",
    location,
    format,
    language,
    eventId,
  });
}

export function deleteRoom(id, eventId) {
  dispatcher.dispatch({
    type: "DELETE_ROOM",
    id,
    eventId,
  });
}

export function updateRoom(room) {
  dispatcher.dispatch({
    type: "UPDATE_ROOM",
    room,
  });
}
