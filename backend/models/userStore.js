// Simple user store for tests and routes
const users = [];

function addUser(email, password) {
  users.push({ email, password });
}

function findUser(email) {
  return users.find((u) => u.email === email);
}

function findUserByCredentials(email, password) {
  return users.find((u) => u.email === email && u.password === password);
}

function clearAll() {
  users.length = 0;
}

module.exports = { addUser, findUser, findUserByCredentials, clearAll };
