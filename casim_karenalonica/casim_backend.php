<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: *");
header("Access-Control-Allow-Headers: *");

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
        $query = "SELECT * FROM casim_table";
        $result = $conn->query($query);

        $dataList = array();
        if ($result->num_rows) {
            while ($row = $result->fetch_assoc()) {
                $dataList[] = $row;
            }
        }
        echo json_encode($dataList);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);

        $title = $data['title'];
        $author = $data['author'];
        $publisher = $data['publisher'];
        $publication_year = $data['publication_year'];
        $genre = $data['genre'];

        $query = "INSERT INTO casim_table (title, author, publisher, 
			publication_year, genre) 
            VALUES ('$title', '$author', '$publisher', 
				'$publication_year', '$genre')";
        if ($conn->query($query)) {
            echo "Record added successfully";
        } else {
            echo "Error: " . $conn->error;
        }
        break;

    case 'PATCH':
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, TRUE);

        $id = $input['id'];
        $title = $input['title'];
        $author = $input['author'];
        $publisher = $input['publisher'];
        $publication_year = $input['publication_year'];
        $genre = $input['genre'];

        $query = "UPDATE casim_table SET 
            title='$title', author='$author', publisher='$publisher', 
            publication_year='$publication_year', 
				genre='$genre' WHERE id=$id";
        if ($conn->query($query)) {
            echo "Record updated successfully";
        } else {
            echo "Error: " . $conn->error;
        }
        break;

    case 'DELETE':
        parse_str(file_get_contents("php://input"), $data);
        $id = $data['id'];

        $query = "DELETE FROM casim_table 
			WHERE id=$id";
        if ($conn->query($query)) {
            echo "Record deleted successfully";
        } else {
            echo "Error: " . $conn->error;
        }
        break;

    case 'OPTIONS':
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: 
			POST, GET, OPTIONS, DELETE, PATCH");
        header("Access-Control-Allow-Headers: Content-Type");
        header("HTTP/1.1 200 OK");
        break;

    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}

$conn->close();
?>