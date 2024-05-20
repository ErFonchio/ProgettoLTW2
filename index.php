<?php

$dsn = "mysql:host=localhost;dbname=LTW-database";
$dbusername = "root";
$dbpassword = "";

try {
    $pdo = new PDO($dsn, $dbusername, $dbpassword); //Per la connessione al database
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    //Eseguo la query SQL
    $stmt = $pdo->query("SELECT * FROM users");
    //Prelevo tutti i risultati
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    //Invio i risultati come JSON
    
    echo json_encode($results);

} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}

