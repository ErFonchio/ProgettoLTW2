# Inserimento del server
Nella cartella htdocs di xampp create una cartella LTW in cui inserire il file ltw.php che ho pushato assieme a questo documento. Da xampp avviate i server apache e mysql.

# Preparazione database
- Create un database che si chiama LTW-database. Al suo interno create due tabelle: users e data. 
- Users ha due campi: username varchar(100) primary key, password varchar(100). 
- Data ha due campi: username varchar(100), matrix JSON.
- Dal momento che data(username) deve fare riferimento a users(username) bisogna inserire una foreign_key: entrare nella tabella data, selezionare "Struttura" nella lista in alto, cliccare su "Vista relazioni", nominare il vincolo come si vuole e negli ultimi quattro riquadri inserire in ordine "username", "LTW-database", "users", "username". Salvare.

# Funzionamento del server

``` php

<?php
//Questi header servono per far accedere il server da qualunque origine
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

//Connessinoe al database con nome dell'host, utente, password e nome database
$conn = mysqli_connect('localhost', 'root', '', 'LTW-database');

/*
Funzionamento comunicazione con il server:
troverete delle variabili $data_n in tutto il codice. Tutte queste sono messaggi wrappati in json e poi inviati TUTTI INSIEME prima che il server faccia una return. Questo è stato fatto perché per far sì che il client legga correttamente i dati json, questi devono essere inviati tutti insieme in un blocco json, e non divisi (scrivendo più volte echo). I $data vengono quindi racchiusi tutti alla fine in una lista che anch'essa è convertita in JSON. Come potete notare vengono inviati anche i dati che sono vuoti e che non sono mai stati riempiti all'interno degli if. Questo perché il client distingue il tipo di messaggio in base alla posizione del messaggio nell'array. Quindi ogni posizione ha dedicato uno spazio per un messaggio specifico, es: in posizione 0 "utente registrato", in posizione 2 "password falsa", etc...
*/

$data0 = json_encode(['message' => 'processing']);

//Isset controlla la validità della globale $_POST che viene modificata nel momento in cui viene ricevuta una chiamata post
//Le flag sono specifiche per capire cosa sta chiedendo l'utente
if (isset($_POST['flag_register'])){
    $data1 = json_encode(['status' => 'success', 'message' => 'Registration in loading...']);
    register($conn, $data0, $data1);
}
else if (isset($_POST['flag_login'])){
    $data1 = json_encode(['status' => 'success', 'message' => 'Login in loading...']);
    login($conn, $data0, $data1);
}
//Upload delle matrici
else if (isset($_POST['flag_upload'])){
    $data1 = json_encode(['status' => 'success', 'message' => 'Save in loading...']);
    save($conn, $data0, $data1);
}

function save($conn, $data0, $data1){
    $data2 = null;
    $data3 = null;
    $data4 = null;
    $data5 = null;
    $data6 = null;
    //salvo i parametri inviati con la post
    $username = $_POST['username'];
    $matrix = $_POST['matrix'];

    //Controlli su username
    if (empty($username)) { //Ho inviato una stringa vuota?
        $data2 = json_encode(['status'=> 'error','message'=> 'Empty username']);
        $result = [$data0, $data1, $data2];
        echo json_encode($result);
        return;
    }
    //Query per controllo su user
    $query = "SELECT username from users WHERE username = '$username'";
    //Viene inviata la query alla base di dati
    $result = mysqli_query($conn, $query);
    //Controlla il numero di righe ritornare dal dbms
    if (mysqli_num_rows($result) == 0){
        $data3 = json_encode(["status"=> "error","message"=> "Username non presente"]);
        $result = [$data0, $data1, $data2, $data3]; 
        echo json_encode($result);
        return;
    }

    //Controllo su matrice
    if (empty($matrix)){ //Ho inviatao una matrice vuota?
        $data4 = json_encode(['status'=> 'error','message'=> 'Empty matrix']);
        $result = [$data0, $data1, $data2, $data3, $data4];
        echo json_encode($result);
        return;
    }

    //Query per inserire la matrice nuova
    $query = "INSERT into data values('$username', '$matrix'";
    if (mysqli_query($conn, $query)){
        $data5 = json_encode(['message' => 'Inserimento della matrice riuscito']);
        $result = [$data0, $data1, $data2, $data3, $data4, $data5];
        echo json_encode($result);
        return;
    }else{
        $data5 = json_encode(['message' => 'Inserimento della matrice fallito']);
        $result = [$data0, $data1, $data2, $data3, $data4, $data5, $data6];
        echo json_encode($result);
        return;
    }
}

function login($conn, $data0, $data1){
    $data2 = null;
    $data3 = null;
    $data4 = null;
    //Salvo i parametri inviati con la post
    $username = $_POST['username'];
    $password = $_POST['password'];

    //Controllo se username e password non siano nulli
    if (empty($username) || empty($password)){
        $data2 = json_encode(['message' => 'username o password nulli']);
        $result = [$data0, $data1, $data2];
        echo json_encode($result);
        return;
    }
    //Controllo che lo username sia registrato con la query
    $query = "SELECT username FROM users WHERE username = '$username'";
    $result = mysqli_query($conn, $query);
    if (mysqli_num_rows($result) == 0){
        //L'utente non si è ancora registrato
        $data3 = json_encode(["message"=> "Non ti sei ancora registrato"]);
        $result = [$data0, $data1, $data2, $data3];
        echo json_encode($result);
        return;
    }

    //Controllo che la password sia giusta
    $query = "SELECT password from users WHERE username = '$username' and password = '$password'";
    $result = mysqli_query($conn, $query);
    if (mysqli_num_rows($result) == 0){
        //La password è errata
        $data4 = json_encode(["message"=> "Password errata, ritenta"]);
        $result = [$data0, $data1, $data2, $data3, $data4];
        echo json_encode($result);
        return;
    }

    //Seleziono tutte le matrici precedentemente registra all'interno della tabella data e le invio con echo
    $query = "SELECT matrix from data WHERE username = '$username'";
    $result = mysqli_query($conn, $query);

    $matrices = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $matrices[] = $row['matrix'];
    }

    $data5 = json_encode(["message" => $matrices]);
    $result = [$data0, $data1, $data2, $data3, $data4, $data5];
    echo json_encode($result);
    return;
}

function register($conn, $data0, $data1){
    $data2 = null;
    $data3 = null;
    $data4 = null;
    $username = $_POST['username'];
    $password = $_POST['password'];

    if (empty($username) || empty($password)){
        $data2 = json_encode(['message' => 'username o password nulli']);
        $result = [$data0, $data1, $data2];
        echo json_encode($result);
        return;
    }

    //Inserisco il valore di username e password all'interno della tabella users, 
    //controllando che non ci sia già lo stesso username
    $query = "SELECT username FROM users WHERE username = '$username' ";
    $result = mysqli_query($conn, $query);
    if (mysqli_num_rows($result) > 0){
        //C'è già la presenza di uno user
        $data3 = json_encode(['message' => 'User gia presente']);
        $response = [$data0, $data1, $data2, $data3]; 
        echo json_encode($response);
        return;
    }

    //Inserisco il nuovo user e password
    $query = "INSERT INTO users(username, password) VALUES('$username', '$password')";

    if(mysqli_query($conn, $query)){
        $data4 = json_encode(["status"=> "success","message"=> "Registrazione riuscita"]);
        $response = [$data0, $data1, $data2, $data3, $data4];
        echo json_encode($response);
    } else{
        $data5 = json_encode(["status"=> "success","message"=> "Registrazione fallita"]);
        $response = [$data0, $data1, $data2, $data3, $data4, $data5];
        echo json_encode($response);
    }

    return;
}

```

# Funzionamento client

``` javascript


function register(){
    //PermissionLogin mi serve per capire quando sto utilizzando un utente
    permissionLogin = false;
    //Inizializzo la flag da inviare al server per fargli riconoscere le mie intenzioni
    var flag_register = 1;
    //Prendo i valori di username e password
    var username = document.getElementById('id-username-signup').value;
    var password = document.getElementById('id-password-signup').value;

    //I parametri da inviare al server vanno inseriti con "[nome_campo]="+campo.
    //Quando inserisco più parametri questi vanno separati con un "&" all'inizio
    var params = "flag_register="+flag_register+"&username="+username+"&password="+password;

    //Robe per inizalizzare una richiesta XML
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost/LTW/ltw.php', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    
    xhr.send(params); //Invio i parametri
    //Funzione che raccoglie gli echo del server
    xhr.onload = function(){ 
        //I dati vengono ricevuti
        var data = JSON.parse(this.responseText);
        //Ogni indice dell'array è destinato ad un errore diverso: se questo è un indice non vuoto allora posso estrarre il messaggio e stamparlo sulla console

        //Le funzioni setCustoValidity servono per far comparire i popup di errore: molto figo!
        if (data.length >= 3 && data[2] != null){
            console.log(JSON.parse(data[2]).message);
            document.getElementById('id-username-signup').setCustomValidity("Username o password non validi");
        }

        //User già in uso
        else if (data.length >= 4 && data[3] != null){
            console.log(JSON.parse(data[3]).message);
            document.getElementById('id-username-signup').setCustomValidity("User già in uso");

        }
        //Questo comunica se la registrazione è riuscita
        else if (data.length >= 5 && data[4] != null){
            console.log(JSON.parse(data[4]).message);
            hideSignupForm();
            showLoginForm();
        }
        else if (data.length >= 6 && data[5] != null){
            document.getElementById('id-username-signup').setCustomValidity("Inserimento fallito");
            console.log(JSON.parse(data[4]).message);
        }
    }
}

function login(){
    permissionLogin = false;
    var flag_login = 1;
    var username = document.getElementById('id-username-login').value;
    var password = document.getElementById('id-password-login').value;
    console.log("Stai provando a fare il login con ", username, password);
    var params = "flag_login="+flag_login+"&username="+username+"&password="+password;

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost/LTW/ltw.php', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.send(params);

    xhr.onload = function(){
        var data = JSON.parse(this.responseText);

        if (data.length >= 3 && data[2] != null){
            console.log(JSON.parse(data[2]).message);
            document.getElementById('id-username-login').setCustomValidity("Username o password non validi");
        }

        //L'utente non si è ancora registrato
        else if (data.length >= 4 && data[3] != null){
            console.log(JSON.parse(data[3]).message);
            document.getElementById('id-username-login').setCustomValidity("Utente non ancora registrato");

        }
        //Questo comunica se la password inserita è errata
        else if (data.length >= 5 && data[4] != null){
            console.log(JSON.parse(data[4]).message);
        }
        //Login riuscito: sono arrivati 0 o più corrispondenze dalla tabella data
        else if (data.length >= 6 && data[5] != null){
            matrixList = JSON.parse(data[5]).message;
            permissionLogin = true;
            eliminaListaDiv(); //Rimuove gli stati registrati fino a questo momento
            //Inserisce nel pannello di sinistra le matrici del database
            printDownloadedMatrix(matrixList);
            hideLoginForm();
        }
    }
}

function printDownloadedMatrix(list){
    for (let i=0; i<list.length; i++){
        aggiungiDiv(JSON.parse(list[i]));
    }
}

function uploadMatrix(){
    var flag_upload = 1;
    var username = document.getElementById('id-username-login').value;
    var matrix = JSON.stringify(savedMatrix);
    //Non hai i permessi per l'upload
    if (username == '' || !flag_upload) return;

    var params = "flag_upload="+flag_upload+"&username="+username+"&matrix="+matrix;

    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost/LTW/ltw.php', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    xhr.send(params);

    xhr.onload = function(){
        var data = JSON.parse(this.responseText);

        //Empty username
        if (data.length >= 3 && data[2] != null){
            console.log(JSON.parse(data[2]).message);
        }
        //Username non esistente
        else if (data.length >= 4 && data[3] != null){
            console.log(JSON.parse(data[3]).message);
        }
        //Matrice vuota
        else if (data.length >= 5 && data[4] != null){
            console.log(JSON.parse(data[4]).message);
        }
        //Sono arrivati 0 o più corrispondenze dalla tabella data
        else if (data.length >= 6 && data[5] != null){
            console.log(JSON.parse(data[5]).message);
        }
        //Inserimento della matrice fallito
        else if (data.length >= 6 && data[5] != null){
            console.log(JSON.parse(data[5]).message);
        }
    }
}

```
