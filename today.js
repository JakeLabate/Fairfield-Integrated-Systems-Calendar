const EVENT_URL = "https://hook.us1.make.com/s7p9n5gdm4ixpewou15lueojpboa9f3s";
const DELETE_EVENT_URL =
  "https://hook.us1.make.com/mira76whs1tlorhfgf4sl7y51emexlt9";

setInterval(() => {
  document.querySelector("#date-header .date").innerHTML =
    dayjs().format("dddd, MMMM D, YYYY");
  document.querySelector("#date-header .time").innerHTML =
    dayjs().format("h:mm:ss A");
}, 1000);

function addEventCard(event) {
  const body = document.getElementsByTagName("body")[0];

  const newEventElement = document.createElement("div");
  newEventElement.id = event.id;
  newEventElement.setAttribute("data-payload", JSON.stringify(event));
  newEventElement.classList.add("event-container");
  newEventElement.style.flex = event.duration;
  newEventElement.style.backgroundColor = event.eventColor.backgroundColor;
  newEventElement.style.color = event.eventColor.textColor;

  newEventElement.addEventListener("click", handleClick);

  const parsedTime = {
    startTime: dayjs(event.time.startTime, "HH:mm"),
    endTime: dayjs(event.time.endTime, "HH:mm"),
  };
  const formattedTime = {
    startTime: dayjs(parsedTime.startTime).format("h:mm A"),
    endTime: dayjs(parsedTime.endTime).format("h:mm A"),
  };
  let innerHTML = `
  <div class="datetime">
    <span>${formattedTime.startTime}</span> to <span>${formattedTime.endTime}</span>
  </div>
  <div class="event-info">
  `;
  if (event.toDo) {
    innerHTML += `
    <div class="project">
    ${event.toDo.name}
    </div>`;
  }
  if (event.vehicles) {
    innerHTML += `
    <div class="vehicle">
      ${event.vehicles.map((el) => el.name).join(", ")}
    </div>`;
  }
  if (Array.isArray(event.teamMembers) && event.teamMembers.length > 0) {
    innerHTML += `
      <div class="team">
      ${event.teamMembers.map((el) => el.name).join(", ")}
      </div>`;
  }
  if (event.eventNote) {
    innerHTML += `
    <div class="event-note">
      Note: ${event.eventNote}
    </div>`;
  }
  innerHTML += `
  <div class="delete-icon" data-eventID=${event.eventID} data-id=${event.id} onclick="handleClick(event)">
		<svg class="fill-${event.eventColor?.textColor}" viewbox="0 0 875 1000" xmlns="http://www.w3.org/2000/svg">
			<path
			d="M0 281.296l0 -68.355q1.953 -37.107 29.295 -62.496t64.449 -25.389l93.744 0l0 -31.248q0 -39.06 27.342 -66.402t66.402 -27.342l312.48 0q39.06 0 66.402 27.342t27.342 66.402l0 31.248l93.744 0q37.107 0 64.449 25.389t29.295 62.496l0 68.355q0 25.389 -18.553 43.943t-43.943 18.553l0 531.216q0 52.731 -36.13 88.862t-88.862 36.13l-499.968 0q-52.731 0 -88.862 -36.13t-36.13 -88.862l0 -531.216q-25.389 0 -43.943 -18.553t-18.553 -43.943zm62.496 0l749.952 0l0 -62.496q0 -13.671 -8.789 -22.46t-22.46 -8.789l-687.456 0q-13.671 0 -22.46 8.789t-8.789 22.46l0 62.496zm62.496 593.712q0 25.389 18.553 43.943t43.943 18.553l499.968 0q25.389 0 43.943 -18.553t18.553 -43.943l0 -531.216l-624.96 0l0 531.216zm62.496 -31.248l0 -406.224q0 -13.671 8.789 -22.46t22.46 -8.789l62.496 0q13.671 0 22.46 8.789t8.789 22.46l0 406.224q0 13.671 -8.789 22.46t-22.46 8.789l-62.496 0q-13.671 0 -22.46 -8.789t-8.789 -22.46zm31.248 0l62.496 0l0 -406.224l-62.496 0l0 406.224zm31.248 -718.704l374.976 0l0 -31.248q0 -13.671 -8.789 -22.46t-22.46 -8.789l-312.48 0q-13.671 0 -22.46 8.789t-8.789 22.46l0 31.248zm124.992 718.704l0 -406.224q0 -13.671 8.789 -22.46t22.46 -8.789l62.496 0q13.671 0 22.46 8.789t8.789 22.46l0 406.224q0 13.671 -8.789 22.46t-22.46 8.789l-62.496 0q-13.671 0 -22.46 -8.789t-8.789 -22.46zm31.248 0l62.496 0l0 -406.224l-62.496 0l0 406.224zm156.24 0l0 -406.224q0 -13.671 8.789 -22.46t22.46 -8.789l62.496 0q13.671 0 22.46 8.789t8.789 22.46l0 406.224q0 13.671 -8.789 22.46t-22.46 8.789l-62.496 0q-13.671 0 -22.46 -8.789t-8.789 -22.46zm31.248 0l62.496 0l0 -406.224l-62.496 0l0 406.224z" />
		</svg>
	</div>
  `;
  innerHTML += "</div>"; // Closing the event info tag
  newEventElement.innerHTML = innerHTML;
  body.appendChild(newEventElement);
}

function getTimeDuration(time = {}) {
  const startTime = dayjs(time.startTime, "HH:mm");
  const endTime = dayjs(time.endTime, "HH:mm");
  return Math.abs(endTime.diff(startTime, "m"));
}

function toggleModal(modalID = "modal-edit") {
  const modal = document.getElementById(modalID);
  if (modal.style.display === "none") {
    modal.style.display = "flex";
  } else {
    modal.style.display = "none";
  }
}

function showSnackbar({ message, timeout = 5000 } = {}) {
  let snackbar = document.getElementById("snackbar");
  snackbar.innerText = message;
  snackbar.className = "show";

  setTimeout(function () {
    snackbar.className = snackbar.className.replace("show", "");
  }, timeout);
}

function getProjects() {
  const projectOptions = {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "X-DTSI-ApiKey": "s0vAAip0W0uwXkKDO5JpGwSXgLYj6cokGrs2LUHi8P0g",
    },
  };
  return new Promise((resolve) => {
    fetch("https://api.d-tools.com/SI/Subscribe/Projects", projectOptions)
      .then((response) => response.json())
      .then((data) => {
        resolve(data.Projects);
      });
  });
}

// GET list of TASKS from D-Tools
function getTasks() {
  const taskOptions = {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "X-DTSI-ApiKey": "s0vAAip0W0uwXkKDO5JpGwSXgLYj6cokGrs2LUHi8P0g",
    },
  };
  return new Promise((resolve) => {
    fetch("https://api.d-tools.com/SI/Subscribe/Tasks", taskOptions)
      .then((response) => response.json())
      .then((data) => {
        resolve(data.Tasks);
      });
  });
}

// GET list of SERVICE ORDERS from D-Tools
function getServiceOrders() {
  const serviceOptions = {
    method: "GET",
    headers: {
      "content-type": "application/json",
      "X-DTSI-ApiKey": "s0vAAip0W0uwXkKDO5JpGwSXgLYj6cokGrs2LUHi8P0g",
    },
  };
  return new Promise((resolve) => {
    fetch("https://api.d-tools.com/SI/Subscribe/ServiceOrders", serviceOptions)
      .then((response) => response.json())
      .then((data) => {
        resolve(data.ServiceOrders);
      });
  });
}

async function getAllData() {
  const promiseArray = [];
  promiseArray.push(getProjects());
  promiseArray.push(getTasks());
  promiseArray.push(getServiceOrders());
  promiseArray.push(getTeamMembers());
  promiseArray.push(getVehicles());

  const [projects, tasks, serviceOrders, teamMembers, vehicles] =
    await Promise.all(promiseArray);

  setOptions({
    selectTagId: "todo",
    optionsArray: projects,
    idKey: "Id",
    labelKeys: ["Name"],
    dummyOptionValue: "Projects",
  });
  setOptions({
    selectTagId: "todo",
    optionsArray: tasks,
    idKey: "Id",
    labelKeys: ["Name"],
    dummyOptionValue: "Tasks",
  });
  setOptions({
    selectTagId: "todo",
    optionsArray: serviceOrders,
    idKey: "Id",
    labelKeys: ["Name"],
    dummyOptionValue: "Service Orders",
  });
  ["vehicle1", "vehicle2"].forEach((id) => {
    setOptions({
      selectTagId: id,
      optionsArray: vehicles,
      idKey: "id",
      labelKeys: ["vehicleName"],
    });
  });
  ["teammember1", "teammember2", "teammember3", "teammember4"].forEach((id) => {
    setOptions({
      selectTagId: id,
      optionsArray: teamMembers,
      idKey: "id",
      labelKeys: ["firstName", "lastName"],
    });
  });
}

function setOptions({
  selectTagId,
  optionsArray,
  idKey,
  labelKeys,
  dummyOptionValue,
}) {
  const selectTag = document.querySelector(`select#${selectTagId}`);
  if (dummyOptionValue) {
    const dummyOption = document.createElement("option");
    dummyOption.value = "";
    dummyOption.innerHTML = dummyOptionValue;
    dummyOption.disabled = true;
    selectTag.appendChild(dummyOption);
  }
  optionsArray.forEach((val) => {
    const option = document.createElement("option");
    option.id = val[idKey];
    option.setAttribute("data-payload", JSON.stringify(val));
    const labels = labelKeys.map((key) => val[key]);
    option.value = val[idKey];
    option.innerHTML = labels.join(" ");
    selectTag.appendChild(option);
  });
}

function handleClick(e) {
  e.stopPropagation();
  if (e.currentTarget.hasAttribute("data-payload")) {
    editEvent(e);
  } else {
    deleteEvent(e);
  }
}

function editEvent(e) {
  const eventContainer = e.currentTarget;
  window.selectedEvent = JSON.parse(
    eventContainer.getAttribute("data-payload")
  );
  toggleModal("modal-edit");
  selectOption({
    selectTagId: "todo",
    optionId: selectedEvent.toDo ? selectedEvent.toDo.id : 0,
  });
  if (selectedEvent.vehicle) {
    selectOption({
      selectTagId: "vehicle1",
      optionId: selectedEvent.vehicle ? selectedEvent.vehicle.id : 0,
    });
  } else if (selectedEvent.vehicles) {
    selectedEvent.vehicles.forEach((vehicle, index) => {
      selectOption({
        selectTagId: `vehicle${index + 1}`,
        optionId: vehicle.id,
      });
    });
  }
  if (selectedEvent.teamMembers) {
    selectedEvent.teamMembers.forEach((teamMember, index) => {
      selectOption({
        selectTagId: `teammember${index + 1}`,
        optionId: teamMember.id,
      });
    });
  }
  document.querySelector(".modal #repeatInput").value = selectedEvent.repeat;
  document.querySelector(".modal #startTime").value =
    selectedEvent.time.startTime;
  document.querySelector(".modal #endTime").value = selectedEvent.time.endTime;

  const { seconds, nanoseconds } = selectedEvent.time.date;
  const date = new Date(seconds * 1000 + nanoseconds);

  document.querySelector(".modal #eventDate").value = date
    .toISOString()
    .substring(0, 10);
  document.querySelector(".modal #eventNote").value =
    selectedEvent.eventNote || "";
}

function selectOption({ selectTagId, optionId }) {
  const selectElement = document.querySelector(`select#${selectTagId}`);
  if (optionId === 0) {
    selectElement.selectedIndex = 0;
    return;
  }

  const options = Array.from(selectElement.options);
  const index = options.findIndex((el) => el.id === optionId);
  selectElement.selectedIndex = index;
}

function padZero(val) {
  if (val && val < 10) {
    return "0" + val;
  }
  return val;
}

function resetModalForm() {
  const selects = Array.from(document.querySelectorAll("select"));
  selects.forEach((select) => {
    select.selectedIndex = 0;
  });
  const today = new Date();
  document.querySelector(
    ".modal #eventDate"
  ).value = `${today.getFullYear()}-${padZero(today.getMonth() + 1)}-${padZero(
    today.getDate()
  )}`;
  document.querySelector(".modal #startTime").value = "08:00";
  document.querySelector(".modal #endTime").value = "17:00";
}

function closeForm() {
  resetModalForm();
  toggleModal("modal-edit");
}

function updateCalendarEvent(payload) {
  const { date, startTime, endTime } = payload.time;
  const start = date.toISOString().substring(0, 11) + startTime;
  const end = date.toISOString().substring(0, 11) + endTime;
  let repeat = payload.repeat;
  if (date.getDay() === 0 || date.getDay() === 6) {
    repeat = repeat - 1;
  }

  const eventOptions = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ ...payload, time: { start, end }, repeat }),
  };

  return new Promise((resolve) => {
    fetch(EVENT_URL, eventOptions)
      .then((res) => res.json())
      .then((data) => resolve(data));
  });
}

function getSelectedOption({ selectTagId }) {
  const selectElement = document.querySelector(`select#${selectTagId}`);
  const options = Array.from(selectElement.options);
  if (selectElement.selectedIndex > 0) {
    return options[selectElement.selectedIndex];
  }
}

function isTimeEntryValid() {
  const startTime = document.querySelector(".modal #startTime").value;
  const endTime = document.querySelector(".modal #endTime").value;

  const startTimeSplit = startTime.split(":").map(Number);
  const endTimeSplit = endTime.split(":").map(Number);

  const startTimeInMinutes = startTimeSplit[0] * 60 + startTimeSplit[1];
  const endTimeInMinutes = endTimeSplit[0] * 60 + endTimeSplit[1];

  return startTimeInMinutes <= endTimeInMinutes;
}

function updateEvent() {
  if (!isTimeEntryValid()) {
    alert("Start time should be before end time!");
    return;
  }

  const payload = {
    eventColor: {
      backgroundColor: "white",
      textColor: "black",
    },
  };
  let buffer;
  let empty = true;
  const newTodo = getSelectedOption({ selectTagId: "todo" });
  const newVehiclesList = [1, 2].reduce((acc, val) => {
    const option = getSelectedOption({ selectTagId: `vehicle${val}` });
    if (option) {
      acc.push(option);
    }
    return acc;
  }, []);
  const teamMemersList = [1, 2, 3, 4].reduce((acc, val) => {
    const option = getSelectedOption({ selectTagId: `teammember${val}` });
    if (option) {
      acc.push(option);
    }
    return acc;
  }, []);
  const eventNote = document.querySelector(".modal #eventNote").value;

  if (newTodo) {
    buffer = JSON.parse(newTodo.getAttribute("data-payload"));
    payload.toDo = {
      id: buffer.Id,
      name: buffer.Name,
      type: buffer.type,
      progress: buffer.Progress,
      description: buffer.Description,
    };
    payload.eventColor = colorPairs[hash_fn(buffer.Id)];
    if (buffer.type === "Project") {
      payload.toDo.client = {
        name: buffer.Client,
        id: buffer.ClientId,
      };
    }
    empty = false;
  }
  if (newVehiclesList.length > 0) {
    payload.vehicles = [];
    newVehiclesList.forEach((vehicle) => {
      if (!vehicle) {
        return;
      }

      buffer = JSON.parse(vehicle.getAttribute("data-payload"));
      payload.vehicles.push({
        id: buffer.id,
        name: buffer.vehicleName,
        vin: buffer.vin,
        license: buffer.license,
      });
    });
    empty = false;
  }
  if (teamMemersList.length > 0) {
    payload.teamMembers = [];
    teamMemersList.forEach((newTeamMember) => {
      if (!newTeamMember) {
        return;
      }
      buffer = JSON.parse(newTeamMember.getAttribute("data-payload"));
      payload.teamMembers.push({
        id: buffer.id,
        name: `${buffer.firstName} ${buffer.lastName}`,
        email: buffer.email,
      });
    });
    empty = false;
  }

  if (empty) {
    // if all the drop locations are empty
    alert("No data selected");
    return;
  } else if (!confirm("Are you sure you want to update the event?")) {
    return;
  }

  payload.time = {
    date: new Date(document.querySelector(".modal #eventDate").value),
    startTime: document.querySelector(".modal #startTime").value,
    endTime: document.querySelector(".modal #endTime").value,
  };

  const repeat = parseInt(
    document.querySelector(".modal #repeatInput").value,
    10
  );
  if (!repeat || repeat <= 1) {
    payload.repeat = 1;
  } else {
    payload.repeat = repeat;
  }
  payload.repeatDates = createRepeatDates(payload.time.date, payload.repeat);
  payload.eventID = selectedEvent.eventID;
  payload.id = selectedEvent.id;

  payload.eventNote = eventNote;

  replaceUndefined(payload); // Because undefined values are not allowed.

  updateCalendarEvent(payload)
    .then((data) => updateEventInDatabase({ ...payload, ...data }))
    .then((res) => {
      getEvents();
      toggleModal("modal-edit");
      showSnackbar({ message: "Event updated successfully" });
    })
    .catch((err) => {
      console.log(err);
      alert("Failed to update the event");
    });
}

function createRepeatDates(startDate, repeatDays = 1) {
  // Include the start date as well
  const repeatDatesArr = [startDate];
  const date = new Date(startDate);
  while (repeatDays > 1) {
    const currentDate = date.getDate();
    date.setDate(currentDate + 1);
    if (date.getDay() !== 0 && date.getDay() !== 6) {
      repeatDatesArr.push(new Date(date));
      repeatDays--;
    }
  }
  return repeatDatesArr;
}

function replaceUndefined(obj, replaceToken = "") {
  Object.keys(obj).forEach(function (key) {
    let value = obj[key];
    let type = typeof value;
    if (type === "object") {
      replaceUndefined(obj[key], replaceToken);
    } else if (type === "undefined") {
      obj[key] = replaceToken;
    }
  });
}

const NUMBER_OF_COLORS = 20;
// The following is a hash function with good distribution and less collision
function hash_fn(s) {
  const range = NUMBER_OF_COLORS - 1;
  // Initialize the seed value to 0
  let seed = 0;
  // Convert the input string to a typed array
  let data = new TextEncoder().encode(s);
  // Compute the hash value using the typed array
  let hash = murmur2_impl(data, seed);
  // Take the modulus of the hash value with 19 and add 1 to ensure that the result is in the range from 1 to 19
  return (hash % range) + (hash < 0 ? range : 0);
}

// Define a function to compute the MurmurHash2 value of an array of bytes
function murmur2_impl(data, seed) {
  let m = 0x5bd1e995;
  let r = 24;
  let h = seed ^ data.length;
  let k;
  for (let i = 0; i < data.length; i += 4) {
    k = data[i];
    if (i + 1 < data.length) {
      k |= data[i + 1] << 8;
    }
    if (i + 2 < data.length) {
      k |= data[i + 2] << 16;
    }
    if (i + 3 < data.length) {
      k |= data[i + 3] << 24;
    }
    k = Math.imul(k, m);
    k ^= k >>> r;
    k = Math.imul(k, m);
    h = Math.imul(h, m);
    h ^= k;
  }
  h ^= h >>> 13;
  h = Math.imul(h, m);
  h ^= h >>> 15;
  return h;
}

const colorPairs = [
  {
    backgroundColor: "turquoise",
    textColor: "black",
  },
  {
    backgroundColor: "salmon",
    textColor: "black",
  },
  {
    backgroundColor: "red",
    textColor: "white",
  },
  {
    backgroundColor: "green",
    textColor: "white",
  },
  {
    backgroundColor: "blue",
    textColor: "white",
  },
  {
    backgroundColor: "palevioletred",
    textColor: "white",
  },
  {
    backgroundColor: "brown",
    textColor: "white",
  },
  {
    backgroundColor: "yellow",
    textColor: "black",
  },
  {
    backgroundColor: "purple",
    textColor: "white",
  },
  {
    backgroundColor: "orange",
    textColor: "black",
  },
  {
    backgroundColor: "pink",
    textColor: "black",
  },
  {
    backgroundColor: "olive",
    textColor: "white",
  },
  {
    backgroundColor: "navy",
    textColor: "white",
  },
  {
    backgroundColor: "maroon",
    textColor: "white",
  },
  {
    backgroundColor: "teal",
    textColor: "white",
  },
  {
    backgroundColor: "peachpuff",
    textColor: "black",
  },
  {
    backgroundColor: "mediumorchid",
    textColor: "white",
  },
  {
    backgroundColor: "mediumturquoise",
    textColor: "black",
  },
  {
    backgroundColor: "palegreen",
    textColor: "black",
  },
  {
    backgroundColor: "mediumslateblue",
    textColor: "white",
  },
];

function removeAllEvents() {
  const events = document.querySelectorAll(".event-container");
  const body = document.querySelector("body");
  events.forEach((event) => {
    body.removeChild(event);
  });
}

function deleteCalendarEvent(eventId) {
  const eventOptions = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ eventId }),
  };

  return new Promise((resolve) => {
    fetch(DELETE_EVENT_URL, eventOptions)
      .then((res) => res.json())
      .then((data) => resolve(data));
  });
}

function deleteEvent(e) {
  if (!confirm("Are you sure you want to delete the event?")) {
    return;
  }

  const eventId = e.currentTarget.getAttribute("data-eventid");
  const docId = e.currentTarget.getAttribute("data-id");

  deleteEventFromDatabase(docId)
    .then(() => deleteCalendarEvent(eventId))
    .then((res) => {
      getEvents();
      showSnackbar({ message: "Event deleted successfully" });
    })
    .catch((err) => {
      console.log(err);
      alert("Failed to delete the event");
    });
}

function decreaseFontSize(container, percentage = 5) {
  let currentFontSize = getComputedStyle(container).fontSize;
  currentFontSize = currentFontSize.substring(0, currentFontSize.length - 2);
  container.style.fontSize = `${
    (currentFontSize * (100 - percentage)) / 100
  }px`;
}

function fixOverflow() {
  const events = document.querySelectorAll(".event-container");
  events.forEach(event => {
    const eventInfo = event.querySelector('.event-info');
    const datetime = event.querySelector('.datetime');

    // Loop until overflow exists
    while (eventInfo.scrollHeight > eventInfo.clientHeight) {
      decreaseFontSize(eventInfo, 1); // Reduce the font size by 1%
      decreaseFontSize(datetime, 1); // Reduce the font size by 1%
    }
  })
}
