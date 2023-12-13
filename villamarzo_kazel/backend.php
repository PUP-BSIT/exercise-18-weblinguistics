<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin:*");
header("Access-Control-Allow-Methods:*");
header("Access-Control-Allow-Headers:*");

// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "db_exercise_18";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handling CRUD operations
$request_method = $_SERVER["REQUEST_METHOD"];

switch ($request_method) {
    case 'GET':
        // Get songs list
        $query = "SELECT * FROM villamarzo_table";
        $result = $conn->query($query);

        $songs = array();
        if ($result->num_rows) {
            while ($row = $result->fetch_assoc()) {
                $songs[] = $row;
            }
        }
        echo json_encode($songs);
        break;

    case 'POST':
        // Create a new song
        $data = json_decode(file_get_contents("php://input"), true);

        $title = $data['title'];
        $artist = $data['artist'];
        $genre = $data['genre'];
        $writer = $data['writer'];
        $year = $data['year'];

        $query = "INSERT INTO villamarzo_table (title, artist, genre, writer, year) 
            VALUES ('$title', '$artist', '$genre', '$writer', $year)";
        if ($conn->query($query)) {
            echo "Song added successfully";
        } else {
            echo "Error: " . $conn->error;
        }
        break;

    case 'PATCH':
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, TRUE);

        $id = $input['id'];
        $title = $input['title'];
        $artist = $input['artist'];
        $genre = $input['genre'];
        $writer = $input['writer'];
        $year = $input['year'];

        $query = "UPDATE villamarzo_table SET 
            title='$title', artist='$artist', genre='$genre', 
            writer='$writer', year=$year WHERE id=$id";
        if ($conn->query($query)) {
            echo "Song updated successfully";
        } else {
            echo "Error: " . $conn->error;
        }
        break;

    case 'DELETE':
        // Delete song
        parse_str(file_get_contents("php://input"), $data);
        $id = $data['id'];

        $query = "DELETE FROM villamarzo_table WHERE id=$id";
        if ($conn->query($query)) {
            echo "Song deleted successfully";
        } else {
            echo "Error: " . $conn->error;
        }
        break;

    case 'OPTIONS':
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PATCH");
        header("Access-Control-Allow-Headers: Content-Type");
        header("HTTP/1.1 200 OK");
        break;

    default:
        // Invalid Request Method
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}

$conn->close();
?>
