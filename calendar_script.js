// get the current day of the week example: Monday, Tuesday, Wednesday, etc.
let currentDay = new Date().toLocaleString('en-us', {  weekday: 'long' });
console.log(currentDay);

// get the day of the week that is 1 day from now
let currentDayPlus1Number = new Date();
currentDayPlus1Number.setDate(currentDayPlus1Number.getDate() + 1);
let currentDayPlus1 = currentDayPlus1Number.toLocaleString('en-us', {  weekday: 'long' });
console.log(currentDayPlus1);

// get the day of the week that is 2 day from now
let currentDayPlus2Number = new Date();
currentDayPlus2Number.setDate(currentDayPlus2Number.getDate() + 2);
let currentDayPlus2 = currentDayPlus2Number.toLocaleString('en-us', {  weekday: 'long' });
console.log(currentDayPlus2);

// get the day of the week that is 3 day from now
let currentDayPlus3Number = new Date();
currentDayPlus3Number.setDate(currentDayPlus3Number.getDate() + 3);
let currentDayPlus3 = currentDayPlus3Number.toLocaleString('en-us', {  weekday: 'long' });
console.log(currentDayPlus3);

// get the day of the week that is 4 day from now
let currentDayPlus4Number = new Date();
currentDayPlus4Number.setDate(currentDayPlus4Number.getDate() + 4);
let currentDayPlus4 = currentDayPlus4Number.toLocaleString('en-us', {  weekday: 'long' });
console.log(currentDayPlus4);

// get the day of the week that is 5 day from now
let currentDayPlus5Number = new Date();
currentDayPlus5Number.setDate(currentDayPlus5Number.getDate() + 5);
let currentDayPlus5 = currentDayPlus5Number.toLocaleString('en-us', {  weekday: 'long' });
console.log(currentDayPlus5);

// get the day of the week that is 6 day from now
let currentDayPlus6Number = new Date();
currentDayPlus6Number.setDate(currentDayPlus6Number.getDate() + 6);
let currentDayPlus6 = currentDayPlus6Number.toLocaleString('en-us', {  weekday: 'long' });
console.log(currentDayPlus6);

// get the current date example: 1, 2, 3, etc.
let currentDate = new Date().getDate();
// add ordinal to the date example: 1st, 2nd, 3rd, etc.
let currentDateOrdinal = currentDate + (currentDate % 10 == 1 && currentDate != 11 ? 'st' : currentDate % 10 == 2 && currentDate != 12 ? 'nd' : currentDate % 10 == 3 && currentDate != 13 ? 'rd' : 'th');
console.log(currentDateOrdinal);

// get the current month example: January, February, March, etc.
let currentMonth = new Date().toLocaleString('en-us', { month: 'long' });
console.log(currentMonth);

// get the current year example: 2020, 2021, 2022, etc.
let currentYear = new Date().getFullYear();
console.log(currentYear);

// get the current hour example: 1, 2, 3, etc & convert this hour to 12 hour time and add am or pm
let currentHour12 = new Date().toLocaleString('en-us', { hour: 'numeric', hour12: true });
console.log(currentHour12);

// get the current minute example: 1, 2, 3, etc.
let currentMinute = new Date().getMinutes();
console.log(currentMinute);

// for all elements with the class .currentDayOfWeek, set the innerHTML to the current day of the week using the variable currentDay
document.querySelectorAll('.currentDayOfWeek').forEach(function (element) {
	element.innerHTML = currentDay;
});

// for all elements with the class .currentDayOfWeekPlus1, set the innerHTML to the current day of the week plus 1 using the variable currentDayPlus1
document.querySelectorAll('.currentDayOfWeekPlus1').forEach(function (element) {
	element.innerHTML = currentDayPlus1;
});

// for all elements with the class .currentDayOfWeekPlus2, set the innerHTML to the current day of the week plus 2 using the variable currentDayPlus2
document.querySelectorAll('.currentDayOfWeekPlus2').forEach(function (element) {
	element.innerHTML = currentDayPlus2;
});

// for all elements with the class .currentDayOfWeekPlus3, set the innerHTML to the current day of the week plus 3 using the variable currentDayPlus3
document.querySelectorAll('.currentDayOfWeekPlus3').forEach(function (element) {
	element.innerHTML = currentDayPlus3;
});

// for all elements with the class .currentDayOfWeekPlus4, set the innerHTML to the current day of the week plus 4 using the variable currentDayPlus4
document.querySelectorAll('.currentDayOfWeekPlus4').forEach(function (element) {
	element.innerHTML = currentDayPlus4;
});

// for all elements with the class .currentDayOfWeekPlus5, set the innerHTML to the current day of the week plus 5 using the variable currentDayPlus5
document.querySelectorAll('.currentDayOfWeekPlus5').forEach(function (element) {
	element.innerHTML = currentDayPlus5;
});

// for all elements with the class .currentDayOfWeekPlus6, set the innerHTML to the current day of the week plus 6 using the variable currentDayPlus6
document.querySelectorAll('.currentDayOfWeekPlus6').forEach(function (element) {
	element.innerHTML = currentDayPlus6;
});

// for all elements with the class .currentMonth, set the innerHTML to the current date using the variable currentMonth
document.querySelectorAll('.currentMonth').forEach(function (element) {
	element.innerHTML = currentMonth;
});

// for all elements with the class .currentDatOfMonth, set the innerHTML to the current date using the variable currentDateOrdinal
document.querySelectorAll('.currentDayOfMonth').forEach(function (element) {
	element.innerHTML = currentDateOrdinal;
});

// for all elements with the class .currentYear, set the innerHTML to the current year using the variable currentYear
document.querySelectorAll('.currentYear').forEach(function (element) {
	element.innerHTML = currentYear;
});

// some constants:
const NUMBER_OF_COLUMNS = 7;
const MIN_WIDTH_RECT = 400;
const HEIGHT_15MIN_BLOCK = 24;
const PIXELS_PER_MINUTE = HEIGHT_15MIN_BLOCK / 15;

function addCardToday({
  startMinute = 30, 
  endMinute = 240, 
  message = "Abhinav Mishra", 
  numberOfEvents = 12, 
  eventIndex = 0}){
  
  const container = document.querySelector(".singleDayCalendar>.events-container")
  const eventRect = document.createElement('div');
  
  const height = (endMinute - startMinute) * PIXELS_PER_MINUTE + 'px';
  eventRect.classList.add('event');
  eventRect.style.height = height;
  eventRect.innerText = message;
  eventRect.style.top = startMinute * PIXELS_PER_MINUTE + 'px';

  const availableSpace = container.clientWidth - MIN_WIDTH_RECT;
  const columnOffsetStepper = availableSpace / numberOfEvents;
  eventRect.style.left = columnOffsetStepper * eventIndex + 'px';

  container.append(eventRect)

}

for(let i = 3; i >=0 ; i--){
  addCardToday({eventIndex:i, numberOfEvents: 4})
}