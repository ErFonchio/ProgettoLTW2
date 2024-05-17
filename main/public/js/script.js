var rows = 25;
var cols = 70;

var playing = false;

var grid = new Array(rows);
var nextGrid = new Array(rows);

var recordMatrix = new Array(rows);
var nextRecordMatrix = new Array(rows);
var savedMatrix = new Array(rows);


var timer;
var reproductionTime = 120;;

function initializeGrids() {
    for (var i = 0; i < rows; i++) {
        recordMatrix[i] = new Array(cols);
        nextRecordMatrix[i] = new Array(cols);
        savedMatrix = new Array(cols);
        grid[i] = new Array(cols);
        nextGrid[i] = new Array(cols);
    }
}

function resetGrids() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            recordMatrix[i][j] = 0;
            nextRecordMatrix[i][j] = 0;
            grid[i][j] = 0;
            nextGrid[i][j] = 0;
        }
    }
}

function copyAndResetGrid() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            recordMatrix[i][j] = nextRecordMatrix[i][j];
            grid[i][j] = nextGrid[i][j];
            nextGrid[i][j] = 0;
            nextRecordMatrix[i][j] = 0;
        }
    }
}

// Initialize
function initialize() {
    
    isMobileOrDesktop()
    createTable();
    initializeGrids();
    resetGrids();
    setupControlButtons();
    adjustTableSize();
}

function adjustTableSize(){

}

// Lay out the board
function createTable() {
    var gridContainer = document.getElementById('gridContainer');
    if (!gridContainer) {
        // Throw error
        console.error("Problem: No div for the grid table!");
    }
    var table = document.createElement("table");
    
    for (var i = 0; i < rows; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < cols; j++) {//
            var cell = document.createElement("td");
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("class", "dead");
            cell.onclick = cellClickHandler;
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    gridContainer.appendChild(table);
    }

    function cellClickHandler() {
        var rowcol = this.id.split("_");
        var row = rowcol[0];
        var col = rowcol[1];
        
        var classes = this.getAttribute("class");
        if(classes.indexOf("live") > -1) {
            this.setAttribute("class", "dead");
            grid[row][col] = 0;
            recordMatrix[row][col] = 0;
        } else {
            this.setAttribute("class", "live");
            grid[row][col] = 1;
            recordMatrix[row][col] = 1;
        }
        
    }

    function updateView() {
        isStillAlive();
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                var cell = document.getElementById(i + "_" + j);
                if (grid[i][j] == 0) {
                    cell.setAttribute("class", "dead");
                } else {
                    cell.setAttribute("class", "live");
                }
            }
        }
    }


function saveGame(){
    savedMatrix = JSON.parse(JSON.stringify(recordMatrix));
    console.log("Saved Matrix: ", savedMatrix);
}

// load the newest saved matrix
function loadGame() {
    console.log("Load Game button pressed");
    if (playing) return;
    clearButtonHandler();
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var thisCell = savedMatrix[i][j];
            if (thisCell == 1) {
                var cell = document.getElementById(i + "_" + j);
                cell.setAttribute("class", "live");
                grid[i][j] = 1;
                recordMatrix[i][j] = 1;
            }
            else {
                var cell = document.getElementById(i + "_" + j);
                cell.setAttribute("class", "dead");
                grid[i][j] = 0;
                recordMatrix[i][j] = 0;
            }
        }
    }
}

// listener del bottone save
document.getElementById('save').addEventListener('click', saveGame);

// listener del bottone load
document.getElementById('load').addEventListener('click', loadGame);

// se il numero di celle vive è 0 fermo il gioco

function isStillAlive(){
    var cellsList = document.getElementsByClassName("live");
    var cellCounter = cellsList.length;
    console.log("Number of live cells: ", cellCounter);
    var cellCounterField = document.getElementById("cell-counter");
    cellCounterField.innerHTML = cellCounter;
    if(cellsList.length == 0){
        console.log("GAME OVER");
        var startButton = document.getElementById('start');
        startButton.innerHTML = '<span class="material-symbols-outlined">play_arrow</span>';
        startButtonHandler();
        
    }
}


function setupControlButtons() {
    // button to start
    var startButton = document.getElementById('start');
    startButton.onclick = startButtonHandler;
    
    // button to clear
    var clearButton = document.getElementById('clear');
    clearButton.onclick = clearButtonHandler;
    
    // button to set random initial state
    var randomButton = document.getElementById("random");
    randomButton.onclick = randomButtonHandler;
}

function randomButtonHandler() {
    if (playing) return;
    clearButtonHandler();
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var isLive = Math.round(Math.random());
            if (isLive == 1) {
                var cell = document.getElementById(i + "_" + j);
                cell.setAttribute("class", "live");
                grid[i][j] = 1;
                recordMatrix[i][j] = 1;
            }
        }
    }
}


// clear the grid
function clearButtonHandler() {
    console.log("Clear the game: stop playing, clear the grid");
    
    playing = false;
    var startButton = document.getElementById('start');
    startButton.innerHTML = '<span class="material-symbols-outlined">play_arrow</span>';    
    clearTimeout(timer);
    
    var cellsList = document.getElementsByClassName("live");
    // convert to array first, otherwise, you're working on a live node list
    // and the update doesn't work!
    var cells = [];
    for (var i = 0; i < cellsList.length; i++) {
        cells.push(cellsList[i]);
    }
    
    for (var i = 0; i < cells.length; i++) {

        cells[i].setAttribute("class", "dead");
    }
    for(var i=0; i<rows; i++){
        for(var j=0; j<cols; j++){
            recordMatrix[i][j]=0;
            grid[i][j]=0;
        }
    }
}

// start/pause/continue the game
function startButtonHandler() {
    if (playing) {
        console.log("Pause the game");
        playing = false;
        this.innerHTML = '<span class="material-symbols-outlined">play_arrow</span>';
        clearTimeout(timer);
    } else {
        console.log("Continue the game");
        playing = true;
        this.innerHTML = '<span class="material-symbols-outlined">pause</span>';
        play();
    }
}

// run the life game
function play() {
    reproductionTime = getFPSvalue();
    console.log("record Matrix: ", recordMatrix);
    
    computeNextGen();
    
    if (playing) {
        timer = setTimeout(play, reproductionTime);
    }
}

function computeNextGen() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            applyRules(i, j);
        }
    }
    
    // copy NextGrid to grid, and reset nextGrid
    copyAndResetGrid();
    // copy all 1 values to "live" in the table
    updateView();
}

// RULES
// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
// Any live cell with two or three live neighbours lives on to the next generation.
// Any live cell with more than three live neighbours dies, as if by overcrowding.
// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.

function applyRules(row, col) {
    var numNeighbors = countNeighbors(row, col);
    if (grid[row][col] == 1) {
        if (numNeighbors < 2) {
            nextGrid[row][col] = 0;
            nextRecordMatrix[row][col] = 0;
        } else if (numNeighbors == 2 || numNeighbors == 3) {
            nextGrid[row][col] = 1;
            nextRecordMatrix[row][col] = 1;
        } else if (numNeighbors > 3) {
            nextGrid[row][col] = 0;
            nextRecordMatrix[row][col] = 0;
        }
    } else if (grid[row][col] == 0) {
            if (numNeighbors == 3) {
                nextGrid[row][col] = 1;
                nextRecordMatrix[row][col] = 1;
            }
        }
    }
    
function countNeighbors(row, col) {
    var count = 0;
    if (row-1 >= 0) {
        if (grid[row-1][col] == 1) count++;
    }
    if (row-1 >= 0 && col-1 >= 0) {
        if (grid[row-1][col-1] == 1) count++;
    }
    if (row-1 >= 0 && col+1 < cols) {
        if (grid[row-1][col+1] == 1) count++;
    }
    if (col-1 >= 0) {
        if (grid[row][col-1] == 1) count++;
    }
    if (col+1 < cols) {
        if (grid[row][col+1] == 1) count++;
    }
    if (row+1 < rows) {
        if (grid[row+1][col] == 1) count++;
    }
    if (row+1 < rows && col-1 >= 0) {
        if (grid[row+1][col-1] == 1) count++;
    }
    if (row+1 < rows && col+1 < cols) {
        if (grid[row+1][col+1] == 1) count++;
    }
    return count;
}

// Start everything
window.onload = initialize;

// restituisce il tipo di dispositivo con cui l'utente è collegato
function isMobileOrDesktop() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        console.log("Mobile");
        return "Mobile";
    } else {
        console.log("Desktop");
        return "Desktop";
    }
}

function getFPSvalue(){
    var fpsField = document.getElementById('fps-field');
    console.log("Current FPS Value: ",fpsField.value);
    value = parseInt(fpsField.value);
    var minInput = 240;
    var maxInput = 10;
    var minOutput = 20;
    var maxOutput = 400;
    
    var mappedValue = (value - minInput) * (maxOutput - minOutput) / (maxInput - minInput) + minOutput;
    console.log("Current Timeout value: ",mappedValue);
    return mappedValue;
}

function increaseFPS() {
    var fpsField = document.getElementById('fps-field');
    var currentValue = parseInt(fpsField.value);
    var newValue = currentValue + 10;
    if(newValue>240) newValue = 240;
    fpsField.value = newValue;
}

function decreaseFPS() {
    var fpsField = document.getElementById('fps-field');
    var currentValue = parseInt(fpsField.value);
    var newValue = currentValue - 10;
    if(newValue<10) newValue = 10;
    fpsField.value = newValue;
}

function checkFPSvalue() {
    var fpsField = document.getElementById('fps-field');
    var currentValue = parseInt(fpsField.value);
    if(currentValue<10) {
        currentValue = 10
        fpsField.value = 10;
    } else if(currentValue>240) {
        currentValue = 240;
        fpsField.value = 240;
    }

}


// listener del bottone per aumentare i frame per secondo
document.getElementById('increase-fps').addEventListener('click', increaseFPS);

// listener del bottone per diminuire i frame per secondo
document.getElementById('decrease-fps').addEventListener('click', decreaseFPS);

// listener del campo fps-value

document.getElementById('fps-field').addEventListener('change', checkFPSvalue);


// listener dell'orientamento dello schermo
screen.orientation.addEventListener("change", (event) => {
    const type = event.target.type;
    const angle = event.target.angle;
    isMobileOrDesktop()
    console.log(`ScreenOrientation change: ${type}, ${angle} degrees.`);
  });


//Gestione dei pannelli laterali
function LeftSidePanelSliding () {
    const co = document.getElementById('circle-ovest');
    const lsp = document.getElementById('left-side-panel');
    lsp.classList.toggle('slide-left');
    co.classList.toggle('rotate');
};


function RightSidePanelSliding() {
    const co = document.getElementById('circle-est');
    const lsp = document.getElementById('right-side-panel');
    lsp.classList.toggle('slide-right');
    co.classList.toggle('rotate');
};

function aggiungiDiv() {
    // Creare un nuovo elemento div
    var nuovoDiv = document.createElement('div');
    nuovoDiv.className = 'div-image'; // Aggiungere la classe 'child' al nuovo div
    nuovoDiv.style.paddingTop = '20px';

    var nuovaImmagine = document.createElement('img');
    nuovaImmagine.src = createImageFromMatrix(savedMatrix);
    var matrixHeight = savedMatrix.length;
    var matrixWidth = savedMatrix[0].length;
    var ratio = matrixWidth/matrixHeight;
    nuovaImmagine.style.height = '70px'
    nuovaImmagine.style.width = parseFloat(nuovaImmagine.style.height)*ratio +'px';
    nuovaImmagine.classList.add('item-image'); // Aggiungere la classe 'nuova-classe' all'immagine
    nuovaImmagine.id = 'id-item-image';

    /*Aggiorno dimensioni del div in base all'immagine*/
    nuovoDiv.style.left = "50%";
    nuovoDiv.style.width = nuovaImmagine.style.width;
    nuovoDiv.style.height = nuovaImmagine.style.height;

    //aggiunta dell'immagine e della X per l'eliminazione
    nuovoDiv.appendChild(nuovaImmagine);

    //Creazione del div popup da appendere all'immagine
    var popup = document.createElement('div');
    var divPopup = document.createElement('div');
    divPopup.className = 'div-popup';
    divPopup.style.height = nuovaImmagine.style.height;
    divPopup.style.weight = nuovaImmagine.style.weight;
    divPopup.style.top = nuovoDiv.style.paddingTop;

    popup.className = 'class-popup-left';
    popup.style.height = divPopup.style.height;

    nuovoDiv.append(divPopup);
    divPopup.append(popup);

    var popupTop = document.createElement('div');
    var popupDown = document.createElement('div');
    popupTop.className = 'popup-Top';
    popupDown.className = 'popup-Down';

    var deleteIcon = document.createElement('i');
    deleteIcon.classList.add('material-icons');
    deleteIcon.textContent = 'delete';
    var uploadIcon = document.createElement('i');
    uploadIcon.className = 'material-icons';
    uploadIcon.textContent = 'upload';
    
    popupTop.append(deleteIcon);
    popupDown.append(uploadIcon);
    popup.append(popupTop);
    popup.append(popupDown);


    // Aggiungere il nuovo div al div genitore
    var parentDiv = document.getElementById('scroll-container-ovest');

    parentDiv.append(nuovoDiv);
}
function LeftContainerEvent(event) { 
    if(event.target.className == 'popup-Top' || event.target.classList.contains('material-icons')) {
        var parentPanel = event.target.closest('.div-image'); // Trova il genitore del pulsante con la classe 'div-image'
        parentPanel.remove(); // Rimuovi il genitore dell'icona, ovvero il pannello grande che contiene l'immagine    
        
    }
    /*
    else if (event.target.id == 'id-item-image'){
        var currentOpacity = window.getComputedStyle(event.target).getPropertyValue('opacity');
        if (currentOpacity == 1){
            // Trova tutte le immagini nel pannello di sinistra
            var images = document.getElementById('scroll-container-ovest').querySelectorAll('img');
            
            // Imposta l'opacità di tutte le immagini a 1, tranne quella selezionata da event.target
            for (var i = 0; i < images.length; i++) {
                if (images[i] != event.target) {
                    images[i].style.opacity = '1.0';
                }
            }
            event.target.style.opacity = '0.6';
        }
        else{
            event.target.style.opacity = '1.0'
        }
    }
    */
    else if (event.target.classList.contains('upload')){
        
    }
};

function createImageFromMatrix(matrix) {
    // Creazione di un nuovo elemento canvas
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var cellColor = '#ff0000'; // rosso

    // Definisci la larghezza e l'altezza delle celle
    var cellWidth = 10;
    var cellHeight = 10;

    // Impostazione delle dimensioni del canvas
    canvas.width = matrix[0].length*cellWidth; // Larghezza basata sulla lunghezza delle colonne
    canvas.height = matrix.length*cellHeight; // Altezza basata sul numero di righe

    // Iterazione sull'array per disegnare sull'canvas
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === 1) {
                // Disegna un rettangolo pieno quando il valore è 1
                ctx.fillStyle = cellColor;
            }
            else{
                ctx.fillStyle = '#ffffff'; // bianco
            }
            // Disegna la cella
            ctx.fillRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
            // Disegna il bordo della cella
            ctx.strokeStyle = '#000000'; // nero
            ctx.strokeRect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
        }
    }
    // Restituisci il canvas creato
    return canvas.toDataURL();
};

function zoomIn(){
    console.log("CI sei");
    const table = document.querySelector('table');
    const cells = table.querySelectorAll('td');
    var cellSize = cells[0].offsetHeight;
    cellSize += 7;
        cells.forEach(cell => {
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
        });
}
function zoomOut(){
    console.log("CI sei");
    const table = document.querySelector('table');
    const cells = table.querySelectorAll('td');
    var cellSize = cells[0].offsetHeight;
    cellSize -= 7;
        cells.forEach(cell => {
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
        });
}

document.getElementById('save').addEventListener('click', aggiungiDiv);
document.getElementById('circle-ovest').addEventListener('click', LeftSidePanelSliding);
document.getElementById('circle-est').addEventListener('click', RightSidePanelSliding);
document.getElementById('scroll-container-ovest').addEventListener('click', LeftContainerEvent);
document.getElementById('zoom-in').addEventListener('click', zoomIn);
document.getElementById('zoom-out').addEventListener('click', zoomOut);


/*login form*/
function showLoginForm() {
    var ModalLog = document.getElementById("ModalLog");
    ModalLog.style.display = "block";
}

function hideLoginForm() {
    var ModalLog = document.getElementById("ModalLog");
    ModalLog.style.display = "none";
}

function showSignupForm() {
    var ModalLog = document.getElementById("ModalLog");
    ModalLog.style.display = "none";
    var ModalSign = document.getElementById("ModalSign");
    ModalSign.style.display = "block";
}

function hideSignupForm() {
    var ModalSign = document.getElementById("ModalSign");
    ModalSign.style.display = "none";
}

function backToLogin(){
    hideSignupForm();
    showLoginForm();
}