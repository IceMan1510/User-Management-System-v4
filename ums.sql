-- PostgreSQL Databse Document

-- Creating the database

CREATE DATABASE ums;

--Crating the underlying schema

CREATE SCHEMA ums;

--Creating enum gender

CREATE TYPE ums.gender AS ENUM (
    'Male',
    'Female',
    'Other'
);

--Creating enum isDeleted for soft delete

CREATE TYPE ums.isdeleted AS ENUM (
    '0',
    '1'
);

--Creating table users;

CREATE TABLE ums.users (u_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY, f_name VARCHAR(20) NOT NULL, m_name VARCHAR(20) NOT NULL, l_name VARCHAR(20) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, contact VARCHAR(10) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, date_of_birth DATE NOT NULL, gender gender default 'Other' not null, Del isdeleted DEFAULT '0');


--Creating table states;

CREATE TABLE ums.states (
  state_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  state_name VARCHAR(50) NOT NULL
);


--Creating table cities which contains key of cities;

CREATE TABLE ums.cities (
  city_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  city_name VARCHAR(50) NOT NULL,
  state_id INT NOT NULL,
  FOREIGN KEY (state_id) REFERENCES states(state_id)
);


--Creating table addresses which contains key of users & cities;

CREATE TABLE ums.addresses (
  add_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  u_id INT NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255) NOT NULL,
  landmark VARCHAR(20) NOT NULL,
  zip_code VARCHAR(6) NOT NULL,
  city_id INT NOT NULL,
  FOREIGN KEY (u_id) REFERENCES users(u_id),
  FOREIGN KEY (city_id) REFERENCES cities(city_id)
);


--Creating view to get all user data 

CREATE VIEW AllUserData AS 
    SELECT users.u_id, f_name, m_name, l_name, email, contact, password, date_of_birth, gender,del,add_id,
           address_line1, address_line2, landmark, zip_code, cities.city_id, city_name, states.state_id, state_name
    FROM users
    JOIN addresses ON users.u_id = addresses.u_id
    JOIN cities ON addresses.city_id = cities.city_id
    JOIN states ON cities.state_id = states.state_id
    WHERE del = '0'
    ORDER BY users.u_id;

----------------------------------------------------------------------------------------------------------------------------------------------------------------------
--Seed data

--Inserting into users table

INSERT INTO users (f_name, m_name, l_name, email, contact, password, date_of_birth, gender)
VALUES 
('Jane', 'Doe', 'Jones', 'janedoe@gmail.com', '2345678901', 'password2', '1995-02-15', 'Female'),
('Bob', 'Parker', 'Johnson', 'bobparker@gmail.com', '3456789012', 'password3', '1985-07-10', 'Male'),
('Sarah', 'Lee', 'Kim', 'sarahlee@gmail.com', '4567890123', 'password4', '1992-12-25', 'Female'),
('Tom', 'Wilson', 'Anderson', 'tomwilson@gmail.com', '5678901234', 'password5', '1988-04-30', 'Male'),
('Emily', 'Brown', 'Taylor', 'emilybrown@gmail.com', '6789012345', 'password6', '1998-09-05', 'Female'),
('Mike', 'Davis', 'Wright', 'mikedavis@gmail.com', '7890123456', 'password7', '1983-03-20', 'Male'),
('Alex', 'Roberts', 'Martin', 'alexroberts@gmail.com', '8901234567', 'password8', '1996-06-15', 'Male'),
('Linda', 'Garcia', 'Gonzalez', 'lindagarcia@gmail.com', '9012345678', 'password9', '1980-11-10', 'Female'),
('Mark', 'Hernandez', 'Rodriguez', 'markhernandez@gmail.com', '0123456789', 'password10', '1993-08-01', 'Male');

--Inserting the data into states;

insert into ums.states(state_name) values('Andhra Pradesh'),('Andaman and Nicobar Islands'),('Arunachal Pradesh'),('Assam'), ('Bihar'),('Chhattisgarh'),('Dadar and Nagar Haveli'),('Daman and Diu'),('Delhi'),('Lakshadweep'),('Puducherry'),('Goa'),('Gujarat'),('Haryana'),('Himachal Pradesh'),('Jammu and Kashmir'),('Jharkhand'),('Karnataka'),('Kerala'),('Madhya Pradesh'),('Maharashtra'),('Manipur'),('Meghalaya'),('Mizoram'),('Nagaland'),('Odisha'),('Punjab'),('Rajasthan'),('Sikkim'),('Tamil Nadu'),('Telangana'),('Tripura'),('Uttar Pradesh'),('Uttarakhand'),('West Bengal');


--Inserting into cities table

INSERT INTO cities (city_name, state_id)
VALUES 
('Pune', 21),
('New Delhi', 9),
('Dehradun', 34),
('Lucknow', 33),
('Kanpur', 33),
('Raibareli',33),
('Rohtak', 14),
('Amritsar', 27),
('Jaisalmer', 28),
('Indore', 20);

--Inserting into addresses table

INSERT INTO addresses (u_id, address_line1, address_line2, landmark,zip_code, city_id)
VALUES 
(1, '123 Main St', 'Apt 41B', 'Central Park','411015', 1),
(2, '123 Central St', 'Apt 42B', 'Central Park','123456', 2),
(3, '123 North St', 'Apt 43B', 'Central Park','435673',3),
(4, '123 Easy St', 'Apt 44B', 'Central Park','234567', 4),
(5, '123 Busy St', 'Apt 45B', 'Central Park', '876543',5),
(6, '123 South St', 'Apt 46B', 'Central Park','654325', 6),
(7, '123 Hard St', 'Apt 47B', 'Central Park', '654678',7),
(8, '123 Mellow St', 'Apt 48B', 'Central Park','876456', 8),
(9, '123 Holy St', 'Apt 49B', 'Central Park', '876987',9),
(10,'432 Satan St', 'Apt 50B', 'Central Park','345432', 10);
