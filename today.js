setInterval(() => {
  document.querySelector("#date-header .date").innerHTML =
    dayjs().format("dddd, MMMM D, YYYY");
  document.querySelector("#date-header .time").innerHTML =
    dayjs().format("h:mm:ss A");
}, 1000);

function addEventCard(event) {
  const body = document.getElementsByTagName("body")[0];

  const newEventElement = document.createElement("div");
  newEventElement.classList.add("event-container");
  newEventElement.style.flex = event.duration;
  newEventElement.style.backgroundColor = event.eventColor.backgroundColor;
  newEventElement.style.color = event.eventColor.textColor;

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
  body.appendChild(newEventElement);
}

function getTimeDuration(time = {}) {
  const startTime = dayjs(time.startTime, "HH:mm");
  const endTime = dayjs(time.endTime, "HH:mm");
  return Math.abs(endTime.diff(startTime, "m"));
}

function toggleModal(modalID = "modal-team") {
  const modal = document.getElementById(modalID);
  if (modal.style.display === "none") {
    console.log("Opening Modal");
    modal.style.display = "flex";
  } else {
    console.log("Closing Modal");
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

async function getAll() {
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
    const labels = labelKeys.map((key) => val[key]);
    option.value = val[idKey];
    option.innerHTML = labels.join(" ");
    selectTag.appendChild(option);
  });
}
