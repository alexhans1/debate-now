import dispatcher from "../dispatcher";

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
