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
      ${event.teamMembers.map(el => el.name).join(", ")}
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

function toggleModal(modalID = 'modal-team'){

	const modal = document.getElementById(modalID)
	if(modal.style.display === "none"){
		console.log("Opening Modal");
		modal.style.display = "flex"
	}else{
		console.log("Closing Modal");
		modal.style.display = "none"
	}
}
