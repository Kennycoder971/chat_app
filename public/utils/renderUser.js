function renderUser(users, element) {
  users.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = user.username;
    element.appendChild(li);
  });
}
export default renderUser;
