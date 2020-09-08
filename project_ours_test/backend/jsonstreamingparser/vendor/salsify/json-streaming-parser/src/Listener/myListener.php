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
        /*   
        mysqli_query($this->con,'SET CHARACTER SET utf8;');
        mysqli_query($this->con,'SET COLLATION_CONNECTION=utf8_general_ci;');
        */

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

    /*
    public function key(string $key): void
    { 
        if($this->level==1){
        $this->keys1[] = $key;
        }

        if($this->level==2){
        $this->keys2[] = $key;
        }
 
        if($this->level==3){
        $this->keys3[] = $key;
        }
    }
     */
    public function getkeys():void
    { 
        echo nl2br("\n");
        var_dump($this->keys1);
        echo nl2br("\n");
      
        echo nl2br("\n");
        var_dump($this->keys2);
        echo nl2br("\n");

        echo nl2br("\n");
        var_dump($this->keys3);
        echo nl2br("\n");
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
        //$userid = $GLOBALS['userid'];
        $userid = $_SESSION['id'];
        //$timstm = intval(intval($this->values1[0])/1000);
        //$date_time = date('Y-m-d H:i:s', $timstm);
        $date_time = intval($this->values1[0]);
        $latE7 = $this->values1[1];
        $longE7 = $this->values1[2];
        $accuracy = $this->values1[3];
        
        $sql = "INSERT INTO `locationData`(userId, locationID, activity_type, activity_confidence , activity_timestampMs, accuracy , longitudeE7 , latitudeE7 , timestampMs) VALUES('$userid', uuid() , NULL , NULL , NULL ,'$accuracy', '$longE7', '$latE7' , '$date_time' )";
        //mysqli_query($this->con, $sql);
        
        if(!$result = ($this->con)->query($sql)){ 
            die(json_encode(array("quer"=>$sql,"sql"=>$this->con->error,"msg"=>"problem inserting","status"=>"fail")));
        }
        
        
       
        //var_dump($date_time,$latE7,$longE7,$accuracy);
        //echo "$userid", uniqid() , NULL , NULL ,"$accuracy", "$longE7", "$latE7" , "$accuracy" , "$date_time";
        //echo nl2br("\n");
        $this->values1=[];
        $this->values2=[];
        $this->values3=[];
        $this->flag = 0;
        }

        /*
        //in this level we just empty the corresponding values array in order to take another activity's date
        if($this->level==2){
        $this->values2=[];
        */

         //if we are at the level3(meaning the  level) we insert the neccesary values that defines an activity of a particular location
        if( ($this->level==3) && ($this->flag==1) ){
        //$userid = $GLOBALS['userid'];
        $userid = $_SESSION['id'];
        //$timstm = intval(intval($this->values1[0])/1000);
        //$date_time = date('Y-m-d H:i:s', $timstm);
        $date_time = intval($this->values1[0]);
        $latE7 = $this->values1[1];
        $longE7 = $this->values1[2];
        $accuracy = $this->values1[3];
        $act_imstm = intval(intval($this->values2[0])/1000);
        $activity_date = date('Y-m-d H:i:s', $act_imstm);
        $type = $this->values3[0];
        $confidence = $this->values3[1];
        $sql1 = "INSERT INTO `locationData`(userId, locationID, activity_type, activity_confidence , activity_timestampMs, accuracy , longitudeE7 , latitudeE7 , timestampMs) VALUES('$userid', uuid() , '$type' , '$confidence' , '$activity_date' ,'$accuracy', '$longE7', '$latE7' , '$date_time' )";
        //mysqli_query($this->con, $sql1);
        
        if(!$result = $this->con->query($sql1)){ 
            die(json_encode(array("quer"=>$sql1,"sql"=>$this->con->error,"msg"=>"problem inserting","status"=>"fail")));
        }
        
     
        //var_dump($date_time,$latE7,$longE7,$accuracy,$activity_date,$type,$confidence);
        $this->values1=[];
        $this->values2=[];
        $this->values3=[];
        $this->flag = 0;
        }
   
       // echo nl2br("\n\n\n\n");
    }
 //closing the connection when we are done with parsing
    public function endDocument(): void
    {
        //updating the lastupload field of our current user
        //$sql ="update users set lastUpload = curdate() where id = '$userid'";
        //$this->con->query($sql);
        /*
        if(!$result = $this->con->query($sql)){ 
            die(json_encode(array("quer"=>$sql,"sql"=>$this->con->error,"msg"=>"problem inserting","status"=>"fail")));
        } 
        */

        mysqli_close($this->con);
        
    }
          
   


    public function getvalues():void
    { 
        echo nl2br("\n");
        var_dump($this->values1);
        echo nl2br("\n");
      
        echo nl2br("\n");
        var_dump($this->values2);
        echo nl2br("\n");

        echo nl2br("\n");
        var_dump($this->values3);
        echo nl2br("\n");
    }
    
}