<?php

declare(strict_types=1);

namespace JsonStreamingParser\Listener;

class myListener extends IdleListener
{



    protected $result;

    /**
     * @var array
     */
    protected $stack;

    /**
     * @var string[]
     */
 

    //a flag we are gonna need
    protected $flag;

    //first level values
    protected $values1;

    //first level keys
    protected $keys1;

    //second level values
    protected $values2;
   
    //third level values
    protected $values3;


      // Level is required so we know how nested we are.
    protected $level;
    
    //connection variable
    public $con;


    public function startDocument(): void
    {
        //Connect to DB
        $this->con = mysqli_connect('localhost', 'root', '','database_test');
        if ($this->con->connect_error) 
    {
        die(json_encode(array("status"=>"fail","msg"=>"database connection error")));
    }
        session_start();
        $userid = $_SESSION['id'];
        //updating the lastupload field of our current user
        $sql ="update users set lastUpload = curdate() where id = '$userid'";
        $this->con->query($sql);

        $this->level = 0;
    }


    public function startArray(): void
    {
        $this->level++;
    }


    public function endArray(): void
    {
        $this->level--;
    }


//this function is triggered whenever a value is parsed
    public function value($value): void
    {
         //we are storing the values of the first level :the coordinates,the timestamp , accuracy and all the other if they exist e.i. velocity etc
         if($this->level==1){
        $this->values1[] = $value;
        }
        //we are storing the values of the second level : its one value... the timestamp of the activity :) 
        if($this->level==2){
        $this->values2[] = $value;
        }
        //we are storing the values of the third level : type and confidence of the activity
        if($this->level==3){
        $this->values3[] = $value;
        }
    }

//this function is triggered whenever a key is parsed   
    public function key(string $key): void
    {
        if($this->level==1){
            $this->keys1[] = $key;
        }
    }

    //when we see an opening bracket of an object we set a flag.
    public function startObject(): void
    {
        if($this->level==1){
            $this->flag = 1;
        }    
    }



//this function is triggered whenever the parser see's a '}' 
//Whenever we see a '}' depending on the level that we are in we execute the corresponding insert statement and then we empty the array value for that particular level 
    public function endObject(): void
    {
        //if we are at the level1(meaning the locations level) we insert the neccesary values that every location needs
        if( ($this->level==1) && ($this->flag==1) ){
        $lvl1_arr = array_combine( $this->keys1 , $this->values1 );
        $userid = $_SESSION['id'];
        $date_time = intval($lvl1_arr["timestampMs"]);
        $latE7 = $lvl1_arr["latitudeE7"];
        $longE7 = $lvl1_arr["longitudeE7"];
        $accuracy = $lvl1_arr["accuracy"];

        //check if these atributes exist
        if(array_key_exists ( "altitude" , $lvl1_arr))
		{
			$altitude = $lvl1_arr["altitude"];
        }else{
            $altitude = 'NULL'; 
        }
        if(array_key_exists ( "verticalAccuracy" , $lvl1_arr))
		{
			$verticalAccuracy = $lvl1_arr["verticalAccuracy"];
        }else{
            $verticalAccuracy = 'NULL'; 
        }
        if(array_key_exists ( "heading" , $lvl1_arr))
		{
			$heading = $lvl1_arr["heading"];
        }else{
            $heading = 'NULL'; 
        }
        if(array_key_exists ( "velocity" , $lvl1_arr))
		{
			$velocity = $lvl1_arr["velocity"];
        }else{
            $velocity = 'NULL'; 
        }
        

        $sql = "INSERT INTO `locationData`(userId, locationID, heading , activity_type, activity_confidence , activity_timestampMs, verticalAccuracy , velocity , accuracy , longitudeE7 , latitudeE7 , altitude , timestampMs) VALUES('$userid', uuid() , '$heading' , NULL , NULL , NULL , '$verticalAccuracy' , '$velocity' , '$accuracy', '$longE7', '$latE7' , '$altitude' , '$date_time' )";
        //mysqli_query($this->con, $sql);
        
        if(!$result = ($this->con)->query($sql)){ 
            die(json_encode(array("quer"=>$sql,"sql"=>$this->con->error,"msg"=>"problem inserting","status"=>"fail")));
        }
        

        $this->keys1=[];
        $this->values1=[];
        $this->values2=[];
        $this->values3=[];
        $this->flag = 0;
        }


        //if we are at the level3(meaning the level) we insert the neccesary values that defines an activity of a particular location
        if( ($this->level==3) && ($this->flag==1) ){
        $tmp = array_slice($this->keys1, 0 , count($this->keys1) - 1  );
        $lvl1_arr = array_combine( $tmp , $this->values1 );
        $userid = $_SESSION['id'];
        $date_time = intval($lvl1_arr["timestampMs"]);
        $latE7 = $lvl1_arr["latitudeE7"];
        $longE7 = $lvl1_arr["longitudeE7"];
        $accuracy = $lvl1_arr["accuracy"];

        //check if these atributes exist
        if(array_key_exists ( "altitude" , $lvl1_arr))
		{
			$altitude = $lvl1_arr["altitude"];
        }else{
            $altitude = 'NULL'; 
        }
        if(array_key_exists ( "verticalAccuracy" , $lvl1_arr))
		{
			$verticalAccuracy = $lvl1_arr["verticalAccuracy"];
        }else{
            $verticalAccuracy = 'NULL'; 
        }
        if(array_key_exists ( "heading" , $lvl1_arr))
		{
			$heading = $lvl1_arr["heading"];
        }else{
            $heading = 'NULL'; 
        }
        if(array_key_exists ( "velocity" , $lvl1_arr))
		{
			$velocity = $lvl1_arr["velocity"];
        }else{
            $velocity = 'NULL'; 
        }

        $act_imstm = intval(intval($this->values2[0])/1000);
        $activity_date = date('Y-m-d H:i:s', $act_imstm);
        $type = $this->values3[0];
        $confidence = $this->values3[1];
        $sql1 = "INSERT INTO `locationData`(userId, locationID, heading , activity_type, activity_confidence , activity_timestampMs, verticalAccuracy , velocity , accuracy , longitudeE7 , latitudeE7 , altitude , timestampMs) VALUES('$userid', uuid() , '$heading' , '$type' , '$confidence' , '$activity_date' , '$verticalAccuracy' , '$velocity' ,'$accuracy', '$longE7', '$latE7' , '$altitude' , '$date_time' )";

        
        if(!$result = $this->con->query($sql1)){ 
            die(json_encode(array("quer"=>$sql1,"sql"=>$this->con->error,"msg"=>"problem inserting","status"=>"fail")));
        }

        $this->keys1=[];
        $this->values1=[];
        $this->values2=[];
        $this->values3=[];
        $this->flag = 0;
        }

    }
 //closing the connection when we are done with parsing
    public function endDocument(): void
    {
        mysqli_close($this->con);
        
    }
    
}