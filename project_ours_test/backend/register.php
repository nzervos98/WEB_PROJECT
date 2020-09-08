<?php

	session_start();


	$con = mysqli_connect('localhost', 'root', '');

	mysqli_select_db($con, 'database_test');

	$usrname = $_POST['user'];
	$pw = $_POST['password'];
	$email = $_POST['email'];

	// 2-Way encryption ID
	$cipher = "aes-256-cbc";
	$ivlen = openssl_cipher_iv_length($cipher);
	$iv = openssl_random_pseudo_bytes($ivlen);
	$userid = openssl_encrypt($email,$cipher,$password , 0, $iv);
	
	//MD5 password hash
	$pw = md5($pw);


	$s = "SELECT * FROM users WHERE username = '$usrname'";

	$result = mysqli_query($con, $s);

	$num = mysqli_num_rows($result);

	if($num == 1){
		echo "Username Already Taken.";
	}else{
		$reg = "INSERT INTO `users`(id,username,password,email,isAdmin,lastUpload) VALUES('$userid','$usrname', '$pw', '$email', 0 , NULL)";
		mysqli_query($con, $reg);
		echo '<script>alert("Registration Successful.")</script>';

		$_SESSION['id'] = $userid;
		
		header('location:../web_app/user/dash.html');
	}

?>