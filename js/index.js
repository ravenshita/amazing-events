let urlApi = "https://mindhub-xj03.onrender.com/api/amazing";
let events = [];

const cards = document.getElementById("cardsTemplate");
const inputSearch = document.querySelector("[dataSearch]");
const inputChecks = document.getElementById("categories");

// Events

inputSearch.addEventListener("input", doubleCheck);

inputChecks.addEventListener("change", doubleCheck);

//Functions

async function getEvents() {
  try {
    const response = await fetch(urlApi);
    const dataApi = await response.json();
    console.log(dataApi);
    events = dataApi.events;
    paintData(events);
    paintCheckbox(events);
  } catch (error) {
    console.log(error.message);
  }
}
getEvents();

function paintData(arrayData) {
  if (arrayData.length == 0) {
    cards.innerHTML = "<h3 class='searchError'>No matches found</h3>";
    return;
  }
  let cardsTemplate = ``;
  arrayData.forEach((element) => {
    cardsTemplate += `
                    <div class="card" style="width: 18rem;">
                      <img src="${element.image}" class="card-img-top" alt="">
                        <div class="card-body">
                          <h5 class="card-title">${element.name}</h5>
                          <h6 class="cardCategories">${element.category}</h6>
                           <p class="card-text">${element.description}</p>
                           <div class="moreDetails">
                           <div class="moreDetails1">
                           <h6>Date:</h6>
                           <p class="card-text">${element.date}</p>
                           </div>
                           <div class="moreDetails2">
                           <h6>Place:</h6>
                           <p class="card-text">${element.place}</p>
                           </div>
                           </div>
                        </div>
                      <div class="card-footer">
                         <small class="text-muted"> Price: ${element.price} </small>
                          <a href="./details.html?id=${element._id}" class="btn btn-primary">More details</a>
                       </div>
                   </div>`;
  });
  cards.innerHTML = cardsTemplate;
}

function textFilter(arrayData, text) {
  let arrayFiltered = arrayData.filter((element) =>
    element.name.toLowerCase().includes(text.toLowerCase())
  );
  return arrayFiltered;
}

function paintCheckbox(arrayData) {
  let checks = ``;
  let repeatedCategory = arrayData.map((element) => element.category);
  let categories = new Set(
    repeatedCategory.sort((a, b) => {
      if (a > b) {
        return 1;
      }
      if (a < b) {
        return -1;
      }
      return 0;
    })
  );
  categories.forEach((element) => {
    checks += `
       <div class="categories">
       <input checksData class="form-check-input" type="checkbox" name="Category" id="${element}"
        value="${element}" />
       <label class="form-check-label" for=${element}>${element}</label>
       </div>
       `;
  });
  inputChecks.innerHTML = checks;
}

function categoriesFilter(arrayData) {
  let checkboxes = document.querySelectorAll("[checksData]");
  let arrayChecks = Array.from(checkboxes);
  let checksChecked = arrayChecks.filter((check) => check.checked);
  if (checksChecked == 0) {
    return arrayData;
  }
  let checkValues = checksChecked.map((check) => check.value);
  let filteredArray = arrayData.filter((element) =>
    checkValues.includes(element.category)
  );
  return filteredArray;
}

function doubleCheck() {
  let arrayFiltered1 = textFilter(events, inputSearch.value);
  let arrayFiltered2 = categoriesFilter(arrayFiltered1);
  paintData(arrayFiltered2);
}
