import renderUser from "./utils/renderUser.js";
const URL = "http://localhost:5000";
const socket = io(URL, { autoConnect: false });
const h1 = document.querySelector("h1");
const userList = document.querySelector("#userList");
const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});

let { username } = params;
let usersArr = [];

socket.auth = { username };
socket.connect();

socket.on("connect_error", (err) => {
  if (err.message === "invalid username") {
    alert("you must have a username");
  }
  location.assign("/");
});

h1.textContent = `Welcome ${username}`;

socket.on("users", (users) => {
  users.forEach((user) => {
    user.self = user.userId === socket.id;
  });
  console.log();
  // put the current user first, and then sort by username
  usersArr = users.sort((a, b) => {
    if (a.self) return -1;
    if (b.self) return 1;
    if (a.username < b.username) return -1;
    return a.username > b.username ? 1 : 0;
  });

  renderUser(usersArr, userList);
});
