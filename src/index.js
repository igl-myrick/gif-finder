import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./css/styles.css";

// business logic

function getGIFs(requestURL, query) {
  let request = new XMLHttpRequest();
  const url = requestURL;

  request.addEventListener("loadend", function() {
    const response = JSON.parse(this.responseText);
    if (this.status === 200) {
      printGIFs(response, query);
    } else {
      printError(this, response);
    }
  });

  request.open("GET", url, true);
  request.send();
}

// ui logic

function printError(request, apiResponse) {
  document.querySelector("#output").innerText = `There was an error: ${request.status} ${request.statusText}: ${apiResponse.message}`;
}

function printGIFs(apiResponse, query) {
  if (document.querySelector(`#${query}-output-wrapper`)) {
    document.querySelector(`#${query}-output-wrapper`).remove();
  }
  const outputDiv = document.querySelector(`#${query}-output`);
  let outputWrapper = document.createElement("div");
  outputWrapper.setAttribute("id", `${query}-output-wrapper`);
  for (let i = 0; i < 5; i++) {
    let newGifTitle = document.createElement("h4");
    newGifTitle.innerText = apiResponse.data[i].title;
    let newGifElement = document.createElement("img");
    newGifElement.setAttribute("src", `${apiResponse.data[i].images.fixed_height.url}`);
    outputWrapper.append(newGifTitle);
    outputWrapper.append(newGifElement);
    outputDiv.append(outputWrapper);
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

window.addEventListener("load", function() {
  document.querySelector("#search-form").addEventListener("submit", handleSearch);
  document.querySelector("#trending-button").addEventListener("click", handleTrending);
});