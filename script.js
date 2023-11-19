// Array to store information about events
const eventsArray = [];
let countdownInterval;

// Load events from local storage when the page is loaded
document.addEventListener("DOMContentLoaded", function () {
  const storedEvents = JSON.parse(localStorage.getItem("eventsArray")) || [];
  storedEvents.forEach((storedEvent) => {
    addStoredEvent(storedEvent);
  });
});

// Function to add a stored event
function addStoredEvent(storedEvent) {
  const eventContainer = document.createElement("div");
  eventContainer.className = "event-container";

  const countdownContainer = document.createElement("div");
  countdownContainer.className = "event";

  const closeButton = document.createElement("button");
  closeButton.innerHTML = `<div class="gif-container2" class="addEventButton" onclick="removeEvent()">
        <img class="static-image2" src="./trash-bin.png" alt="Static Image">
        <img class="gif2" src="./trash-bin.gif" alt="Animated GIF">
    </div>`;
  closeButton.onclick = function () {
    clearInterval(countdownInterval);
    eventContainer.remove();
    const index = eventsArray.findIndex(
      (event) => event.container === eventContainer
    );
    if (index !== -1) {
      eventsArray.splice(index, 1);
    }
    sortAndUpdateUI();
    saveEventsToLocalStorage();
  };

  eventContainer.appendChild(countdownContainer);
  eventContainer.appendChild(closeButton);

  document.querySelector(".eventsCountDown").appendChild(eventContainer);

  eventsArray.push({
    name: storedEvent.name,
    container: eventContainer,
    countdownContainer: countdownContainer,
    remainingTime: storedEvent.remainingTime,
  });

countdownInterval = setInterval(() => {
    eventsArray.forEach((event) => {
      event.remainingTime = countRemainingTime(
        event.countdownContainer,
        event.name,
        event.remainingTime
      );
    });

    sortAndUpdateUI();

    const hasEventStarted = eventsArray.some(event => event.remainingTime <= 0);
        if (hasEventStarted) {
            const startedEvent = eventsArray.find(event => event.remainingTime <= 0);
            if (startedEvent) {
                startedEvent.container.remove();
                const index = eventsArray.indexOf(startedEvent);
                if (index !== -1) {
                    eventsArray.splice(index, 1);
                }
                clearInterval(countdownInterval);
                saveEventsToLocalStorage();
            }
        }
  }, 1000);
}

// Function to add a new event
function addEvent() {
  const eventName = document.getElementById("event").value;
  const dateTime = document.getElementById("date-time").value;
  const eventTimeInSecond = new Date(dateTime).getTime() / 1000;
  const currentTime = new Date().toLocaleString();
  const currentTimeInSecond = new Date(currentTime).getTime() / 1000;

  if (eventTimeInSecond <= currentTimeInSecond) {
    console.log("Select a future event, not a past event");
    showWarning("Please select a future date and time.");
    return;
  }

  if (eventName.length <= 0) {
    console.log("Please Enter a event name");
    showWarning("Please Enter a event name.");
    return;
  }

  const eventContainer = document.createElement("div");
  eventContainer.className = "event-container";

  const countdownContainer = document.createElement("div");
  countdownContainer.className = "event";

  const closeButton = document.createElement("button");
  closeButton.innerHTML = `<div class="gif-container2" class="addEventButton">
        <img class="static-image2" src="./trash-bin.png" alt="Static Image">
        <img class="gif2" src="./trash-bin.gif" alt="Animated GIF">
    </div>`;
  closeButton.onclick = function () {
    clearInterval(countdownInterval);
    eventContainer.remove();
    const index = eventsArray.findIndex(
      (event) => event.container === eventContainer
    );
    if (index !== -1) {
      eventsArray.splice(index, 1);
    }
    sortAndUpdateUI();
    saveEventsToLocalStorage();
  };

  eventContainer.appendChild(countdownContainer);
  eventContainer.appendChild(closeButton);

  document.querySelector(".eventsCountDown").appendChild(eventContainer);

  const remainingTime = eventTimeInSecond - currentTimeInSecond;

  eventsArray.push({
    name: eventName,
    container: eventContainer,
    countdownContainer: countdownContainer,
    remainingTime: remainingTime,
  });

  sortAndUpdateUI();

countdownInterval = setInterval(() => {
    eventsArray.forEach((event) => {
      event.remainingTime = countRemainingTime(
        event.countdownContainer,
        event.name,
        event.remainingTime
      );
    });

    sortAndUpdateUI();

    const hasEventStarted = eventsArray.some(
      (event) => event.remainingTime <= 0
    );
    if (hasEventStarted) {
      // Find and remove the first event that has started
      const startedEvent = eventsArray.find(
        (event) => event.remainingTime <= 0
      );
      if (startedEvent) {
        startedEvent.container.remove();

        // Remove the event from the array
        const index = eventsArray.indexOf(startedEvent);
        if (index !== -1) {
          eventsArray.splice(index, 1);
        }

        clearInterval(countdownInterval);
        saveEventsToLocalStorage();
      }
    }
  }, 1000);

  document.getElementById("event").value = "";
  document.getElementById("date-time").value = "";
}

// Function to save events to local storage
function saveEventsToLocalStorage() {
  localStorage.setItem("eventsArray", JSON.stringify(eventsArray));
}

function countRemainingTime(countdownContainer, eventName, time) {
  updateCountdownUI(countdownContainer, eventName, time - 1);
  return time - 1;
}

function updateCountdownUI(countdownContainer, eventName, time) {
  const days = Math.floor(time / (24 * 60 * 60));
  const hours = Math.floor((time % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((time % (60 * 60)) / 60);
  const seconds = Math.floor(time % 60);

  countdownContainer.innerHTML = `<h2 class="title">${eventName}</h2>  <div class="time-container">
    <span><p class="time">${days}</p> <p>Days</p></span>
<span><p class="time">${hours}</p> <p>Hours</p></span>
<span><p class="time">${minutes}</p> <p>Minutes</p></span>
<span><p class="time">${seconds}</p> <p>Seconds</p></span>
</div>`;
}

function showWarning(message) {
  const warningContainer = document.createElement("div");
  warningContainer.className = "warning";
  warningContainer.innerHTML = message;

  const addEventContainer = document.querySelector(".eventsCountDown");
  addEventContainer.appendChild(warningContainer);

  // Remove the warning after 3 seconds
  setTimeout(() => {
    addEventContainer.removeChild(warningContainer);
  }, 3000);
}

function sortAndUpdateUI() {
  // Sort the eventsArray based on remaining time
  eventsArray.sort((a, b) => a.remainingTime - b.remainingTime);

  // Update the UI based on the sorted array
  const eventsCountDownContainer = document.querySelector(".eventsCountDown");
  eventsCountDownContainer.innerHTML = ""; // Clear the existing content

  eventsArray.forEach((event) => {
    eventsCountDownContainer.appendChild(event.container);
  });
}
