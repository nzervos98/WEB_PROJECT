create database database_test;
use database_test;
CREATE TABLE users (
id varchar(128) NOT NULL PRIMARY KEY,
username char(100) NOT NULL UNIQUE, 
`password` char(50) NOT NULL,
email char(50) NOT NULL,
isAdmin BOOLEAN DEFAULT FALSE,
lastUpload date default null
)engine=InnoDB;

INSERT INTO users (id,username,`password`,email,isAdmin)
VALUES ("admin","admin","admin","admin@nnanos.com",1);


CREATE TABLE locationData (
userId varchar(128) NOT NULL,
locationID varchar(36) PRIMARY KEY,
heading varchar(24),
activity_type varchar(30),
activity_confidence int,
activity_timestampMs varchar(128),
verticalAccuracy varchar(24),
velocity varchar(24),
accuracy int,
longitudeE7 bigint unsigned,
latitudeE7 bigint unsigned, 
altitude varchar(24),
timestampMs bigint unsigned,
CONSTRAINT conLoc FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
)engine=InnoDB;

CREATE TABLE timestampMs (
locationData varchar(36) NOT NULL PRIMARY KEY,
timestampCONV TIMESTAMP NULL,
yearT INT NULL,
monthT INT NULL,
dayT int NULL,
hourT int NULL,
CONSTRAINT con1 FOREIGN KEY (locationData) REFERENCES locationData(locationID) ON DELETE CASCADE
)engine=InnoDB;


DELIMITER |

CREATE TRIGGER timeTrig 
AFTER INSERT ON locationData FOR EACH ROW
BEGIN
	
    INSERT INTO timestampMs(locationData,timestampCONV,yearT,monthT,dayT,hourT)
	VALUES(NEW.locationID,
    FROM_UNIXTIME(SUBSTRING(NEW.timestampMs,1,10)), 
    YEAR(FROM_UNIXTIME(SUBSTRING(NEW.timestampMs,1,10))) ,
    MONTH(FROM_UNIXTIME(SUBSTRING(NEW.timestampMs,1,10))), 
    DAYOFWEEK(FROM_UNIXTIME(SUBSTRING(NEW.timestampMs,1,10))),
    HOUR(FROM_UNIXTIME(SUBSTRING(NEW.timestampMs,1,10)))
    );
	
END; |
DELIMITER ;

DELIMITER //

CREATE PROCEDURE deleteData()
BEGIN
	DELETE FROM users WHERE isAdmin = false;
END //
DELIMITER ;

