document.getElementById("createNoteButton").addEventListener('click', () => showCreate());
document.getElementById("optionsOpen").addEventListener('click', showOptions);
document.getElementById("optionsClose").addEventListener('click', hideOptions);
document.getElementById("submitNote").addEventListener('click', handleNotesSubmit);

let isOpen = false;
let isEditMode = false;
let currentNote = null;
let noteDiv = null;

// Load notes from localStorage when the page loads
window.onload = function () {
    loadNotes();
}

function showOptions() {
    console.log("Opening options");
    document.getElementById("optionsScreen").style.display = 'flex';
    document.getElementById("optionsOpen").style.display = 'none';
}

function hideOptions() {
    console.log("Hiding options");
    document.getElementById("optionsScreen").style.display = 'none';
    document.getElementById("optionsOpen").style.display = 'flex';
}

function showCreate(noteDiv) {
    console.log("Showing create/edit note form");
    const createNote = document.getElementById("createNote");
    const createNoteButton = document.getElementById('createNoteButton');
    const createNoteButtonSymbol = document.getElementById('createNoteButtonSymbol');

    if (!isOpen) {
        createNoteButtonSymbol.classList.toggle('rotate');
        createNote.style.display = 'flex';
        isOpen = true;
        createNoteButton.style.borderBottomLeftRadius = 0;
        createNoteButton.style.borderBottomRightRadius = 0;

        if (noteDiv) {
            console.log("Editing note", noteDiv);
            isEditMode = true;
            currentNote = noteDiv;
            document.getElementById('notesTitleInput').value = noteDiv.querySelector('h1').innerText;
            document.getElementById('notesContentInput').value = noteDiv.querySelector('h2').innerText;
        } else {
            console.log("Creating new note");
            isEditMode = false;
            currentNote = null;
            document.getElementById('notesTitleInput').value = '';
            document.getElementById('notesContentInput').value = '';
        }
    } else {
        hideCreate();
    }
}

function hideCreate() {
    console.log("Hiding create/edit note form");
    document.getElementById('createNoteButtonSymbol').classList.toggle('rotate');
    document.getElementById("createNote").style.display = 'none';
    const createNoteButton = document.getElementById('createNoteButton');
    isOpen = false;
    createNoteButton.style.borderBottomLeftRadius = '25px';
    createNoteButton.style.borderBottomRightRadius = '25px';
}

function handleNotesSubmit() {
    console.log("Submitting note");
    const notesTitle = document.getElementById('notesTitleInput').value;
    const notesContent = document.getElementById('notesContentInput').value;

    if (notesContent !== '' || notesTitle !== '') {
        if (isEditMode && currentNote) {
            console.log("Updating note", currentNote);
            updateNote(currentNote, notesTitle, notesContent);
        } else {
            console.log("Creating new note with title:", notesTitle, "content:", notesContent);
            createNote(notesTitle, notesContent);
        }

        document.getElementById('notesTitleInput').value = '';
        document.getElementById('notesContentInput').value = '';
        hideCreate();
        saveNotes();
    } else {
        alert("Note cannot be empty!");
    }
}

function createNote(notesTitle, notesContent) {
    console.log("Adding note to container");
    let notesContainer = document.getElementById("notesContainer");
    let fullScreenDiv = document.getElementById("fullScreen");
    let noteDiv = document.createElement('div');
    let buttonDiv = document.createElement('div');
    buttonDiv.classList.add('button-container');
    noteDiv.classList.add('notes-container');

    let title = document.createElement('h1');
    title.innerText = notesTitle;
    title.style.color = '#767676';

    let content = document.createElement('h2');
    content.innerText = notesContent;
    content.style.color = '#767676';
    content.style.fontWeight = 'normal';

    isWhiteModeOn = false;
    let whitemodeButton = document.createElement('button');
    whitemodeButton.style.backgroundColor = 'white';
    whitemodeButton.addEventListener('click', function () {
        if(!isWhiteModeOn) {
            whitemodeButton.style.backgroundColor = 'black';
            isWhiteModeOn = true;
            noteDiv.style.backgroundColor = 'white';
            title.style.color = 'black';
            content.style.color = 'black';
        }
        else {
            whitemodeButton.style.backgroundColor = 'white';
            isWhiteModeOn = false;
            noteDiv.style.backgroundColor = '#141c16';
            title.style.color = '#767676';
            content.style.color = '#767676';
        }
    });

    let deleteButton = document.createElement('button');
    deleteButton.innerText = 'X';
    deleteButton.addEventListener('click', function () {
        console.log("Deleting note", noteDiv);
        noteDiv.remove();
        saveNotes();
    });

    let editButton = document.createElement('button');
    editButton.innerText = 'Edit';
    editButton.addEventListener('click', function () {
        showCreate(noteDiv);
    });

    let fullScreen = document.createElement('button');
    fullScreen.innerText = 'Open';
    fullScreen.addEventListener('click', function () {
        fullScreenDiv.style.display = 'block';
        handleFullScreen(notesTitle, notesContent);
    });

    let closeFullScreen = document.getElementById("closeFullScreen");
    closeFullScreen.addEventListener('click', function () {
        fullScreenDiv.style.display = 'none';
        handleFullScreenClose();
    });

    noteDiv.appendChild(title);
    noteDiv.appendChild(content);
    buttonDiv.appendChild(whitemodeButton);
    buttonDiv.appendChild(deleteButton);
    buttonDiv.appendChild(editButton);
    buttonDiv.appendChild(fullScreen);
    noteDiv.appendChild(buttonDiv);
    notesContainer.appendChild(noteDiv);
}

function handleFullScreen(notesTitle, notesContent) {
    let fullScreen = document.getElementById("fullScreen");
    let fullScreenNoteTitle = document.createElement('h1');
    fullScreenNoteTitle.innerText = notesTitle;
    let fullScreenNoteContent = document.createElement('h2');
    fullScreenNoteContent.innerText = notesContent;
    fullScreen.appendChild(fullScreenNoteTitle);
    fullScreen.appendChild(fullScreenNoteContent);
}

function handleFullScreenClose() {
    let fullScreen = document.getElementById("fullScreen");
    fullScreen.querySelectorAll("h1, h2").forEach(element => {
        element.innerHTML = '';
    });
}

function updateNote(noteDiv, notesTitle, notesContent) {
    console.log("Updating note with title:", notesTitle, "content:", notesContent);
    noteDiv.querySelector('h1').innerText = notesTitle;
    noteDiv.querySelector('h2').innerText = notesContent;
    saveNotes();
}

function saveNotes() {
    let notesContainer = document.getElementById("notesContainer");
    let notes = notesContainer.querySelectorAll('.notes-container');
    let notesArray1 = [];

    notes.forEach(noteDiv => {
        let title = noteDiv.querySelector('h1').innerText;
        let content = noteDiv.querySelector('h2').innerText;
        notesArray1.push({ title: title, content: content });
    });

    localStorage.setItem('notes', JSON.stringify(notesArray1));
}

function loadNotes() {
    let savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        let notesArray1 = JSON.parse(savedNotes);
        notesArray1.forEach(note => {
            createNote(note.title, note.content);
        });
    }
}
