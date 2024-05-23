import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./css/styles.css";

// business logic

function getGIFs(searchTerm) {
  let request = new XMLHttpRequest();
  const url = `http://api.giphy.com/v1/gifs/search?q=${searchTerm}&api_key=${process.env.API_KEY}&limit=5`;

  request.addEventListener("loadend", function() {
    const response = JSON.parse(this.responseText);
    if (this.status === 200) {
      printGIFs(response, searchTerm);
    } else {
      printError(this, response, searchTerm);
    }
  });

  request.open("GET", url, true);
  request.send();
}

// ui logic

function printError(request, apiResponse, searchTerm) {
  document.querySelector("#output").innerText = `There was an error searching for ${searchTerm}: ${request.status} ${request.statusText}: ${apiResponse.message}`;
}

function printGIFs(apiResponse) {
  const outputDiv = document.querySelector("#output");
  let outputWrapper = document.createElement("div");
  outputWrapper.setAttribute("id", "output-wrapper");
  apiResponse.data.forEach(function(element, index) {
    let newGifTitle = document.createElement("h4");
    newGifTitle.innerText = apiResponse.data[index].title;
    let newGifElement = document.createElement("img");
    newGifElement.setAttribute("src", `${apiResponse.data[index].images.fixed_height.url}`);
    outputWrapper.append(newGifTitle);
    outputWrapper.append(newGifElement);
    outputDiv.append(outputWrapper);
  });
}

function handleFormSubmission(e) {
  e.preventDefault();
  const searchTerm = document.querySelector("#gif-search").value;
  document.querySelector("#gif-search").value = null;
  getGIFs(searchTerm);
}

window.addEventListener("load", function() {
  document.querySelector("#search-form").addEventListener("submit", handleFormSubmission);
});