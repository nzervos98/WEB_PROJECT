<?php

$conn = new mysqli('localhost','root','','database_test');

if (mysqli_connect_error()) 
{
    die(json_encode(array("status"=>"fail","msg"=>"database connection error")));
}

/*
mysqli_query($conn,'SET CHARACTER SET utf8;');
mysqli_query($conn,'SET COLLATION_CONNECTION=utf8_general_ci;');
mysqli_query($conn,"SET sql_mode=(SELECT REPLACE(@@sql_mode,'ONLY_FULL_GROUP_BY',''))");
*/

//a Activity_Records
$sql_a = "SELECT username,userId,activity_type,COUNT(*) as Activity_Records FROM locationData INNER JOIN users ON users.id=locationData.userId GROUP BY activity_type ORDER BY Activity_Records DESC";

$result = $conn->query($sql_a);

if($result->num_rows > 0){
while ($row = $result->fetch_assoc()) {
	try{
    $data_a[$row["activity_type"]]=intval($row["Activity_Records"]);
	}catch(Exception $e){
    		die(json_encode(array("status"=>"fail","msg"=>$e->getMessage())));
	}
}
}else{
    die(json_encode(array("status"=>"fail","msg"=>$conn->error)));
}	

//b User_Records
$sql_b = "SELECT username,COUNT(*) as User_Records FROM locationData INNER JOIN users ON users.id=locationData.userId GROUP BY users.id ORDER BY User_Records DESC";
	
	
$result = $conn->query($sql_b);	

if($result->num_rows > 0){
while ($row = $result->fetch_assoc()) {
    $data_b[$row["username"]]=intval($row['User_Records']);
}
}else{
    die(json_encode(array("status"=>"fail","msg"=>$conn->error)));
}	
//var_dump($data_b);

	
//c Month_Records
$sql_c = "SELECT monthT, COUNT(*) AS Month_Records FROM locationData INNER JOIN timestampMs ON timestampMs.locationData = locationData.locationID GROUP BY monthT ORDER BY monthT ASC";
			
$result = $conn->query($sql_c);	
if($result->num_rows > 0){
while ($row = $result->fetch_assoc()) {
    $data_c[$row["monthT"]]=intval($row['Month_Records']);}
}else{
    die(json_encode(array("status"=>"fail","msg"=>$conn->error)));
}	
//d Day_Records
$sql_d = "SELECT dayT, COUNT(*) AS Day_Records FROM locationData INNER JOIN timestampMs ON timestampMs.locationData = locationData.locationID GROUP BY dayT ORDER BY dayT ASC";
			
$result = $conn->query($sql_d);				
if($result->num_rows > 0){
while ($row = $result->fetch_assoc()) {
    $data_d[$row["dayT"]]=intval($row['Day_Records']);
}
}else{
    die(json_encode(array("status"=>"fail","msg"=>$conn->error)));
}	
//var_dump($data_d);		
	
	
//e Hour_Records
$sql_e = "SELECT hourT, COUNT(*) AS Hour_Records FROM locationData INNER JOIN timestampMs ON timestampMs.locationData = locationData.locationID GROUP BY hourT ORDER BY hourT ASC";
			
$result = $conn->query($sql_e);	
if($result->num_rows > 0){
while ($row = $result->fetch_assoc()) {
    $data_e[$row["hourT"]]=intval($row['Hour_Records']);
}
}else{
    die(json_encode(array("status"=>"fail","msg"=>$conn->error)));
}	
//var_dump($data_e);	
	
	
//f Year_Records
$sql_f = "SELECT yearT, COUNT(*) AS Year_Records FROM locationData INNER JOIN timestampMs ON timestampMs.locationData = locationData.locationID GROUP BY yearT ORDER BY yearT ASC";
	
	
$result = $conn->query($sql_f);	
if($result->num_rows > 0){
while ($row = $result->fetch_assoc()) {
    $data_f[$row["yearT"]]=intval($row['Year_Records']);
}
}else{
    die(json_encode(array("status"=>"fail","msg"=>$conn->error)));
}	

//var_dump($data_f);	
	


$totalarray["Activity_Records"] = $data_a;
$totalarray["User_Records"] = $data_b;
$totalarray["Month_Records"] = $data_c;
$totalarray["Day_Records"] = $data_d;
$totalarray["Hour_Records"] = $data_e;
$totalarray["Year_Records"] = $data_f;


//var_dump($totalarray);


$json = json_encode($totalarray);
echo $json;

?>