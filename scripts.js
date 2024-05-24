let data = [];
let bin = [];
let jsonTemplate = {
    date: '',
    noteText: '',
    noteIndex: 0
}
let date;
let dateMs = 0;
let bottomHeight;
let shiftPerce = 0;
let noteBottomHeights = [];
let t = 5;

renderNotes();

function renderNotes() {
    if(localStorage.notes) {
        if(localStorage.bin) {
            bin = JSON.parse(localStorage.bin);
        }
        data = JSON.parse(localStorage.notes);
        let notes = JSON.parse(localStorage.notes);
        document.querySelector('.noteList').innerHTML = "";
        for(let i=0; i<notes.length; i++) {
            document.querySelector('.noteList').innerHTML += /* HTML */ `
                <div class="note">
                    <div class="noteTop displayFlex justContSpaceBet">
                        <div class="date">${data[i].date}</div>
                        <div class="deleteClose displayFlex justContSpaceBet">
                            <div class="delete" onclick="pushToBin(${i})">
                                <svg width="4.8vh" height="4.8vh" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20,20 Q25,25 50,50 Q75,75 80,80 M80,20 Q75,25 50,50 Q25,75 20,80" stroke="black" stroke-width="10" fill="none" stroke-linecap="round"/>
                                </svg>
                            </div>
                            <div class="close displayFlex" id="note${i}" onclick="closeOpenElem('${i}')">
                                <svg width="6vh" height="6vh" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                    <polygon points="50,30 70,70 30,70" fill="black" transform="rotate(-90, 50, 50)"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div class="noteBottom">
                        <div class="noteBottomInner">
                            <p id="pTag${i}">${data[i].noteText}</p>
                            <textarea name="" id="textarea${i}" class="displayNone"></textarea>
                            <button class="save displayNone" id="save${i}" onclick="save(event, ${i})">save</button>
                            <button class="edit" id="edit${i}" onclick="edit(event, ${i})">edit</button>
                        </div>
                    </div>
                </div>    
            `;
        }
    }else {
        document.querySelector('.noteList').innerHTML = "";
    }
    getNoteBottomHeights();
}

function getNoteBottomHeights() {
    noteBottomHeights = [];
    for(let i=0; i<document.querySelectorAll('.note .noteBottom').length; i++) {
        noteBottomHeights.push(document.querySelectorAll('.note .noteBottom')[i].offsetHeight);
    }
}

function renderBin() {
    document.querySelector('.binList').innerHTML = "";
    if(localStorage.bin) {
        bin = JSON.parse(localStorage.bin);
        for(let i=0; i<bin.length; i++) {
            document.querySelector('.binList').innerHTML += /* HTML */ `
                <div class="binItem displayFlex">
                    <div class="binItemDate">${bin[i].date}</div>
                    <div class="binItemNoteText"><p>${bin[i].noteText}</p></div>
                    <div class="buttons displayFlex">
                        <button onclick="restoreNote(event, ${i})">Restore note</button>
                        <button onclick="removeFromBin(event, ${i})">Remove note</button>
                    </div>
                </div>
            `;
        }
    }
}

let addNoteTextarea = document.querySelector('#addNoteTextarea');

function stopPropag(event) {
    event.stopPropagation();
}

function openNoteOverlay() {
    document.querySelector('.noteOverlay').classList.remove('displayNone');
}

function closeNoteOverlay() {
    document.querySelector('.noteOverlay textarea').value = "";
    document.querySelector('.noteOverlay').classList.add('displayNone');
}

function addNote(event) {
    event.stopPropagation();
    let val = document.querySelector('#addNoteTextarea').value;
    if(val === "") {
        return;
    }else {
        jsonTemplate.noteText = val;
        jsonTemplate.date = receiveDate();
        data.push(jsonTemplate)
        updateLocalStorage();
        renderNotes();
        closeNoteOverlay();
    }
}

function receiveDate() {
    date = new Date();
    let dmy = "";
    dateMs = 
    dmy += date.getDate()+"."+date.getMonth()+"."+date.getFullYear()+" "+convertTime(date.getTime());
    return dmy;
}

function updateLocalStorage() {
    localStorage.removeItem('notes');
    localStorage.removeItem('bin');
    if(bin.length > 0) {
        localStorage.setItem('bin', JSON.stringify(bin));
    }
    if(data.length > 0) {
        localStorage.setItem('notes', JSON.stringify(data));
    }
}

function convertTime(time) {
    let hrs = Math.floor((time % (24 * 3600000))/3600000)+2;
    let min = Math.floor((time % 3600000)/60000);
    let sec = Math.floor((time % 60000)/1000);
    if(min < 10) {
        if(sec < 10) {
            return hrs + ":" + "0" + min + ":" + "0" + sec;
        }else {
            return hrs + ":" + "0" + min + ":" + sec;
        }
    }else {
        if(sec < 10) {
            return hrs + ":" + min + ":" + "0" + sec;
        }else {
            return hrs + ":" + min + ":" + sec;
        }
    }
}

function pushToBin(i) {
    data[i].noteIndex = i;
    bin.push(data[i]);
    data.splice(i, 1);
    updateLocalStorage();
    renderNotes();
    renderBin();
}

function removeFromBin(event, i) {
    event.stopPropagation();
    bin.splice(i, 1);
    updateLocalStorage();
    renderBin();
}

function restoreNote(event, i) {
    event.stopPropagation();
    data.splice(bin[i].noteIndex, 0, bin[i]);
    bin.splice(i, 1);
    updateLocalStorage();
    renderNotes();
    renderBin();
}

function openBin(event) {
    event.stopPropagation();
    document.querySelector('.binList').classList.remove('closed');
    document.querySelector('.binList').classList.add('opened');
    renderBin();
}

function closeBin() {
    let bin = document.querySelector('.binList');
    if(bin.classList.contains('opened')) {
        document.querySelector('.binList').classList.remove('opened');
        document.querySelector('.binList').classList.add('closed');
    }else {
        return;
    }
}

function edit(event, i) {
    event.preventDefault();
    let pTag = document.querySelector(`#pTag${i}`);
    let textfield = document.querySelector(`#textarea${i}`);
    pTag.classList.add('displayNone');
    textfield.classList.remove('displayNone');
    textfield.focus();
    document.querySelector(`#edit${i}`).classList.add('displayNone');
    document.querySelector(`#save${i}`).classList.remove('displayNone');
    textfield.value = pTag.innerHTML;
}

function save(event, i) {
    event.preventDefault();
    let pTag = document.querySelector(`#pTag${i}`);
    let textfield = document.querySelector(`#textarea${i}`);
    if(pTag.innerHTML === textfield.value) {
        pTag.classList.remove('displayNone');
        textfield.classList.add('displayNone');
        document.querySelector(`#save${i}`).classList.add('displayNone');
        document.querySelector(`#edit${i}`).classList.remove('displayNone');
        return;
    }else {
        data[i].noteText = textfield.value;
        data[i].date = receiveDate();
        updateLocalStorage();
        renderNotes();
    }
    getNoteBottomHeights();
}

function closeOpenElem(i) {
    let note = document.querySelectorAll('.note')[i];
    bottomHeight = noteBottomHeights[i];
    if(shiftPerce === 0) {
        if(note.classList.contains('opened')) {
            document.querySelectorAll('.note')[i].classList.remove('opened');
            document.querySelectorAll('.note')[i].classList.add('closed');
            shifter(i, "-");
        }else if(note.classList.contains('closed')) {
            document.querySelectorAll('.note')[i].classList.add('opened');
            document.querySelectorAll('.note')[i].classList.remove('closed');
            shifter(i, "+");
        }else {
            document.querySelectorAll('.note')[i].classList.remove('opened');
            document.querySelectorAll('.note')[i].classList.add('closed');
            shifter(i, "-");
        }
    }else {
        return;
    }
}

function shifter(i, sign) {
    let triangle = document.querySelectorAll('.note .noteTop .close svg')[i];
    let bottom = document.querySelectorAll('.note .noteBottom')[i];
    shiftPerce += 4;
    if(shiftPerce < 200) {
        if(sign === "-") {
            bottom.style.height = `${(200-shiftPerce)*noteBottomHeights[i]/200}px`;
            triangle.style.transform = `rotate(${0.45*shiftPerce-90}deg)`;
        }else if(sign === "+") {
            bottom.style.height = `${shiftPerce*noteBottomHeights[i]/200}px`;
            triangle.style.transform = `rotate(${-0.45*shiftPerce}deg)`;
        }
    }else {
        shiftPerce = 0;
        return;
    }
    setTimeout(()=>{shifter(i, sign)}, 10);
}

document.querySelector('body').addEventListener('click', closeBin);