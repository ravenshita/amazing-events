let urlApi = "https://mindhub-xj03.onrender.com/api/amazing";
let events = [];
let currentDate = [];
let categories = [];

async function getEvents() {
  try {
    const response = await fetch(urlApi);
    const dataApi = await response.json();
    console.log(dataApi);
    events = dataApi.events;
    currentDate = dataApi.currentDate;
    loadStaticStats();
    loadUpcomingStats();
    loadPastStats();
  } catch (error) {
    console.log(error.message);
  }
}
getEvents();

function getMaxAttendance() {
  return events.reduce((prev, curr) => {
    return (prev.assistance || prev.estimate) >
      (curr.assistance || curr.estimate)
      ? prev
      : curr;
  });
}

function getMinAttendance() {
  return events.reduce((prev, curr) => {
    return (prev.assistance || prev.estimate) <
      (curr.assistance || curr.estimate)
      ? prev
      : curr;
  });
}

function getMaxCapacity() {
  return events.reduce((prev, curr) => {
    return prev.capacity > curr.capacity ? prev : curr;
  });
}

function loadStaticStats() {
  let container = document.querySelector("#staticEvent");
  let tableBodyHTML = "";
  let maxAtendance = getMaxAttendance();
  let minAtendance = getMinAttendance();
  let maxCapacity = getMaxCapacity();
  tableBodyHTML += `
    <tr>
      <td>Event with the highest percentage of attendance</td>
      <td>Event with the lowest percentage of attendance</td>
      <td>Event with larger capacity</td>
    </tr>
    <tr>
      <td>${maxAtendance.name}</td>
      <td>${minAtendance.name}</td>
      <td>${maxCapacity.name}</td>
    </tr>`;
  container.innerHTML = tableBodyHTML;
}

// Second

function getEventsByDate(arrayData) {
  let getPastEvents = [];
  let getFutureEvents = [];

  arrayData.forEach((element) => {
    if (element.date < currentDate) {
      getPastEvents.push(element);
    } else if (element.date > currentDate) {
      getFutureEvents.push(element);
    }
  });
  return {
    getPastEvents: getPastEvents,
    getFutureEvents: getFutureEvents,
  };
}

function getPrices() {
  const eventPrices = events.map((event) => event.price);
}

function getUpcomingPrices() {
  const now = new Date();
  const futureEventPrices = events
    .filter((event) => new Date(event.date) > now)
    .map((event) => event.price);
}

function getCategoriesPrices() {
  const categoryPrices = {};

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const { category, price } = event;

    if (category in categoryPrices) {
      categoryPrices[category] += price;
    } else {
      categoryPrices[category] = price;
    }
  }
}

function getUpcomingCategoriesPrices() {
  const now = new Date();
  const upcomingEvents = events.filter((event) => new Date(event.date) >= now);

  const categoryPrices = {};

  for (let i = 0; i < upcomingEvents.length; i++) {
    const event = upcomingEvents[i];
    const { category, price, estimate } = event;

    if (category in categoryPrices) {
      categoryPrices[category] += price * estimate;
    } else {
      categoryPrices[category] = price * estimate;
    }
  }

  return categoryPrices;
}

function getEstimateByCategory(events) {
  const futureEvents = getEventsByDate(events).getFutureEvents;
  const estimateByCategory = futureEvents.reduce((acc, event) => {
    const { category, estimate } = event;
    if (!acc[category]) {
      acc[category] = [estimate];
    } else {
      acc[category].push(estimate);
    }
    return acc;
  }, {});

  return estimateByCategory;
}

function getUpcomingCapacityBycategory() {
  const futureEvents = getEventsByDate(events).getFutureEvents;
  const capacityByCategory = futureEvents.reduce((acc, event) => {
    const { category, capacity } = event;
    if (!acc[category]) {
      acc[category] = capacity;
    } else {
      acc[category] += capacity;
    }
    return acc;
  }, {});
}

function getEstimatePercentage(events) {
  const futureEvents = getEventsByDate(events).getFutureEvents;
  const capacityByCategory = {};
  const estimateByCategory = {};
  const percentageByCategory = {};

  futureEvents.forEach((event) => {
    const { category, capacity, estimate } = event;
    if (category && capacity && estimate) {
      // Verificación de nulidad
      capacityByCategory[category] =
        (capacityByCategory[category] || 0) + capacity;
      estimateByCategory[category] =
        (estimateByCategory[category] || 0) + estimate;
    }
  });

  for (let category in capacityByCategory) {
    const capacity = capacityByCategory[category];
    const estimate = estimateByCategory[category];
    const percentage = capacity !== 0 ? (estimate / capacity) * 100 : 0;
    percentageByCategory[category] = percentage;
  }

  return percentageByCategory;
}

function loadUpcomingStats() {
  let container = document.querySelector("#upcomingEvents");
  let tableBodyHTML = "";
  let upcomingPrices = getUpcomingCategoriesPrices(events);
  let upcomingPercentage = getEstimatePercentage(events);
  tableBodyHTML += `
    <tr>
      <td>Categories</td>
      <td>Revenues</td>
      <td>Percentage of attendance</td>
    </tr>`;

  for (let category in upcomingPrices) {
    tableBodyHTML += `
      <tr>
        <td>${category}</td>
        <td>${upcomingPrices[category]}</td>
        <td>${upcomingPercentage[category]}</td>
      </tr>`;
  }

  container.innerHTML = tableBodyHTML;
}

// third

function getPastPrices() {
  const now = new Date();
  const pastEventPrices = events
    .filter((event) => new Date(event.date) <= now)
    .map((event) => event.price);

  return pastEventPrices;
}

function getPastCategoriesPrices() {
  const now = new Date();
  const pastEvents = events.filter((event) => new Date(event.date) <= now);

  const categoryPrices = {};

  for (let i = 0; i < pastEvents.length; i++) {
    const event = pastEvents[i];
    const { category, price, assistance } = event;

    if (category in categoryPrices) {
      categoryPrices[category] += price * assistance;
    } else {
      categoryPrices[category] = price * assistance;
    }
  }

  return categoryPrices;
}

function getAssistanceByCategory(events) {
  const pastEvents = getEventsByDate(events).getPastEvents;
  const assistanceByCategory = pastEvents.reduce((acc, event) => {
    const { category, assistance } = event;
    if (!acc[category]) {
      acc[category] = [assistance];
    } else {
      acc[category].push(assistance);
    }
    return acc;
  }, {});

  return assistanceByCategory;
}

function getPastCapacityBycategory() {
  const pastEvents = getEventsByDate(events).getPastEvents;
  const capacityByCategory = pastEvents.reduce((acc, event) => {
    const { category, capacity } = event;
    if (!acc[category]) {
      acc[category] = capacity;
    } else {
      acc[category] += capacity;
    }
    return acc;
  }, {});
}

function getAssistancePercentage(events) {
  const pastEvents = getEventsByDate(events).getPastEvents;
  const capacityByCategory = {};
  const assistanceByCategory = {};
  const percentageByCategory = {};

  pastEvents.forEach((event) => {
    const { category, capacity, assistance } = event;
    if (category && capacity && assistance) {
      // Verificación de nulidad
      capacityByCategory[category] =
        (capacityByCategory[category] || 0) + capacity;
      assistanceByCategory[category] =
        (assistanceByCategory[category] || 0) + assistance;
    }
  });

  for (let category in capacityByCategory) {
    const capacity = capacityByCategory[category];
    const assistance = assistanceByCategory[category];
    const percentage = capacity !== 0 ? (assistance / capacity) * 100 : 0;
    percentageByCategory[category] = percentage;
  }

  return percentageByCategory;
}

function loadPastStats() {
  let container = document.querySelector("#pastEvents");
  let tableBodyHTML = "";
  let pastPrices = getPastCategoriesPrices(events);
  let assistancePercentage = getAssistancePercentage(events);
  tableBodyHTML += `
    <tr>
      <td>Categories</td>
      <td>Revenues</td>
      <td>Percentage of attendance</td>
    </tr>`;

  for (let category in pastPrices) {
    tableBodyHTML += `
        <tr>
          <td>${category}</td>
          <td>${pastPrices[category]}</td>
          <td>${assistancePercentage[category]}</td>
        </tr>`;
  }
  container.innerHTML = tableBodyHTML;
}
