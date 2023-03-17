INSERT INTO department(name)
VALUES ("Sales"),
        ("Engineering"),
        ("Finance"),
        ("Legal");

INSERT INTO role(title,salary,department_id)
VALUES ("Sales Lead",110000,1),
        ("Salesperson",85000,1),
        ("Lead Engineer",160000,2),
        ("Software Engineer",125000,2),
        ("Account Manager",160000,3),
        ("Accountant",130000,3),
        ("Legal Team Lead",225000,4),
        ("Lawyer",190000,4);

INSERT INTO employee(first_name,last_name,role_id,manager_id)
VALUES ("Abdelrahman","Ahmed",5,NULL),
        ("Oliver","Mezo",6,1),
        ("John","Doe",1,NULL),
        ("Mike","Chan",2,1),
        ("Ashley","Rodriguez",3,NULL),
        ("Kevin","Tupik",4,3),
        ("Kunal","Singh",6,1),
        ("Malia","Brown",6,1),
        ("Sarah","Lourd",7,NULL),
        ("Tom","Allen",8,9);
