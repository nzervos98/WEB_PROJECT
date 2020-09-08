<?php

session_start();

$con = mysqli_connect('localhost', 'root', '');
mysqli_select_db($con, 'database_test');


$usrname = $_POST['user'];
$pw = $_POST['password'];

if( $usrname != "admin" )
{
	$pw = md5($pw);
}

$s = "SELECT * FROM users WHERE username = '$usrname' && password = '$pw'";

$result = mysqli_query($con, $s);

$num = mysqli_num_rows($result);
$row = mysqli_fetch_array($result);

/*
if( strcmp($usrname , $row['username'])==0 && strcmp($pw , $row['password'])==0 ){
var_dump($row);
var_dump($pw);
}
*/

/*
if($num == 1 && $row['isadmin'] == 1){
	$_SESSION['username'] = $row['username'];
	$_SESSION['id'] = $row['id'];
	header('location:home.php');
}else if($num == 1 && $row['isadmin'] == 0){
	echo "Peasant";
}else{
	header('location:start.php');
}
*/

if( strcmp($usrname , $row['username'])==0 && strcmp($pw , $row['password'])==0 )
	{
		$_SESSION['username'] = $row['username'];
		$_SESSION['id'] = $row['id'];

		if(!$row['isAdmin']){
			header('location:../web_app/user/dash.html');
		}
		else{
			header('location:../web_app/admin/charts_admin.html');
		}
	}  
else
	{	
		header('location:../login/index.html');
	}	


?>