const EVENT_URL = "https://hook.us1.make.com/s7p9n5gdm4ixpewou15lueojpboa9f3s";

function createCalendar({
  startDate = dayjs(),
  numberOfWeeks = 3,
  includeWeekends = false,
} = {}) {
  const calendar = document.querySelector(".calendar-container");
  removeAllChildren(calendar);
  for (let weekNumber = 1; weekNumber <= numberOfWeeks; weekNumber++) {
    const week = document.createElement("div");
    week.classList.add("week");
    calendar.appendChild(week);

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const offsetDate = startDate.add(dayOffset, "day");

      if (!includeWeekends && [0, 6].includes(offsetDate.day())) {
        continue;
      }

      const day = document.createElement("div");
      day.id = offsetDate.format('YYYY-MM-DD');
      day.classList.add("day");
      week.appendChild(day);

      day.innerHTML = `
      <div class="day-title">${offsetDate.format("ddd, MMMM D")}</div>
      <hr>
      `;
    }
    startDate = startDate.add(7, "day");
  }
}

function initialzeCalendar() {
  const currentDate = dayjs();
  const nextDate = currentDate.add(1, "day").startOf('D');
  const diff = nextDate.diff(currentDate);
  const oneDayinMillis = 86400000;

  createCalendar(); // For today
  setTimeout(() => {
    createCalendar();
    setInterval(
      () => createCalendar({ startDate: dayjs().add(i++, "day") }),
      oneDayinMillis
    ); // For day after tomorrow and further
  }, diff); // For tomorrow
}

function addEventCard(containerID, event) {
  const eventContainer = document.getElementById(containerID);
  if(!eventContainer){
    return;
  }

  const newEventElement = document.createElement("div");
  newEventElement.id = event.id;
  newEventElement.setAttribute("data-payload", JSON.stringify(event));
  newEventElement.classList.add("event-container");
  newEventElement.style.flex = event.duration;
  newEventElement.style.backgroundColor = event.eventColor.backgroundColor;
  newEventElement.style.color = event.eventColor.textColor;

  newEventElement.addEventListener("click", editEvent, true);

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
  if (event.vehicle) {
    innerHTML += `
    <div class="vehicle">
      ${event.vehicle.name}
    </div>`;
  }
  if (Array.isArray(event.teamMembers) && event.teamMembers.length > 0) {
    innerHTML += `
      <div class="team">
      ${event.teamMembers.map((el) => el.name).join(", ")}
      </div>`;
  }
  innerHTML += "</div>"; // Closing the event info tag
  newEventElement.innerHTML = innerHTML;
  eventContainer.appendChild(newEventElement);
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
  setOptions({
    selectTagId: "vehicle",
    optionsArray: vehicles,
    idKey: "id",
    labelKeys: ["vehicleName"],
  });
  ["teammember1", "teammember2", "teammember3"].forEach((id) => {
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
  selectOption({
    selectTagId: "vehicle",
    optionId: selectedEvent.vehicle ? selectedEvent.vehicle.id : 0,
  });
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

function resetModalForm() {
  const selects = Array.from(document.querySelectorAll("select"));
  selects.forEach((select) => {
    select.selectedIndex = 0;
  });
  const today = new Date();
  document.querySelector(".modal #eventDate").value = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;
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

function updateEvent() {
  const payload = {
    eventColor: {
      backgroundColor: "white",
      textColor: "black",
    },
  };
  let buffer;
  let empty = true;
  const newTodo = getSelectedOption({ selectTagId: "todo" });
  const newVehicle = getSelectedOption({ selectTagId: "vehicle" });
  const newTeamMember1 = getSelectedOption({ selectTagId: "teammember1" });
  const newTeamMember2 = getSelectedOption({ selectTagId: "teammember2" });
  const newTeamMember3 = getSelectedOption({ selectTagId: "teammember3" });

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
  if (newVehicle) {
    buffer = JSON.parse(newVehicle.getAttribute("data-payload"));
    payload.vehicle = {
      id: buffer.id,
      name: buffer.vehicleName,
      vin: buffer.vin,
      license: buffer.license,
    };
    empty = false;
  }
  if (newTeamMember1 || newTeamMember2 || newTeamMember3) {
    payload.teamMembers = [];
    [newTeamMember1, newTeamMember2, newTeamMember3].forEach(
      (newTeamMember) => {
        if (!newTeamMember) {
          return;
        }
        buffer = JSON.parse(newTeamMember.getAttribute("data-payload"));
        payload.teamMembers.push({
          id: buffer.id,
          name: `${buffer.firstName} ${buffer.lastName}`,
          email: buffer.email,
        });
      }
    );
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
  replaceUndefined(payload); // Because undefined values are not allowed.

  updateCalendarEvent(payload)
    .then((data) => updateEventInDatabase({ ...payload, ...data }))
    .then((res) => {
      createCalendar();
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

function removeAllEvents(containerID) {
  const container = document.getElementById(containerID);
  if(!container){
    return;
  }
  const events = container.querySelectorAll(".event-container");
  events.forEach((event) => {
    container.removeChild(event);
  });
}

function removeAllChildren(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
