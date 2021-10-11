function onClickAdd() {
  let note = document.getElementById("note").value;
  let date = document.getElementById("datepicker").value;
  let time = document.getElementById("time").value;
  let title = document.getElementById("title").value;

  let titleElement = document.getElementById("title");
  let noteElement = document.getElementById("note");
  let dateElement = document.getElementById("datepicker");
  let timeElement = document.getElementById("time");

  let container = document.getElementById("containerDiv");

  try {
    validateInput(note, date, title);
    notes = saveToLocalStorage(
      noteElement,
      dateElement,
      timeElement,
      titleElement
    );
    addNewNoteCard(notes, container, notes.length - 1);
    cleanInputs();
  } catch (e) {
    console.log("error");
  }
}

//Functions

//User input validation
function validateInput(note, date, title) {
  let isValid = true;
  resetFieldsUi();

  if (isEmptyField(date)) {
    showError("datepicker", "You must fill date");
    isValid = false;
  }

  if (isEmptyField(note)) {
    showError("note", "You must fill a note");
    isValid = false;
  }
  if (isEmptyField(title)) {
    showError("title", "You must fill title");
    isValid = false;
  }
  if (title.length > 15) {
    showError("title", "Your title is too long");
    isValid = false;
  }

  if (!isValid) {
    throw new Error();
  }
}

function addNewNoteCard(notes, container, index) {
  let newNoteDiv = document.createElement("div");
  newNoteDiv.style.animation = "fadeIn 2s";
  newNoteCard(newNoteDiv, notes, index);
  newTitleDiv(newNoteDiv, notes, index);
  newDeleteButton(newNoteDiv, notes);
  newNoteDivs(newNoteDiv, notes, index);
  newDateDiv(newNoteDiv, notes, index);
  newTimeDiv(newNoteDiv, notes, index);
  container.append(newNoteDiv);
}

//Resetting the red border and the error message from the inputs and the errors div
function resetFieldsUi() {
  cleanErrorFromElement("note");
  cleanErrorFromElement("datepicker");
  cleanErrorFromElement("title");
}

//Cleaning Red border and error message from the elements
function cleanErrorFromElement(id) {
  let node = document.getElementById(id);
  node.style.border = "";
  let errorsNode = document.getElementById(id + "-error");
  errorsNode.innerHTML = "";
}

//Showing error to user
function showError(id, message) {
  let node = document.getElementById(id);
  node.style.borderBottom = "2px solid red";
  node.style.borderTop = "2px solid red";

  let errorsNode = document.getElementById(id + "-error");
  errorsNode.innerHTML = message;
}

//Checking if the fields is empty
function isEmptyField(field) {
  if (field == null || field == "") {
    return true;
  }

  return false;
}

//creating delete btn
function newDeleteButton(newNoteDiv) {
  let deleteButton = document.createElement("button");
  let trashIcon = document.createElement("i");
  trashIcon.setAttribute("class", "fas fa-trash-alt");
  trashIcon.setAttribute("id", "trashCan");

  deleteButton.appendChild(trashIcon);
  deleteButton.classList.add("deleteBtn");
  newNoteDiv.append(deleteButton);
  deleteButton.addEventListener("click", function (e) {
    let notes = JSON.parse(localStorage.getItem("notes"));
    let removeCardDiv = e.target.parentElement.parentElement;
    removeNoteFromLocalStorage(notes, newNoteDiv.id);
    fadeOutOnRemove(removeCardDiv, 1000);
  });
}

//Create the note card
function newNoteCard(newNoteDiv, notes, index) {
  newNoteDiv.setAttribute("class", "note-card");
  newNoteDiv.setAttribute("id", notes[index].id);
}

//Create the date div inside the card
function newDateDiv(newNoteDiv, notes, index) {
  let dateDiv = document.createElement("div");
  dateDiv.setAttribute("class", "dateDiv");
  newNoteDiv.append(dateDiv);
  let dateSpan = document.createElement("span");
  dateDiv.appendChild(dateSpan).innerHTML = "Date: ";
  dateDiv.append(notes[index].date);
}

//Create the note div inside the card
function newNoteDivs(newNoteDiv, notes, index) {
  let noteDiv = document.createElement("div");
  noteDiv.setAttribute("class", "noteDiv");
  newNoteDiv.append(noteDiv);
  noteDiv.append(notes[index].note);
}

//Create the time div inside the card
function newTimeDiv(newNoteDiv, notes, index) {
  let timeDiv = document.createElement("div");
  timeDiv.setAttribute("class", "timeDiv");
  newNoteDiv.append(timeDiv);
  let timeSpan = document.createElement("span");
  timeDiv.appendChild(timeSpan).innerHTML = "Time: ";
  timeDiv.append(notes[index].time);
}

function newTitleDiv(newNoteDiv, notes, index) {
  let titleDiv = document.createElement("div");
  titleDiv.setAttribute("class", "titleDiv");
  newNoteDiv.append(titleDiv);
  let titleSpan = document.createElement("span");
  titleDiv.appendChild(titleSpan).innerHTML = "Title: ";
  titleDiv.append(notes[index].title);
}

//Cleaning the user input after submitting the form
function cleanInputs() {
  let note = (document.getElementById("note").value = "");
  let date = (document.getElementById("datepicker").value = "");
  let time = (document.getElementById("time").value = "");
  let title = (document.getElementById("title").value = "");
}

//Fade out effect for the delete button
function fadeOutOnRemove(element, speed) {
  let seconds = speed / 1000;
  element.style.transition = "opacity " + seconds + "s ease";

  element.style.opacity = 0;
  setTimeout(function () {
    element.parentNode.removeChild(element);
  }, speed);
}

//Resseting the inputs on click
function onClickReset() {
  cleanInputs();
  resetFieldsUi();
}

//Saving to local storage
function saveToLocalStorage(
  noteElement,
  dateElement,
  timeElement,
  titleElement
) {
  let strNotesCounter = localStorage.getItem("notesCounter");
  let notesCounter;
  if (!strNotesCounter) {
    notesCounter = 0;
  } else {
    notesCounter = JSON.parse(strNotesCounter);
  }

  let note = {
    note: noteElement.value,
    date: dateElement.value,
    time: timeElement.value,
    title: titleElement.value,
    id: notesCounter++,
  };

  localStorage.setItem("notesCounter", JSON.stringify(notesCounter));

  let strNotes = localStorage.getItem("notes");
  let notes;
  // if strNotes is null/undefined
  if (!strNotes) {
    notes = [];
  } else {
    notes = JSON.parse(strNotes);
  }

  notes.push(note);
  localStorage.setItem("notes", JSON.stringify(notes));
  return notes;
}

//Loading from local storage and drawing the notes on load of the page
function load() {
  let strNotes = localStorage.getItem("notes");
  if (!strNotes) {
    return;
  }
  let notes = JSON.parse(strNotes);

  let container = document.getElementById("containerDiv");
  container.innerHTML = "";

  for (let index = 0; index < notes.length; index++) {
    addNewNoteCard(notes, container, index);
  }
}

//Removing notes from the local storage
function removeNoteFromLocalStorage(notes, noteId) {
  for (let index = 0; index < notes.length; index++) {
    if (notes[index].id == noteId) {
      notes.splice(index, 1);
    }
  }
  localStorage.setItem("notes", JSON.stringify(notes));
}


//Custom Date Picker 

$("#datepicker").datepicker({
  maxDate: "+1m",
  minDate: "-1m",
  dateFormat: "dd/mm/yy",
});

load();
