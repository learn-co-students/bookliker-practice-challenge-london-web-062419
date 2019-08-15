const BOOKS_URL = "http://localhost:3000/books";
const ul = document.querySelector("#list");
const div = document.querySelector("#show-panel");
const me = { id: 1, username: "pouros" };

// Fetching intitial Data from API

const fetchUrl = () => {
  fetch(BOOKS_URL)
    .then(resp => resp.json())
    .then(resp => renderAllBooks(resp));
};

// Render one quote on the screen

const renderBookTitle = book => {
  const p = document.createElement("p");
  const li = document.createElement("li");

  p.innerText = book.title;

  ul.append(li, p);

  p.addEventListener("click", e => {
    renderSelectedBook(book);
  });
};

const renderSelectedBook = book => {
  div.innerText = "";
  const img = document.createElement("img");
  const p2 = document.createElement("p");
  const h2 = document.createElement("h2");
  const button = document.createElement("button");
  const ul = document.createElement("ul");
  const h3 = document.createElement("h3");

  img.src = book.img_url;
  p2.innerText = book.description;
  h2.innerText = book.title;

  button.innerText = "Read Book";

  book.users.map(user => {
    const li = document.createElement("li");
    ul.append(li);
    li.innerText = user.username;
    div.append(h2, img, p2, button, ul);
  });

  button.addEventListener("click", e => {
    addMeToList(book);
  });
};

const renderUser = book => {
  const h3 = document.createElement("h3");

  div.append(h3);
};

const renderAllBooks = booksArray => {
  booksArray.forEach(book => {
    renderBookTitle(book);
  });
};

const addMeToList = book => {
  const responseBody = { "users": [...book.users, me] };
  book.users.includes(me) ? alert("You have already read this book") 
  : 
   
    fetch(BOOKS_URL + "/" + book.id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(responseBody)
    })
      .then(resp => resp.json())
      .then(resp => renderSelectedBook(resp))
  };


document.addEventListener("DOMContentLoaded", fetchUrl());
