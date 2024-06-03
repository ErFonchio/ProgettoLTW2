// SEZIONE PER IL RANKING
// Permette prima

document.addEventListener('DOMContentLoaded', initializeUsersPage);
function initializeUsersPage(){
    //Controllo sulla pagina di origine

    //Richiedi i dati degli utenti
    var users_page = 1;
    var listaUtenti = [];
    console.log("Stai provando a scaricare le info degli utenti speciali");
    var params = "users_page="+users_page;

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost/LTW/ltw.php', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.send(params);

    xhr.onload = function(){
        var data = JSON.parse(this.responseText);

        if (data[2] != null){
            console.log(JSON.parse(data[2]).message);
        }

        //Sei riuscito a scaricare le informazioni
        if (data[3] != null){
            console.log(JSON.parse(data[3]).message);
            listaUtenti = JSON.parse(data[3]).data;
            createUsersDiv(listaUtenti);

        }
        // Le informazioni che hai scaricato
        else{
            console.log(JSON.parse(data[4]).message);
            
        }
    }
    
}

function createUsersDiv(listaUtenti){
    var midWrapper = document.getElementById("id-midWrapper");
    var lista = JSON.parse(listaUtenti);
    var dizionario = {};

    for (var i = 0; i < lista.length; i++){
        var user = lista[i];
        var username = user['username'];
        var matrix = user['matrix'];

        if(dizionario[username]) {
            // Se l'username esiste già nel dizionario, aggiungi la matrice all'array esistente
            dizionario[username].push(matrix);
        } else {
            // Altrimenti, crea un nuovo array con la matrice
            dizionario[username] = [matrix];
        }
    }
    

    var usernames = Object.keys(dizionario);
    //Creazione div
    for (var i=0; i<usernames.length; i++) {
        var username = usernames[i];
        // Crea un nuovo elemento div
        var wrapper = document.createElement('div');
        wrapper.className = 'slider-wrapper';
        var matrix = dizionario[username];
    
        //Aggiungo il wrapper al container
        var container = document.createElement('section');
        //Aggiungo container a midWrapper
        //Container contiene wrapper + navigation bar
        midWrapper.appendChild(container);
        
        // Crea un elemento h2 per il titolo
        var h2 = document.createElement('h2');
        h2.textContent = username;
    
        midWrapper.appendChild(h2);
        container.appendChild(wrapper);

        //Aggiungo uno sliderNav al wrapper
        var sliderNav = document.createElement('div');
        sliderNav.className = 'slider-nav';

        //Prendo le matrici e le parso da JSON
        for (var j = 0; j < matrix.length; j++) {
            var img = document.createElement('img');
            img.src = createImageFromMatrix(JSON.parse(matrix[j]));
            slider = document.createElement('div');
            slider.className = 'slider';
            slider.appendChild(img);
            img.id = 'slider'+i+j;
            console.log("Stai creando lo slider: ", slider.id);
            wrapper.appendChild(slider);
            var a = document.createElement('a');
            a.href = '#slider' + i + j;
            sliderNav.appendChild(a); // Aggiungi l'elemento 'a' a 'sliderNav'
        }
        container.appendChild(sliderNav);
    }
    
}




function createImageFromMatrix(matrix) {
    // Creazione di un nuovo elemento canvas
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var cellColor = getComputedStyle(document.documentElement).getPropertyValue('--live-color').trim();

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

