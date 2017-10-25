import dispatcher from "../dispatcher";

export function getAllEvents() {
  dispatcher.dispatch({
    type: "GET_EVENTS",
  });
}
