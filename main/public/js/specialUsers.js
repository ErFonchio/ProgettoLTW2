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

    //Creazione div
    for (var username in dizionario) {
        // Crea un nuovo elemento div
        var div = document.createElement('div');
        div.className = 'specialUser';
    
        // Crea un elemento h2 per il titolo
        var h2 = document.createElement('h2');
        h2.textContent = username;
    
        // Aggiungi l'h2 al div
        div.appendChild(h2);
    
        // Aggiungi il div al body del documento
        document.body.appendChild(div);
    }
}


