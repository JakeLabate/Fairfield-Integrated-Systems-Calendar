console.log('script.js loaded');

getAll();

// GET all lists from D-Tools
function getAll() {
	console.log ('Getting all lists...');
	getProjects();
	getTasks();
	getServiceOrders();
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
	fetch('https://api.d-tools.com/SI/Subscribe/Projects', projectOptions)
	.then(response => response.json())
	.then(data => {
		data.Projects.forEach(Project => {
			console.log(Project);

			// Create a new div for each project
			let div = document.createElement('div');
			div.innerHTML =
				'<div draggable="true" class="projectCard filterDiv ' + Project.Progress.toLowerCase() + ' project" style="cursor: pointer;">' +
				'<text class="chip">Project</text><br>' +
				'<text class="ProjectProgress chip">' + Project.Progress + '</text>' + ' ' + '<text class="ProjectPrice">$' + Project.Price + '</text> <br>' +
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

			// change the color of the progress chip based on their value
			if (Project.Progress == 'Approved') {
				// Set the background color of the ProjectProgress .chip to green
				div.getElementsByClassName('ProjectProgress')[0].style.backgroundColor = '#1e8123';
			}
			if (Project.Progress == 'Estimating') {
				// Set the background color of the ProjectProgress .chip to orange
				div.getElementsByClassName('ProjectProgress')[0].style.backgroundColor = '#c27312';
			}
			if (Project.Progress == 'Completed') {
				// Set the background color of the ProjectProgress .chip to blue
				div.getElementsByClassName('ProjectProgress')[0].style.backgroundColor = '#264c9b';
			}
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
	fetch('https://api.d-tools.com/SI/Subscribe/Tasks', taskOptions)
	.then(response => response.json())
	.then(data => {
		data.Tasks.forEach(Task => {
			console.log(Task);

			// Create a new div for each project
			let div = document.createElement('div');
			div.innerHTML =
				'<div draggable="true" class="taskCard filterDiv ' + Task.Progress.toLowerCase() + ' task" style="cursor: pointer;">' +
				'<text class="chip">Task</text><br>' +
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
	fetch('https://api.d-tools.com/SI/Subscribe/ServiceOrders', serviceOptions)
	.then(response => response.json())
	.then(data => {
		data.ServiceOrders.forEach(ServiceOrder => {
			console.log(ServiceOrder);

			// Create a new div for each serviceOrder
			let div = document.createElement('div');
			div.innerHTML =
				'<div draggable="true" class="serviceOrderCard filterDiv ' + ServiceOrder.Progress.toLowerCase() + ' serviceOrder" style="cursor: pointer;">' +
				'<text class="chip">Service Order</text><br>' +
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





// New Team Member
function newTeamMember() {
	console.log('Creating new team member...');
}

// New Vehicle
function newVehicle() {
	console.log('Creating new vehicle...');
}