DROP DATABASE IF EXISTS ems_db;

CREATE DATABASE ems_db;

USE ems_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    DeptName varchar(30),
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title varchar(30),
    salary DECIMAL,
    department_id INT NOT NULL DEFAULT 0,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
	id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    manager VARCHAR(30),
    role_id INT NOT NULL DEFAULT 0,
    manager_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES role(id)
);
INSERT INTO department (DeptName) VALUES ("Engineering"), ("Audio"), ("Make-up"), ("Cleaning");
INSERT INTO role (title, salary, department_id) VALUES ("Deputy", 50000, (SELECT id FROM department WHERE id = 1)), ("Supervisor", 60000, 2), ("Secretary", 45000, 3), ("Intern", 30000, 4);
INSERT INTO employee (first_name, last_name, manager, role_id, manager_id) VALUES ("Jeff", "Williams", "Martin", 1, 1), ("Benjamin", "Rojas", "Martin", 2, 2), ("Sarah", "Connors", "Martin", 3, 3), ("Enrique", "Martinez", "Martin", 4, 4);

SELECT department.id, first_name, last_name, title, DeptName, salary, manager
FROM department
LEFT JOIN role ON department.id = role.department_id
LEFT JOIN employee ON role.department_id = role_id
-- WHERE Manager IN ("Martn");







