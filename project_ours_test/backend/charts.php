<?php
session_start();
$json = file_get_contents('php://input');
$map = json_decode($json,true);


$conn = new mysqli('localhost','root','','database_test');

if (mysqli_connect_error()) 
{
    die(json_encode(array("status"=>"failure","mg"=> mysqli_connect_error())));
}

$id=$_SESSION["id"];

/*
mysqli_query($conn,'SET CHARACTER SET utf8;');
mysqli_query($conn,'SET COLLATION_CONNECTION=utf8_general_ci;');
*/

$sql_arr = "SELECT DISTINCT `activity_type` FROM `locationData`; ";
$result = mysqli_query($conn,$sql_arr) or die(json_encode(array("status"=>"failure","msg"=>mysqli_error($conn))));

//val can be dayt , hourT from json
$val=$map['type'];



if($val =='pie'){

//querying the number of records for each activity type (for the current user that is loged in) 
$sql_p = "SELECT username,userId,activity_type,COUNT(*) as Activity_Records FROM locationData INNER JOIN users ON users.id=locationData.userId where userId='$id' GROUP BY activity_type ORDER BY Activity_Records DESC";

$data_p = array();
$result = $conn->query($sql_p);
if($result->num_rows > 0){
while ($row = $result->fetch_assoc()) {
	try{
    $data_p[$row["activity_type"]]=intval($row["Activity_Records"]);
	}catch(Exception $e){
    		die(json_encode(array("status"=>"fail","msg"=>$e->getMessage())));
	}
}

die(json_encode($data_p));

}
}

//final_arr contains
$final_arr=array();
	while ($row = mysqli_fetch_assoc($result) ) {
			$cvalue= $row["activity_type"];
			//echo "<br>";
            
            //querying the number of records (for each activity in each iteration) for each dayT or hourT (for the user currently logged in)
			$sql = "select count(*) as cnt ,$val
				from (
				SELECT * from locationData 
				INNER JOIN timestampMs ON timestampMs.locationData = locationData.locationID
				WHERE activity_type = '$cvalue' and userId ='$id' 
				) as T
				GROUP BY $val
				ORDER BY $val ASC";
			$rec = mysqli_query($conn,$sql) or die(json_encode(array("status"=>"failure","msg"=>mysqli_error($conn))));
			
			$res=array();
			
			while ($r = mysqli_fetch_assoc($rec)){
				

				$res[$r[$val]] = intval($r['cnt']);
					
			}
					
			$final_arr[$cvalue] = $res;
					
	}

echo json_encode($final_arr);

?>
