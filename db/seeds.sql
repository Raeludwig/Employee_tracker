USE company_db;

INSERT INTO department(department_name)
VALUES('Legal'),
    ('Accounting'),
    ('Design');

INSERT INTO roles(title,salary, department_id)
VALUES('Evil Overlord', 1000000, 1),
('Peon', 10000, 2),
('Grunt', -300, 3);

INSERT INTO employee(first_name,last_name,role_id,manager_id)
VALUES('Rachel', 'Schumann', 1, NULL),
       ('Hey', 'You', 2, 1),
       ('Dean', 'Winchester', 3, 2);