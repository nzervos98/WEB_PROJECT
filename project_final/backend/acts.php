<?php

$conn = new mysqli('localhost','root','','database_test');

if (mysqli_connect_error()) 
{
    die(json_encode(array("status"=>"failure","mg"=> mysqli_connect_error())));
}

$acts = array();	
$sql= "select distinct activity_type as act from locationData";
			
$res= mysqli_query($conn,$sql) or die(json_encode(array("status"=>"failure","msg"=>mysqli_error($conn))));
	while ($row = mysqli_fetch_assoc($res) ) {
		array_push($acts,$row["act"]);	
	}
		
echo json_encode(array("status"=>"success","acts"=>$acts));

?>