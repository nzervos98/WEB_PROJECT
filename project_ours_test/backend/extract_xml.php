<?php

$json = file_get_contents('php://input');
$map = json_decode($json,true);


$conn = new mysqli('localhost','root','','database_test');



if (mysqli_connect_error()) 
{
    die(json_encode(array("status"=>"failure","msg"=> mysqli_connect_error())));
}

mysqli_query($conn,'SET CHARACTER SET utf8;');
mysqli_query($conn,'SET COLLATION_CONNECTION=utf8_general_ci;');

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

//get records from database

$locationDataArray=array();

if ($result = $conn->query($sql)) {
   
   /* fetch associative array */
    while ($row = $result->fetch_assoc()) {
       array_push($locationDataArray, $row);
    }
  
    if(count($locationDataArray)){
		//call function to create xml
         createXMLfile($locationDataArray);
     }
    /* free result set */
    $result->free();
}




function createXMLfile($locationDataArray){
  
   $filename = 'XML_output_'. date('Y-m-d').'.xml';
   //echo getenv("HOMEDRIVE").getenv("HOMEPATH")."\Desktop";
    header('Content-Type: text/xml');
    header('Content-Disposition: attachment; filename="' . $filename . '";');
   $dom     = new DOMDocument('1.0', 'utf-8'); 
   $root      = $dom->createElement('locationData'); 
   for($i=0; $i<count($locationDataArray); $i++){
     
	$userId      			=  $locationDataArray[$i]['userId']; 
	$locationID				=  $locationDataArray[$i]['locationID']; 
	//$heading       			=  $locationDataArray[$i]['heading']; 
	$activity_type 			=  htmlspecialchars($locationDataArray[$i]['activity_type']);
	$activity_confidence	=  $locationDataArray[$i]['activity_confidence']; 
	$activity_timestampMs  	=  $locationDataArray[$i]['activity_timestampMs']; 
	//$verticalAccuracy     	=  $locationDataArray[$i]['verticalAccuracy']; 
	//$velocity  				=  $locationDataArray[$i]['velocity'];  
	$accuracy    		  	=  $locationDataArray[$i]['accuracy']; 
	$longitudeE7  			=  $locationDataArray[$i]['longitudeE7'];  
	$latitudeE7  			=  $locationDataArray[$i]['latitudeE7'];  
	//$altitude  				=  $locationDataArray[$i]['altitude'];   
	$timestampMs 		 	=  $locationDataArray[$i]['timestampMs'];   
	 
	 
	$output = $dom->createElement('locationData_child');
	
		 
	$id     = $dom->createElement('userId', $userId); 
	$output->appendChild($id);
	
	$locID     = $dom->createElement('locationID', $locationID); 
	$output->appendChild($locID); 
	
	//$head   = $dom->createElement('heading', $heading); 
	//$output->appendChild($head); 
	
	$act_type    = $dom->createElement('activity_type', $activity_type); 
	$output->appendChild($act_type); 
	
	$act_conf     = $dom->createElement('activity_confidence', $activity_confidence); 
	$output->appendChild($act_conf); 
     
	$act_timestamp = $dom->createElement('activity_timestampMs', $activity_timestampMs); 
	$output->appendChild($act_timestamp);
	
	/*
	$ver_acc = $dom->createElement('verticalAccuracy', $verticalAccuracy); 
	$output->appendChild($ver_acc);
	
	$vel = $dom->createElement('velocity', $velocity); 
	$output->appendChild($vel);
	*/

	$acc = $dom->createElement('accuracy', $accuracy); 
	$output->appendChild($acc);
	
	$lon = $dom->createElement('longitudeE7', $longitudeE7); 
	$output->appendChild($lon);
	
	$lat = $dom->createElement('latitudeE7', $latitudeE7); 
	$output->appendChild($lat);
	
	//$alt = $dom->createElement('altitude', $altitude); 
	//$output->appendChild($alt);
	
	$timeMs = $dom->createElement('timestampMs', $timestampMs); 
	$output->appendChild($timeMs);
	
	$root->appendChild($output);
   }
   $dom->appendChild($root); 
   $dom->save($filePath); 
 } 

?>

