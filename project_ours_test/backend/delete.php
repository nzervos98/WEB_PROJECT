<?php
session_start();

$id = $_SESSION["id"];

$conn = new mysqli('localhost','root','','database_test');

if ($conn->connect_error) 
{
    die(json_encode(array("status"=>"fail","msg"=>"database connection error")));
}


$sql = "call deleteData()";

$result = $conn->query($sql);

echo(json_encode(array("msg"=>"success")));

?>