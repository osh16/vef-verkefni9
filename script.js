const API_URL = "https://apis.is/isnic?domain=";
const domains = document.querySelector(".domains");

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector("form");
  init(form);
});

function init(form) {
  let button = form.querySelector("button");
  button.addEventListener("click", submitLink);
}

function submitLink(e) {
  e.preventDefault();
  clear();// hreinsum allt i results
  let input = this.previousElementSibling;
  loading();
  getInfo(input.value);
}

function loading() {
  clear();
  let container = domains.querySelector(".results");
  let img =  container.appendChild(document.createElement("img"));
  img.setAttribute("src","loading.gif");
  container.appendChild(img);
}

// saekjum gognin
function getInfo(url) {
  fetch(`${API_URL}${url}`)
    .then(response => {
      if (response.status == 431) {
        displayError("Tharf ad vera strengur"); 
        throw new Error();
      } else if (!response.ok) {
        displayError("Villa ad saekja gogn");
        throw new Error();
      } else {
        return response.json();
      }
    })
    .then(data => {
      if ((data.results).length == 0) {
        displayError("Fannst ekki");
        throw new Error();
      } else {
        processInfo(data.results);
      }
    })
    .catch(() => {
      throw new Error();
    });
}

// vinnum ur gognunum
function processInfo(data) {
  clear();


  let container = domains.querySelector(".results");
  let dl = document.createElement("dl");

  // buum til breytur fyrir oll json gognin
  let [{
    domain, registrantname, address, city,
    postalCode, country, phone, email,
    registered, expires, lastChange
  }] = data;

  // smidum dl med thessum breytum
  createItem(dl,"Lén",domain);
  createItem(dl,"Skráð",formatDate(registered));
  createItem(dl,"Seinast breytt",formatDate(lastChange));
  createItem(dl,"Rennur út",formatDate(expires));
  createItem(dl,"Skráningaraðili",registrantname);
  createItem(dl,"Netfang",email);
  createItem(dl,"Heimilisfang",address);
  createItem(dl,"Land",country);
  
  // birtum gognin
  container.appendChild(dl);
}

function createItem(dl,string,data) {
  // smidum item bara ef einhver gogn eru til stadar
  if (data) {
    let dt = dl.appendChild(document.createElement("dt"));
    let dd = dl.appendChild(document.createElement("dd"));
    dt.appendChild(document.createTextNode(string));
    dd.appendChild(document.createTextNode(data));
  }
}

function displayError(msg) {
  clear();
  let container = domains.querySelector(".results");
  let p =  container.appendChild(document.createElement("p"));
  p.appendChild(document.createTextNode(msg));
}

function formatDate(date) {
  date = date.replace(".","");
  return new Date(date).toISOString().split("T")[0];
}

// hreinsa results
function clear() {
  let container = domains.querySelector(".results");
  container.innerHTML = "";
}
