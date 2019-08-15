// Get a list of books & render them from http://localhost:3000/books

const booksUrl = "http://localhost:3000/books";
const ul = document.querySelector("#list");
const showPanel = document.querySelector("#show-panel");

const USER_ME = { id: 1, username: "pouros" };

//Fetch all books and send to mapping function
const fetchBooks = () => {
  return fetch(booksUrl)
    .then(resp => resp.json())
    .then(booksArray => books(booksArray));
};

//Map through all books and send to list title function
const books = booksArray => {
  booksArray.map(book => listTitles(book));
};
const getBook = book => {
  return fetch(booksUrl + "/" + book.id).then(data => data.json());
};
//List all Titles and add event for clicking
const listTitles = book => {
  const li = document.createElement("li");
  li.innerText = book.title;

  ul.append(li);

  li.addEventListener("click", event => {
    getBook(book).then(book => showBookOnPage(book));
  });
};

const showBookOnPage = book => {
  showPanel.innerHTML = "";
  const bookImg = book.img_url;

  const h2 = document.createElement("h2");
  h2.innerText = book.title;

  const p = document.createElement("p");
  p.innerText = book.description;

  const img = document.createElement("img");
  img.src = bookImg;

  const bookUsers = document.createElement("ul");

  book.users.map(user => {
    const list = document.createElement("li");
    list.innerText = user.username;
    bookUsers.appendChild(list);
  });

  const button = document.createElement("button");
  const buttonState = !!book.users.find(
    user => user.username === USER_ME.username
  );
  buttonState
    ? (button.innerText = "Unread Book")
    : (button.innerText = "Read Book");
  button.addEventListener("click", event => {
    handleReadBookEvent(book, buttonState);
  });

  showPanel.append(h2, img, p, bookUsers, button);
};
//I'm about to handle the clickingness of the Read Book button
//I want to click Read Book and add "me" to the users array of the book
//And then update list that displays.
//Updating backend: fetch POST request with body having an array of all the users including me (that's read the book)
//Updating frontend:
const handleReadBookEvent = (book, buttonState) => {
  if (buttonState) {
    fetchDeleteForRemoveUser(book);
  } else {
    fetchPatchForAddUser(book);
  }
};

const fetchPatchForAddUser = book => {
  const respBody = {
    users: [...book.users, USER_ME]
  };
  return fetch(booksUrl + "/" + book.id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(respBody)
  })
    .then(resp => resp.json())
    .then(resp => showBookOnPage(resp));
};

const fetchDeleteForRemoveUser = book => {
  const respBody = {
    users: book.users.filter(user => user.username !== USER_ME.username)
  };
  return fetch(booksUrl + "/" + book.id, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(respBody)
  })
    .then(resp => resp.json())
    .then(resp => showBookOnPage(resp));
};

//I want to "unlike" a book if I have already clicked "Read Book"
//Thoughts:
//  -if statement such that
//      "IF USER_ME exists in book.users,
//      Read Book will delete/remove USER_ME from book.users,
//      ELSE handleReadBookEvent(book).
//  -change

document.addEventListener("DOMContentLoaded", event => {
  fetchBooks();
});

//document.addEventListener("DOMContentLoaded", function() {});
