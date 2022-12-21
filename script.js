console.log('script.js loaded');

getAll();
const EVENT_URL = 'https://hook.us1.make.com/8il7zph12nsp5lkmdkx85fv5h2smwyb1'
selectedTeamMembers = []

// GET all lists from D-Tools
function getAll() {
	console.log ('Getting all lists...');
	const promiseArray = [];
	promiseArray.push(getProjects());
	promiseArray.push(getTasks());
	promiseArray.push(getServiceOrders());

	Promise.all(promiseArray).then(res => {
		filterSelection("all");
		const todoContainer = document.querySelector(".todo-container");
		addScollBarIfNecessary(todoContainer);
	})

	getPurchaseOrders();
	getServicePlans();
	getTimeSheets();
	getProducts();
}

// GET list of PROJECTS from D-Tools
function getProjects() {
	console.log('Getting projects...');
	const projectOptions = {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'X-DTSI-ApiKey': 's0vAAip0W0uwXkKDO5JpGwSXgLYj6cokGrs2LUHi8P0g'
		}
	};
	return new Promise((resolve) => {
		fetch('https://api.d-tools.com/SI/Subscribe/Projects', projectOptions)
		.then(response => response.json())
		.then(data => {
			data.Projects.forEach(Project => {

				// Console log ALL projects
				console.log(Project);

				// If the project's progress is 'Approved'
				if (Project.Progress == 'Approved') {

					// Create a new div for each project
					let div = document.createElement('div');
					div.setAttribute('data-id',Project.Id);
					div.setAttribute('data-name',Project.Name);
					div.setAttribute('data-payload',JSON.stringify({type: 'Project', ...Project}))
					div.addEventListener('dragstart', (event) => {
						event.dataTransfer.setData("text/todo", "project")
						window.dragNode = div
					})
					div.innerHTML =
						'<div draggable="true" class="card filterDiv ' + Project.Progress.toLowerCase() + ' project" style="cursor: pointer;">' +
						'<text class="topCardLabel">Project</text><br>' +
						'<text class="ProjectProgress chip">' + Project.Progress + '</text> <br>' +
						//	'<text class="ProjectPrice">$' + Project.Price + '</text> <br>' +
						'<text class="ProjectName">' + Project.Name + '</text> <br>' +
						'<details>' +
						'<summary>Project Details</summary>' +
						'<text class="ProjectNumber"><u>Project Number:</u> ' + Project.Number + '</text> <br>' +
						'<text class="ProjectId"><u>Project ID:</u> ' + Project.Id + '</text> <br>' +
						'<text class="ProjectPublishedOn"><u>Published On:</u> ' + Project.PublishedOn + '</text> <br>' +
						'</details>' +
						'<details>' +
						'<summary class="ProjectClient">' + Project.Client + '</summary>' +
						'<text class="ProjectClientId"><u>Client ID:</u> ' + Project.ClientId + '</text> <br>' +
						'</details>' +
						//	'<text class="ProjectApproved">Approved: ' + Project.Approved + '</text> <br>' +
						//	'<text class="ProjectCONumber">CO Number: ' + Project.CONumber + '</text> <br>' +
						//	'<text class="ProjectCurrencyCode">Currency Code: ' + Project.CurrencyCode + '</text> <br>' +
						//	'<text class="ProjectIntegrationProjectId">IntegrationProjectId: ' + Project.IntegrationProjectId + '</text> <br>' +
						//	'<text class="ProjectImportedOn">Imported On: ' + Project.ImportedOn + '</text> <br>' +
						//	'<text class="ProjectDeleted">Deleted: ' + Project.Deleted + '</text> <br>' +
						'</div>';

					// add the new div to the section with the id of "projects"
					document.getElementById('Projects').appendChild(div);

					// Set the background color of the ProjectProgress .chip to green
					div.getElementsByClassName('ProjectProgress')[0].style.backgroundColor = '#1e8123';

					// Add an 'option' for each project to the search input with the id of 'toDoList'
					let option = document.createElement('option');
					option.value = Project.Name;
					document.getElementById('toDoList').appendChild(option);

				}
			})
			resolve()
		})
	})
}

// GET list of TASKS from D-Tools
function getTasks() {
	console.log('Getting tasks...');
	const taskOptions = {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'X-DTSI-ApiKey': 's0vAAip0W0uwXkKDO5JpGwSXgLYj6cokGrs2LUHi8P0g'
		}
	};
	return new Promise((resolve) => {
		fetch('https://api.d-tools.com/SI/Subscribe/Tasks', taskOptions)
		.then(response => response.json())
		.then(data => {
			data.Tasks.forEach(Task => {
				console.log(Task);

				// Create a new div for each task
				let div = document.createElement('div');
				div.setAttribute('data-id',Task.Id);
				div.setAttribute('data-name',Task.Name);
				div.setAttribute('data-payload',JSON.stringify({type: 'Task', ...Task}))
				div.addEventListener('dragstart', (event) => {
					event.dataTransfer.setData("text/todo", "task")
					window.dragNode = div
				})
				div.innerHTML =
					'<div draggable="true" class="card filterDiv ' + Task.Progress.toLowerCase() + ' task" style="cursor: pointer;">' +
					'<text class="topCardLabel">Task</text><br>' +
					'<text class="TaskProgress chip">' + Task.Progress + '</text> <br>' +
					'<text class="TaskName">' + Task.Name + '</text> <br>' +
					'<text class="TaskClient">' + Task.Client + '</text>' +
					'<text class="TaskDescription">' + Task.Description + '</text> <br>' +
					'<details>' +
					'<summary>Task Details</summary>' +
					'<text class="TaskNumber"><u>Task Number:</u> ' + Task.Number + '</text> <br>' +
					'<text class="TaskId"><u>Task ID:</u> ' + Task.Id + '</text> <br>' +
					'<text class="TaskPublishedOn"><u>Published on:</u> ' + Task.PublishedOn + '</text> <br>' +
					'</details>' +
					'</div>';

				// add the new div to the section with the id of "projects"
				document.getElementById('Tasks').appendChild(div);

				if (Task.Progress == 'In Progress') {
					// Set the background color of the ProjectProgress .chip to orange
					div.getElementsByClassName('TaskProgress')[0].style.backgroundColor = '#c27312';
				}

				// Add an 'option' for each task to the search input with the id of 'toDoList'
				let option = document.createElement('option');
				option.value = Task.Name;
				document.getElementById('toDoList').appendChild(option);

			})
			resolve()
		})
	})
}

// GET list of SERVICE ORDERS from D-Tools
function getServiceOrders() {
	console.log('Getting service orders...');
	const serviceOptions = {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'X-DTSI-ApiKey': 's0vAAip0W0uwXkKDO5JpGwSXgLYj6cokGrs2LUHi8P0g'
		}
	};
	return new Promise((resolve) => {
		fetch('https://api.d-tools.com/SI/Subscribe/ServiceOrders', serviceOptions)
		.then(response => response.json())
		.then(data => {
			data.ServiceOrders.forEach(ServiceOrder => {
				console.log(ServiceOrder);

				// Create a new div for each serviceOrder
				let div = document.createElement('div');
				div.setAttribute('data-id',ServiceOrder.Id);
				div.setAttribute('data-name',ServiceOrder.Name);
				div.setAttribute('data-payload',JSON.stringify({type: 'ServiceOrder', ...ServiceOrder}))
				div.addEventListener('dragstart', (event) => {
					event.dataTransfer.setData("text/todo", "serviceorder")
					window.dragNode = div
				})
				div.innerHTML =
					'<div draggable="true" class="card filterDiv ' + ServiceOrder.Progress.toLowerCase() + ' serviceOrder" style="cursor: pointer;">' +
					'<text class="topCardLabel">Service Order</text><br>' +
					'<text class="ServiceOrderProgress chip">' + ServiceOrder.Progress + '</text> <br>' +
					'<text class="ServiceOrderName">' + ServiceOrder.Name + '</text> <br>' +
					//	'<text class="ServiceOrderClient">' + ServiceOrder.Client + '</text> <br>' +
					'<div class="ServiceOrderDescription">' + ServiceOrder.Description + '</div>' +
					'<details>' +
					'<summary>Service Order Details</summary>' +
					'<text class="ServiceOrderId"><u>Service Order ID:</u> ' + ServiceOrder.Id + '</text> <br>' +
					'<text class="ServiceOrderPublishedOn"><u>Published on:</u> ' + ServiceOrder.PublishedOn + '</text> <br>' +
					'</details>'
				//	'<text class="ServiceOrderImportedOn">Imported on: ' + ServiceOrder.ImportedOn + '</text> <br>' +

				'</div>';

				if (ServiceOrder.Description == null) {
					// Set the background color of the ServiceOrderProgress .chip to orange
					div.getElementsByClassName('ServiceOrderDescription')[0].style.display = 'none';
				}

				// add the new div to the section with the id of 'ServiceOrders'
				document.getElementById('ServiceOrders').appendChild(div);

				// change the color of the progress chip based on their value
				if (ServiceOrder.Progress == 'Completed') {
					// Set the background color of the ProjectProgress .chip to green
					div.getElementsByClassName('ServiceOrderProgress')[0].style.backgroundColor = '#1e8123';
				}
				if (ServiceOrder.Progress == 'Not Started') {
					// Set the background color of the ProjectProgress .chip to orange
					div.getElementsByClassName('ServiceOrderProgress')[0].style.backgroundColor = '#c27312';
				}

				// Add an 'option' for each service order to the search input with the id of 'toDoList'
				let option = document.createElement('option');
				option.value = ServiceOrder.Name;
				document.getElementById('toDoList').appendChild(option);

			})
			resolve()
		})
	})
}

// GET list of PURCHASE ORDERS from D-Tools
function getPurchaseOrders() {
	console.log('Getting purchase orders...');
	const purchaseOptions = {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'X-DTSI-ApiKey': 's0vAAip0W0uwXkKDO5JpGwSXgLYj6cokGrs2LUHi8P0g'
		}
	};
	fetch('https://api.d-tools.com/SI/Subscribe/PurchaseOrders', purchaseOptions)
	.then(response => response.json())
	.then(data => {
		console.log(data);
	})
}

// GET list of SERVICE PLANS from D-Tools
function getServicePlans() {
	console.log('Getting service plans...');
	const planOptions = {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'X-DTSI-ApiKey': 's0vAAip0W0uwXkKDO5JpGwSXgLYj6cokGrs2LUHi8P0g'
		}
	};
	fetch('https://api.d-tools.com/SI/Subscribe/ServicePlans', planOptions)
	.then(response => response.json())
	.then(data => {
		console.log(data);
	})
}

// GET list of TIMESHEETS from D-Tools
function getTimeSheets() {
	console.log('Getting time sheets...');
	const timesheetOptions = {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'X-DTSI-ApiKey': 's0vAAip0W0uwXkKDO5JpGwSXgLYj6cokGrs2LUHi8P0g'
		}
	};
	fetch('https://api.d-tools.com/SI/Subscribe/TimeSheets', timesheetOptions)
	.then(response => response.json())
	.then(data => {
		console.log(data);
	})
}

// GET list of PRODUCTS from D-Tools
function getProducts() {
	console.log('Getting products...');
	const productOptions = {
		method: 'GET',
		headers: {
			'content-type': 'application/json',
			'X-DTSI-ApiKey': 's0vAAip0W0uwXkKDO5JpGwSXgLYj6cokGrs2LUHi8P0g'
		}
	};
	fetch('https://api.d-tools.com/SI/Subscribe/ProductCatalogs', productOptions)
	.then(response => response.json())
	.then(data => {
		console.log(data);
	})
}


function newEvent() {
	console.log('Creating new event...');

	// POST to 'Make' webhook - Can be accessed at: https://us1.make.com/145062/scenarios/517441/edit (only with account cookie)
	const eventOptions = {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			toDo: {
				name: '123 Branch Ave (Home)', // always
				type: 'Task', // always
				progress: 'Not Started', // always
				description: 'This is a test description', // if != null
				client: {
					name: 'Test Client', // if 'type' == 'Project'
					id: '123456789' // if 'type' == 'Project'
				}
			},
			vehicle: {
				name: 'Test Vehicle', // always
				vin: '123456789', // always
				license: 'GDG36F3', // always
			},
			teamMember: {
				firstName: 'Test', // always
				lastName: 'User', // always
				email: 'brandwield@gmail.com' // always
			},
			time: {
				start: '2020-01-01T00:00:00', // always
				end: '2022-01-01T00:00:00' // always
			}
		})
	};
	fetch(EVENT_URL, eventOptions)
	.then(response => response.json())
	.then(data => {
		console.log(data);
		}
	)
}

function addTeamMemberToDOM(payload){
	// Create a div for the 'lists' tab
	var teamMember = document.createElement("div");
	teamMember.setAttribute('data-id',payload.id);
	teamMember.innerHTML = `
	<div class="card">
	<div class="topCardLabel" style="position:relative;  margin-bottom: 20px;">
		<span style="position:absolute; top:8px; right: 8px;" onclick="deleteTeamMember('${payload.id}')">X</span>
		<text>Team Member</text>
	</div>
		<text> ${payload.firstName}&nbsp${payload.lastName}</text><br>
		<text style="color: var(--secondaryTextColor); font-size: var(--secondaryFontSize);">${payload.email}</text>
	</div>`;

	// Place the div
	document.getElementById("team").appendChild(teamMember);

	// Create a div for the 'today' tab
	var teamMemberToday = document.createElement("div");
	teamMemberToday.setAttribute('data-id',payload.id);
	teamMemberToday.setAttribute('data-name',`${payload.firstName} ${payload.lastName}`);
	teamMemberToday.setAttribute('data-payload',JSON.stringify(payload))
	teamMemberToday.addEventListener('dragstart', (event) => {
		event.dataTransfer.setData("text/teamMember", "teamMember")
		window.dragNode = teamMemberToday
	})
	teamMemberToday.innerHTML = `
	<div class="card" draggable="true" style="cursor: pointer;">
	<div class="topCardLabel" style="position:relative; margin-bottom: 20px;">
		<text >Team Member</text><br>
	</div>
		<text> ${payload.firstName}&nbsp${payload.lastName}</text><br>
		<text style="color: var(--secondaryTextColor); font-size: var(--secondaryFontSize);">${payload.email}</text>
	</div>
	`
	// Place the div
	document.getElementById("TeamMembers").appendChild(teamMemberToday);

	addScollBarIfNecessary(document.querySelector('#TeamMembers'));
	// Console log the created items
	console.log('Team member loaded: ' + payload.firstName + ' ' + payload.lastName + ' ' + payload.lastName);
}

function addVehicleToDOM(payload){

	// Create a div for the 'lists' tab
	var vehicle = document.createElement("div");
	vehicle.setAttribute('data-id',payload.id);
	vehicle.innerHTML = `
	<div class="card">
	<div class="topCardLabel" style="position:relative;  margin-bottom: 20px;">
		<span style="position:absolute; top:8px; right: 8px;" onclick="deleteVehicle('${payload.id}')">X</span>
		<text >Vehicle</text>
	</div>
	<text>${payload.vehicleName}</text><br>
	<text style="color: var(--secondaryTextColor); font-size: var(--secondaryFontSize);">License: ${payload.license}</text><br>
	<text style="color: var(--secondaryTextColor); font-size: var(--secondaryFontSize);">VIN: ${payload.vin}</text> <br>
	</div>
	`;

	// Place the div
	document.getElementById("vehicles").appendChild(vehicle);

	// Create a div for the 'today' tab
	var vehicleToday = document.createElement("div");
	vehicleToday.setAttribute('data-id',payload.id);
	vehicleToday.setAttribute('data-name',payload.vehicleName);
	vehicleToday.setAttribute('data-payload',JSON.stringify(payload))
	vehicleToday.addEventListener('dragstart', (event) => {
		event.dataTransfer.setData("text/vehicle", "vehicle")
		window.dragNode = vehicleToday
		// console.log(vehicleToday, window.dragNode)
	})
	vehicleToday.innerHTML = `
	<div class="card" draggable="true" style="cursor: pointer;">
	<div class="topCardLabel" style="position:relative;  margin-bottom: 20px;">
		<text >Vehicle</text>
	</div>
	<text>${payload.vehicleName}</text><br>
	<text style="color: var(--secondaryTextColor); font-size: var(--secondaryFontSize);">License: ${payload.license}</text><br>
	<text style="color: var(--secondaryTextColor); font-size: var(--secondaryFontSize);">VIN: ${payload.vin}</text> <br>
	</div>
	`;

	// Place the div
	document.getElementById("Vehicles").appendChild(vehicleToday);
	
	addScollBarIfNecessary(document.querySelector('#Vehicles'));

	// Console log the created items
	console.log('Vehicle loaded: ' + payload.vehicleName);
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

function resetModalForm(modalID = 'modal-team'){
	const modal = document.getElementById(modalID)
	const inputs = modal.querySelectorAll('input')
	inputs.forEach(input => input.value = "")
}

function onDragOver(event){
	const type = event.dataTransfer.types[0].substring(5)
	
	// Only allow drop in the correct drop zone
	if(type === event.target.getAttribute('data-type')){
		event.preventDefault()
	}
}

function removeAllChildren(element){
	while(element.firstChild){
		element.removeChild(element.firstChild)
	}
}

function dropCard(event, eventType){
	let dropZone = event.target
	const clone = dragNode.cloneNode(true);
	clone.querySelector('[draggable="true"]').setAttribute('draggable', false)
	const type = eventType? eventType : event.dataTransfer.types[0]

	clone.ondragover = function (e) {
		if(e.dataTransfer.types[0] === type){
			e.preventDefault()
		}
	}

	clone.ondrop = (e) => {
		dropCard(event, type)
		e.stopPropagation()
	}

	if(type === "text/teammember" && selectedTeamMembers.includes(clone.getAttribute('data-id'))){
		// If team member is already selected in one of the placeholders
		alert("You cannot add same team member twice")
		return;
	}else{
		window.selectedTeamMembers.push(clone.getAttribute('data-id'))
	}
	
	removeAllChildren(dropZone)
	dropZone.appendChild(clone)
	
}

function replaceUndefined(obj, replaceToken = '') {
	Object.keys(obj).forEach(function(key) {
		let value = obj[key];
		let type = typeof value;
			if (type === "object") {
					replaceUndefined(obj[key], replaceToken);
			}
			else if (type === "undefined") {
					obj[key] = replaceToken;
			}
	});
}

function createNewEvent(){
	const payload = {
		eventColor:{
			backgroundColor: 'white',
			textColor: 'black'
		}
	};
	let buffer;
	let empty = true;
	let newTodo = document.querySelector("#newToDoSlot div");
	let newVehicle = document.querySelector("#newVehicleSlot div");
	let newTeamMembers = document.querySelectorAll(".newTeamMemberSlot>div");

	if(newTodo){
		buffer = JSON.parse(newTodo.getAttribute('data-payload'))
		payload.toDo = {
			name: buffer.Name,
			type: buffer.type,
			progress: buffer.Progress,
			description: buffer.Description,
		}
		payload.eventColor = colorPairs[hash_fn(buffer.Id)]
		if(buffer.type === 'Project'){
			payload.toDo.client = {
				name: buffer.Client,
				id: buffer.ClientId
			}
		}
		empty = false;
	}
	if(newVehicle){
		buffer = JSON.parse(newVehicle.getAttribute('data-payload'));
		payload.vehicle = {
			name: buffer.vehicleName,
			vin: buffer.vin,
			license: buffer.license
		}
		empty = false;
	}
	if(newTeamMembers.length){
		payload.teamMembers = []
		newTeamMembers.forEach( newTeamMember => {
			buffer = JSON.parse(newTeamMember.getAttribute('data-payload'));
			payload.teamMembers.push( {
				name: `${buffer.firstName} ${buffer.lastName}`,
				email: buffer.email
			})
		})
		empty = false;
	}
		
	if(empty)	{ // if all the drop locations are empty
		alert("No card selected");
		return;
	}else if(!confirm("Are you sure you want to create the event?")){
		return;
	}

	payload.time = {
		date: new Date(document.getElementById('eventDate').value),
		startTime: document.getElementById('startTime').value,
		endTime: document.getElementById('endTime').value
	}

	const repeat = parseInt(document.getElementById('repeatInput').value, 10);
	if(!repeat || repeat <= 1){
		payload.repeat = 1;
	}else{
		payload.repeat = repeat
	}
	payload.repeatDates = createRepeatDates(payload.time.date, payload.repeat);

	replaceUndefined(payload); // Because undefined values are not allowed.

	saveEventToDatabase(payload)
	.then(response => {
		saveEventToCalendar(payload)
		showSnackbar({message: "Shit is GUCCI"})
		clearCards()
		createConfetti()
	}).catch(err => {
		console.log(err);
		alert("Failed to create the event")
	})	
}

function saveEventToCalendar(payload) {
  const { date, startTime, endTime } = payload.time;
  const start = date.toISOString().substring(0, 11) + startTime;
  const end = date.toISOString().substring(0, 11) + endTime;
  payload.time = {
    start,
    end,
  };
  console.log(payload);
  const eventOptions = {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  };
  fetch(EVENT_URL, eventOptions);
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

function createConfetti() {
  if (!party) {
    return;
  }

  let mouseEvent = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: window.innerWidth / 2,
    clientY: window.innerHeight / 6,
    /* whatever properties you want to give it */
  });
  party.confetti(mouseEvent, { count: 70, size: 1.5, spread: 80 });
}

function clearCards() {
  const placeholderSelectors = [
    "#newToDoSlot",
    "#newVehicleSlot",
    ".newTeamMemberSlot",
  ];

  placeholderSelectors.forEach((selector, index) => {
    const placeholderList = document.querySelectorAll(selector);
    placeholderList.forEach((placeholder) => {
      removeAllChildren(placeholder);
      placeholder.innerHTML = `Drop<br>
			${index === 0 ? "To Do" : index === 1 ? "Vehicle" : "Team Member"}`;
    });
  });

  window.selectedTeamMembers = [];
}

// function searchVehicles(e){
// 	let keyword = e.target.value;
// 	keyword = keyword.trim()
// 	keyword = keyword.toLowerCase()

// 	const vehiclesList = Array.from(document.querySelectorAll('#Vehicles .card'))

// 	vehiclesList.forEach(vehicle => {
// 		const vehicleName = vehicle.childNodes[3].innerText.trim().toLowerCase()
// 		if(vehicleName.includes(keyword)){
// 			vehicle.classList.remove('hidden')
// 		}else{
// 			vehicle.classList.add('hidden')
// 		}
// 	})

// }

// function searchTeamMembers(e){
// 	let keyword = e.target.value;
// 	keyword = keyword.trim()
// 	keyword = keyword.toLowerCase()

// 	const teamMembersList = Array.from(document.querySelectorAll('#TeamMembers .card'))

// 	teamMembersList.forEach(teamMember => {
// 		const teamMemberName = teamMember.childNodes[3].innerText.trim().toLowerCase()
// 		if(teamMemberName.includes(keyword)){
// 			teamMember.classList.remove('hidden')
// 		}else{
// 			teamMember.classList.add('hidden')
// 		}
// 	})

// }

// function searchTodos(e){
// 	let keyword = e.target.value;
// 	keyword = keyword.trim()
// 	keyword = keyword.toLowerCase()

// 	const projectList = Array.from(document.querySelectorAll('#Projects .card'))
// 	const taskList = Array.from(document.querySelectorAll('#Tasks .card'))
// 	const serviceOrderList = Array.from(document.querySelectorAll('#ServiceOrders .card'))
// 	const combinedList = [...projectList,...taskList,...serviceOrderList]

// 	combinedList.forEach(project => {
// 		const projectName = project.children[4].innerText.trim().toLowerCase()
// 		if(projectName.includes(keyword)){
// 			project.classList.remove('hidden')
// 		}else{
// 			project.classList.add('hidden')
// 		}
// 	})

// }

function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

function formatDate(date) {
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join("-");
}

function sortCards({
  containerId = "Projects",
  sortBy = "name",
  sortOrder = "asc",
} = {}) {
  const container = document.getElementById(containerId);
  const cards = Array.from(container.children);

  cards.sort((a, b) => {
    const val1 = a.getAttribute(`data-${sortBy}`).toUpperCase();
    const val2 = b.getAttribute(`data-${sortBy}`).toUpperCase();
    if (val1 < val2) {
      return -1;
    }
    if (val1 > val2) {
      return 1;
    }
    return 0;
  });

  removeAllChildren(container);

  if (sortOrder === "asc") {
    for (let i = 0; i < cards.length; i++) {
      container.appendChild(cards[i]);
    }
  } else {
    for (let i = cards.length - 1; i >= 0; i--) {
      container.appendChild(cards[i]);
    }
  }
}

function handleSortEvent(e) {
  const [sortBy, sortOrder] = e.target.value.split("-");
  const type = e.target.getAttribute("data-type");
  switch (type) {
    case "todos":
      const containerIds = ["Projects", "ServiceOrders", "Tasks"];
      containerIds.forEach((containerId) => {
        sortCards({ containerId, sortBy, sortOrder });
      });
      break;

    case "vehicles":
      sortCards({ containerId: "Vehicles", sortBy, sortOrder });
      break;

    case "teamMembers":
      sortCards({ containerId: "TeamMembers", sortBy, sortOrder });
      break;
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

function addScollBarIfNecessary(element){
	const styles = window.getComputedStyle(element);
	const maxHeight = Number(styles.getPropertyValue('max-height').split('px')[0]);
	console.log({maxHeight});
	if( element.scrollHeight >= maxHeight){
		element.classList.add("overflow-scroll")
	}else{
		element.classList.remove("overflow-scroll")
	}
}