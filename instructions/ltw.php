<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$conn = mysqli_connect('localhost', 'root', '', 'ltw-database');


$data0 = json_encode(['message' => 'processing']);

if (isset($_POST['flag_register'])){
    $data1 = json_encode(['status' => 'success', 'message' => 'Registration in loading...']);
    register($conn, $data0, $data1);
}
else if (isset($_POST['flag_login'])){
    $data1 = json_encode(['status' => 'success', 'message' => 'Login in loading...']);
    login($conn, $data0, $data1);
}
else if (isset($_POST['flag_upload'])){
    $data1 = json_encode(['status' => 'success', 'message' => 'Save in loading...']);
    save($conn, $data0, $data1);
}
else if (isset($_POST['flag_delete'])){
    $data1 = json_encode(['status' => 'success', 'message' => 'Delete in loading...']);
    delete($conn, $data0, $data1);
}

function save($conn, $data0, $data1){
    $data2 = null;
    $data3 = null;
    $data4 = null;
    $data5 = null;
    $data6 = null;
    //Matrix viene ricevuta già come JSON
    $username = $_POST['username'];
    $matrix = $_POST['matrix'];

    //Controlli su username
    if (empty($username)) {
        $data2 = json_encode(['status'=> 'error','message'=> 'Empty username']);
        $result = [$data0, $data1, $data2];
        echo json_encode($result);
        return;
    }
    $query = "SELECT username from users WHERE username = '$username'";
    $result = mysqli_query($conn, $query);
    //Username non esistente
    if (mysqli_num_rows($result) == 0){
        $data3 = json_encode(["status"=> "error","message"=> "Username non presente"]);
        $result = [$data0, $data1, $data2, $data3]; 
        echo json_encode($result);
        return;
    }

    //Controllo su matrice
    if (empty($matrix)){
        $data4 = json_encode(['status'=> 'error','message'=> 'Empty matrix']);
        $result = [$data0, $data1, $data2, $data3, $data4];
        echo json_encode($result);
        return;
    }

    $query = "INSERT into data values('$username', '$matrix')";
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

function delete($conn, $data0, $data1){
    $data2 = null;
    $data3 = null;
    $data4 = null;
    $data5 = null;
    $data6 = null;
    
    //Matrix viene ricevuta già come JSON
    $username = $_POST['username'];
    $matrix = $_POST['matrix'];

    //Controlli su username
    if (empty($username)) {
        $data2 = json_encode(['status'=> 'error','message'=> 'Empty username']);
        $result = [$data0, $data1, $data2];
        echo json_encode($result);
        return;
    }
    $query = "SELECT username from users WHERE username = '$username'";
    $result = mysqli_query($conn, $query);
    //Username non esistente
    if (mysqli_num_rows($result) == 0){
        $data3 = json_encode(["status"=> "error","message"=> "Username non presente"]);
        $result = [$data0, $data1, $data2, $data3]; 
        echo json_encode($result);
        return;
    }

    //Controllo su matrice
    if (empty($matrix)){
        $data4 = json_encode(['status'=> 'error','message'=> 'Empty matrix']);
        $result = [$data0, $data1, $data2, $data3, $data4];
        echo json_encode($result);
        return;
    }
    $query = "DELETE FROM data WHERE username='$username' AND matrix='$matrix'";
    if (mysqli_query($conn, $query)){
        $data5 = json_encode(['message' => 'Eliminazione della matrice riuscita']);
        $result = [$data0, $data1, $data2, $data3, $data4, $data5];
        echo json_encode($result);
        return;
    }else{
        $data5 = json_encode(['message' => 'Eliminazione della matrice fallita']);
        $result = [$data0, $data1, $data2, $data3, $data4, $data5, $data6];
        echo json_encode($result);
        return;
    }
}

function login($conn, $data0, $data1){
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
    //Controllo che lo username sia registrato
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

    //Seleziono tutte le matrici precedentemente registra all'interno della tabella data
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


