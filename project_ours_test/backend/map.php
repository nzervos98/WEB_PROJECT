<?php
session_start();

$json = file_get_contents('php://input');
$map = json_decode($json,true);


$conn = new mysqli('localhost','root','','database_test');

if (mysqli_connect_error()) 
{
    die(json_encode(array("status"=>"failure","mg"=> mysqli_connect_error())));
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
//$activitys = $map['activities'];
$actList = $map['actList'];


//$extra_sql = "and (a.activity_type = '" . implode("' OR a.activity_type = '",$actList) . "')";
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

$sql= "select a.latitudeE7 ,a.longitudeE7, a.yearT, a.monthT, a.dayT, a.hourT from (select * from locationData inner join timestampMs on locationData.locationID = timestampMs.locationData) as a WHERE ( a.yearT BETWEEN $yearStart AND $yearEnd) AND (a.monthT BETWEEN $monthStart AND $monthEnd) AND (a.dayT BETWEEN $dayStart AND $dayEnd) AND (a.hourT BETWEEN $hourStart AND $hourEnd) "; 

/*
if(!empty($actList)){
	$sql .= $extra_sql;
}


if(!$_SESSION["isAdmin"]){
	$sql .= "AND ( a.userId ='" . $_SESSION["id"] . "')";
}
*/


$res= mysqli_query($conn,$sql) or die(json_encode(array("status"=>"failure","msg"=>mysqli_error($conn))));
$coords = array();
while ($row = mysqli_fetch_assoc($res)) {
	array_push($coords,array("latitudeE7"=>$row['latitudeE7'],"longitudeE7"=>$row['longitudeE7']));	
}

echo json_encode(array("locations"=>$coords));

//die(json_encode(array("status"=>"failure","yearStart"=>$yearStart,"yearEnd"=>$yearEnd,"monthEnd"=>$monthEnd,"dayStart"=>$dayStart,"dayEnd"=>$dayEnd,"hourEnd"=>$hourEnd,"hourStart"=>$hourStart)));
?>