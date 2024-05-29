import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./css/styles.css";

// business logic

function getGIFs(requestURL, query) {
  let promise = new Promise(function(resolve, reject) {
    let request = new XMLHttpRequest();
    const url = requestURL;
    request.addEventListener("loadend", function() {
      const response = JSON.parse(this.responseText);
      if (this.status === 200) {
        resolve([response, query]);
      } else {
        reject([this, response]);
      }
    });
    request.open("GET", url, true);
    request.send();
  });

  promise.then(function(response) {
    printGIFs(response);
  }, function(error) {
    printError(error);
  });
}

// ui logic

function printError(error) {
  document.querySelector("#output").innerText = `There was an error: ${error[1].status} ${error[1].statusText}: ${error[0].message}`;
}

function printGIFs(data) {
  if (document.querySelector(`#${data[1]}-output-wrapper`)) {
    document.querySelector(`#${data[1]}-output-wrapper`).remove();
  }
  const outputDiv = document.querySelector(`#${data[1]}-output`);
  let outputWrapper = document.createElement("div");
  outputWrapper.setAttribute("id", `${data[1]}-output-wrapper`);
  if (data[1] === "random") {
    let newGifTitle = document.createElement("h4");
    newGifTitle.innerText = data[0].data.title;
    let newGifElement = document.createElement("img");
    newGifElement.setAttribute("src", `${data[0].data.images.fixed_height.url}`);
    outputWrapper.append(newGifTitle);
    outputWrapper.append(newGifElement);
    outputDiv.append(outputWrapper);
  } else {
    for (let i = 0; i < 5; i++) {
      let newGifTitle = document.createElement("h4");
      newGifTitle.innerText = data[0].data[i].title;
      let newGifElement = document.createElement("img");
      newGifElement.setAttribute("src", `${data[0].data[i].images.fixed_height.url}`);
      outputWrapper.append(newGifTitle);
      outputWrapper.append(newGifElement);
      outputDiv.append(outputWrapper);
    }
  }
}

function handleSearch(e) {
  e.preventDefault();
  const searchTerm = document.querySelector("#gif-search").value;
  document.querySelector("#gif-search").value = null;
  getGIFs(`http://api.giphy.com/v1/gifs/search?q=${searchTerm}&api_key=${process.env.API_KEY}&limit=5`, "search");
}

function handleTrending(e) {
  e.preventDefault();
  getGIFs(`http://api.giphy.com/v1/gifs/trending?api_key=${process.env.API_KEY}&limit=5`, "trending");
}

function handleRandom(e) {
  e.preventDefault();
  getGIFs(`http://api.giphy.com/v1/gifs/random?api_key=${process.env.API_KEY}&rating=g`, "random");
}

window.addEventListener("load", function() {
  document.querySelector("#search-form").addEventListener("submit", handleSearch);
  document.querySelector("#trending-button").addEventListener("click", handleTrending);
  document.querySelector("#random-button").addEventListener("click", handleRandom);
});