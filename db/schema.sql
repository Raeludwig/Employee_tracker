DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;

CREATE TABLE department (
  id: INT PRIMARY KEY AUTO_INCREMENT,
  department_name: VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE roles (
    id: INT PRIMARY KEY AUTO_INCREMENT,
    title: VARCHAR(30) UNIQUE NOT NULL,
    salary: DECIMAL NOT NULL,
    department_id:INT NOT NULL
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id: INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    first_name: VARCHAR(30) NOT NULL,
    last_name: VARCHAR(30) NOT NULL,
    role_id: INT NOT NULL,
    FOREIGN KEY (roles_id) REFERENCES roles(id),
    manager_id:INT
    FOREIGN KEY (manager_id) REFERENCES employees(id)    
);
