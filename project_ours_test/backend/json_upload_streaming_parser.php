<?php


//session_start();

    /*
	$target_dir = "uploads/";
	$target_file = $target_dir . basename($_FILES["importfile"]["name"]);
	
	//Unique ID of current user
	$userid = $_SESSION['id'];
	
	
	if (move_uploaded_file($_FILES["importfile"]["tmp_name"], $target_file)){
		echo "The file ". basename( $_FILES["importfile"]["name"]). " has been uploaded.<br>";
	}
	*/

	



$file_as_a_json_string = file_get_contents('php://input');
$current_path = getcwd();
//mkdir($current_path."/uploads");
chdir("uploads");
$stream = fopen('test.JSON', 'w');
fwrite($stream,$file_as_a_json_string);
fclose($stream);
chdir($current_path);



//parsing stage
//in order to use the salsify streaming parser you have to install composer for windows
//and then you have to install salsify streaming parser with the command : composer require salsify/json-streaming-parser in a directory that you have to name 
//jsonstreamingparser.That directory should be created in the dir that you store all your .php files
require_once __DIR__.'/jsonstreamingparser/vendor/autoload.php';


$listener = new \JsonStreamingParser\Listener\myListener();
$stream = fopen($current_path."/uploads/test.JSON", 'r');

try {
    $parser = new \JsonStreamingParser\Parser($stream, $listener);
    $parser->parse();
	fclose($stream);
	//rmdir ( $current_path."/uploads" );
	chdir("uploads");
	unlink("test.JSON");
	chdir($current_path);
	$succes_msg = json_encode(array("msg"=>"Succesful Upload","status"=>"success"));
	echo $succes_msg;
} catch (Exception $e) {
	fclose($stream);
	$fail_msg = json_encode(array("msg"=>"problem inserting","status"=>"fail"));
	echo $fail_msg;
    //throw $e;
}

//the implemented listener in this case myListener should be stored in the Listener dir of the jason streaming parser

?>
