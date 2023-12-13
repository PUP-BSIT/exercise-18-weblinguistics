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
        $query = "SELECT * FROM fidel_table";
        $result = $conn->query($query);

        $entities = array();
        if ($result->num_rows) {
            while ($row = $result->fetch_assoc()) {
                $entities[] = $row;
            }
        }
        echo json_encode($entities);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);

        $brand_name = $data['brand_name'];
        $industry = $data['industry'];
        $founded_year = $data['founded_year'];
        $founders = $data['founders'];
        $headquarters = $data['headquarters'];

        $query = "INSERT INTO fidel_table (brand_name, industry, 
			founded_year, founders, headquarters) 
            VALUES ('$brand_name', '$industry', '$founded_year', 
			'$founders', '$headquarters')";
        if ($conn->query($query)) {
            echo "Entity added successfully";
        } else {
            echo "Error: " . $conn->error;
        }
        break;

    case 'PATCH':
        $inputJSON = file_get_contents('php://input');
        $input = json_decode($inputJSON, TRUE);

        $id = $input['id'];
        $brand_name = $input['brand_name'];
        $industry = $input['industry'];
        $founded_year = $input['founded_year'];
        $founders = $input['founders'];
        $headquarters = $input['headquarters'];

        $query = "UPDATE fidel_table SET 
            brand_name='$brand_name', industry='$industry', 
			founded_year='$founded_year', 
            founders='$founders', headquarters='$headquarters'
			WHERE id=$id";
        if ($conn->query($query)) {
            echo "Entity updated successfully";
        } else {
            echo "Error: " . $conn->error;
        }
        break;

    case 'DELETE':
        parse_str(file_get_contents("php://input"), $data);
        $id = $data['id'];

        $query = "DELETE FROM fidel_table WHERE id=$id";
        if ($conn->query($query)) {
            echo "Entity deleted successfully";
        } else {
            echo "Error: " . $conn->error;
        }
        break;

    case 'OPTIONS':
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS, 
			DELETE, PATCH");
        header("Access-Control-Allow-Headers: Content-Type");
        header("HTTP/1.1 200 OK");
        break;
		
    default:
        header("HTTP/1.0 405 Method Not Allowed");
        break;
}

$conn->close();
?>