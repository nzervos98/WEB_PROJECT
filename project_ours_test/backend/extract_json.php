<?php

$json = file_get_contents('php://input');
$map = json_decode($json,true);


$conn = new mysqli('localhost','root','','database_test');

if (mysqli_connect_error()) 
{
    die(json_encode(array("status"=>"failure","msg"=> mysqli_connect_error())));
}

/*
mysqli_query($conn,'SET CHARACTER SET utf8;');
mysqli_query($conn,'SET COLLATION_CONNECTION=utf8_general_ci;');
*/

$yearAll = $map['yearAll'];
$monthAll = $map['monthAll'];
$dayAll = $map['dayAll'];
$hourAll = $map['hourAll'];
$yearStart = $map['yearStart'];
$yearEnd = $map['yearEnd'];
$monthStart = $map['monthStart'];
$monthEnd = $map['monthEnd'];
$dayStart = $map['dayStart'];
$dayEnd = $map['dayEnd'];
$hourStart = $map['hourStart'];
$hourEnd = $map['hourEnd'];
//$activities = $map['activities'];
$actList = $map['actList'];


$extra_sql = "and (a.activity_type = '" . implode("' OR a.activity_type = '",$actList) . "')";
	//die(json_encode(array("sql"=>$extra_sql)));	

//yearAll

if ($yearAll == true){
	
	$sql = "SELECT min(yearT) as minyear, max(yearT) as maxyear FROM timestampMs";
	$result = mysqli_query($conn, $sql) or die(json_encode(array("status"=>"failure","msg"=>mysqli_error($conn))));
	$row = $result->fetch_assoc();
	$yearStart=intval($row['minyear']);
	$yearEnd =intval($row['maxyear']);
}



//monthAll
if ($monthAll == true){
	
	$sql = "SELECT min(monthT) as minmonth, max(monthT) as maxmonth FROM timestampMs";
	$result = mysqli_query($conn, $sql) or die(json_encode(array("status"=>"failure","msg"=>mysqli_error($conn))));
	$row = $result->fetch_assoc();
	$monthStart= intval($row['minmonth']);
	$monthEnd = intval($row['maxmonth']);
}

//dayAll
if ($dayAll == true){
	
	$sql = "SELECT min(dayT) as minday, max(dayT) as maxday FROM timestampMs";
	$result = mysqli_query($conn, $sql) or die(json_encode(array("status"=>"failure","msg"=>mysqli_error($conn))));
	$row = $result->fetch_assoc();
	$dayStart=intval($row['minday']);
	$dayEnd =intval($row['maxday']);
	
}

//$hourAll = true;


if ($hourAll == true){
	
	
	$sql = "SELECT min(hourT) as minhour, max(hourT) as maxhour FROM timestampMs";
	$result = mysqli_query($conn, $sql) or die(json_encode(array("status"=>"failure","msg"=>mysqli_error($conn))));
	$row = $result->fetch_assoc();
	$hourStart=intval($row['minhour']);
	$hourEnd =intval($row['maxhour']);
}

$sql= "select a.userId, a.locationID , a.activity_type, a.activity_confidence , a.activity_timestampMs ,a.accuracy ,a.longitudeE7 ,a.latitudeE7 ,a.timestampMs 
		from (select * from locationData inner join timestampMs on locationData.locationID = timestampMs.locationData) as a WHERE ( a.yearT BETWEEN $yearStart AND $yearEnd) AND (a.monthT BETWEEN $monthStart AND $monthEnd) AND (a.dayT BETWEEN $dayStart AND $dayEnd) AND (a.hourT BETWEEN $hourStart AND $hourEnd) "; 

if(!empty($actList)){
	$sql .= $extra_sql;
}
$sql = "select * from locationData";
//get records from database
$query = $conn->query($sql);
try{
while($row=mysqli_fetch_assoc($query)) { 
	$userId=$row['userId']; 
	$locationID=$row['locationID']; 
	//$heading=$row['heading']; 
	$activity_type=$row['activity_type']; 
	$activity_confidence=$row['activity_confidence']; 
	$activity_timestampMs=$row['activity_timestampMs']; 
	//$verticalAccuracy=$row['verticalAccuracy']; 
	//$velocity=$row['velocity']; 
	$accuracy=$row['accuracy']; 
	$longitudeE7=$row['longitudeE7']; 
	$latitudeE7=$row['latitudeE7']; 
	//$altitude=$row['altitude']; 
	$timestampMs=$row['timestampMs']; 

 $outputData[] = array('userId'=> $userId, 'locationID'=> $locationID , 'activity_type'=> $activity_type, 'activity_confidence'=> $activity_confidence, 'activity_timestampMs'=> $activity_timestampMs , 'accuracy'=> $accuracy, 'longitudeE7'=> $longitudeE7, 'latitudeE7'=> $latitudeE7 , 'timestampMs'=> $timestampMs);
} 

$response['outputData'] = $outputData;

$filename = 'JSON_output_'. date('Y-m-d').'.json';
$fp = fopen($filename, 'w') or die("cant open file");
  
header('Content-Type: text/json');
header('Content-Disposition: attachment; filename="' . $filename . '";');

fwrite($fp, json_encode($response));
fclose($fp);
readfile($filename);
}catch(Exception $e){
echo $e->getMessage();
}

?>

