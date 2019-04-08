-- create tables and relationships 
-- check final submitted doc for gareths entries 
-- https://vital.liv.ac.uk/courses/1/COMP208-201819/groups/_57250_1//_1757476_1/Team%2040%20Design%20Report.pdf



CREATE DATABASE moodportfolio;

CREATE TABLE User
(
    userID INT(4) AUTO_INCREMENT, 
    name VARCHAR(50),
    hashedPassword VARCHAR(80), 
    gender TINYINT(3), 
    signupDate DATETIME, 
    dob DATETIME, 
    townCity VARCHAR(50), 
    country VARCHAR(50), 
    email VARCHAR(100), 
    admin BOOLEAN DEFAULT FALSE, 
    nominatedContact VARCHAR(100),
    PRIMARY KEY (userID)
);
--ALTER TABLE User_Table ADD PRIMARY KEY (userID);


CREATE TABLE Photo
(
    photoID INT(4) AUTO_INCREMENT, 
    userID INT(4), 
    timestamp TIMESTAMP, 
    path VARCHAR(255), 
    emotion JSON, 
    city VARCHAR(255), 
    country CHAR(2), 
    description VARCHAR(280), 
    PRIMARY KEY (photoID)
);
--ALTER TABLE Photo_Table ADD PRIMARY KEY (photoID);


CREATE TABLE Tag
(
    tagID INT(4) AUTO_INCREMENT, 
    name VARCHAR(30), 
    count INT(4), 
    PRIMARY KEY (tagID)
);
--ALTER TABLE Tag_Table ADD PRIMARY KEY (tagID);


CREATE TABLE Photo_Tag
(
    photoID INT(4), 
    tagID INT(4),
    FOREIGN KEY (photoID) REFERENCES Photo (photoID), 
    FOREIGN KEY (tagID) REFERENCES Tag (tagID)
);


