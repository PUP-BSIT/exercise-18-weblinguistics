<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin:*");
header("Access-Control-Allow-Methods:*");
header("Access-Control-Allow-Headers:*");

$servername = "127.0.0.1:3306";
$username = "u722605549_db_exe18_user";
$password = "?zz8v1H&";
$dbname = "u722605549_db_exercise18";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'GET':
        $query = "SELECT * FROM nabayra_table";
        $result = $conn->query($query);

        $characters = array();
        if ($result->num_rows) {
            while ($row = $result->fetch_assoc()) {
                $characters[] = $row;
            }
        }
        echo json_encode($characters);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);

        $name = $data['name'];
        $house = $data['house'];
        $birth_date = $data['birth_date'];
        $patronus = $data['patronus'];
        $wand = $data['wand'];

        $query = "INSERT INTO nabayra_table 
			(name, house, birth_date, patronus, wand)
            VALUES 
			('$name', '$house', '$birth_date', '$patronus', '$wand')";
        if ($conn->query($query)) {
            echo "Character added successfully";
        } else {
            echo "Error: " . $conn->error;
        }
        break;

    case 'PATCH':
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, TRUE);

        $id = $input['id'];
        $name = $input['name'];
        $house = $input['house'];
        $birth_date = $input['birth_date'];
        $patronus = $input['patronus'];
        $wand = $input['wand'];

        $query = "UPDATE nabayra_table SET 
            name='$name', house='$house', birth_date='$birth_date',
            patronus='$patronus', wand='$wand' WHERE id=$id";
        if ($conn->query($query)) {
            echo "Character updated successfully";
        } else {
            echo "Error: " . $conn->error;
        }
        break;

    case 'DELETE':
        parse_str(file_get_contents("php://input"), $data);
        $id = $data['id'];

        $query = "DELETE FROM nabayra_table WHERE id=$id";
        if ($conn->query($query)) {
            echo "Character deleted successfully";
        } else {
            echo "Error: " . $conn->error;
        }
        break;

    case 'OPTIONS':
        header("Access-Control-Allow-Origin:*");
        header("Access-Control-Allow-Methods:*");
        header("Access-Control-Allow-Headers:*");
        header("HTTP/1.1 200 OK");
        break;

    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}

$conn->close();
?>