<?php
session_start();

$conn = new mysqli('localhost','root','','database_test');

if (mysqli_connect_error()) 
{
    die('Connect Error (' . mysqli_connect_errno() . ') '. mysqli_connect_error());
}

$id = $_SESSION["id"];

/*
mysqli_query($conn,'SET CHARACTER SET utf8;');
mysqli_query($conn,'SET COLLATION_CONNECTION=utf8_general_ci;');
*/

$sql = "select lastUpload from users where id = '$id'";

$res = mysqli_query($conn, $sql) or die(json_encode(array("status"=>"fail","msg"=>mysqli_error($conn))));
$last_up = mysqli_fetch_array($res)[0];

$sql = "select min(a.timestampCONV) as min, max(a.timestampCONV) as max from (select * from locationData inner join timestampMs on locationData.locationID = timestampMs.locationData where locationData.userId = '$id') as a ";

$res = mysqli_query($conn, $sql) or die(json_encode(array("status"=>"fail","msg"=>mysqli_error($conn))));
$row = mysqli_fetch_assoc($res);
$first_dt = $row["min"];
$last_dt = $row["max"];
$nums = array();
$scores = array();


$sql = "select id,username from users";
$res = mysqli_query($conn, $sql) or die(json_encode(array("status"=>"fail","msg"=>mysqli_error($conn))));

$users=array();
while($user=mysqli_fetch_assoc($res)){
	array_push($users, array($user["id"],$user["username"]));
	if($user["id"] == $id){
		$usrname = $user["username"];
	}
}

//για κάθε χρήστη βρίσκουμε τον αριθμό των δραστηριοτήτων για κάθε δραστηριότητα
foreach($users as &$usr){
	$sql = "select activity_type, count(*) as cnt from locationData where userId = '{$usr[0]}' group by activity_type";
	$res = mysqli_query($conn, $sql) or die(json_encode(array("sql"=>$sql,"status"=>"fail","msg"=>mysqli_error($conn))));
	$temp_arr = array();
	while($act=mysqli_fetch_assoc($res)){
		$temp_arr[$act["activity_type"]] = $act["cnt"];
	}
	$nums[$usr[1]] = $temp_arr;
}
//var_dump($nums);

//at each iteration the $key represents a user and the num is an array that holds the number of activities for each activity type
foreach($nums as $key => $num){
	//check if these activity types exist---------
	if(array_key_exists ( "ON_BICYCLE" , $num ))
		{
			$bicycle_act = $num["ON_BICYCLE"];
		}
	else
		{
			$bicycle_act = 0;
		}

	if(array_key_exists ( "ON_FOOT" , $num ))
		{
			$on_foot_act = $num["ON_FOOT"];
		}
	else
		{
			$on_foot_act = 0;
		}

	if(array_key_exists ( "RUNNING" , $num ))
		{
			$running_act = $num["RUNNING"];
		}
	else
		{
			$running_act = 0;
		}

	if(array_key_exists ( "WALKING" , $num ))
		{
			$walking_act = $num["WALKING"];
		}
	else
		{
			$walking_act = 0;
		}

	if(array_key_exists ( "IN_VEHICLE" , $num ))
		{
			$in_vehicle_act = $num["IN_VEHICLE"];
		}
	else
		{
			$in_vehicle_act = 0;
		}

	//------------------------------------------------
	
	//calculating the score for each user 
	$body_acts = $bicycle_act + $on_foot_act + $running_act + $walking_act;
	$scr = $body_acts / ( $body_acts + $in_vehicle_act + 1);
	$scores[$key]= $scr*100;
}
//var_dump($scores);

//extracting the top 3 users
arsort($scores,SORT_NUMERIC);
$scores = array_slice($scores,0,3);
$usrscore = $scores[$usrname];
echo json_encode(array("username"=>$usrname,"usr"=>$usrscore,"scores"=>$scores,"nums"=>$nums,"status"=>"success","last_up"=>$last_up,"first_dt"=>$first_dt,"last_dt"=>$last_dt));

?>
