INSERT INTO department (department_name) 
VALUES
    ("Engineer"),
    ("Advertising"),
    ("Information Technology"),
    ("Legal"),
    ("Finance"),
    ("Marketing"),
    ("Human Relations");

INSERT INTO role (title, salary, department_id)
VALUES 
    ("Lead Software Engineer", 165000, 1),
    ("Senior Software Engineer", 130000, 1),
    ("Marketing Manager", 92500, 2),
    ("Database Analyst", 95550, 3),
    ("Network Administrator", 110000, 3),
    ("Lawyer", 200000, 4),
    ("Financial Manager", 130000, 5),
    ("Social Media Manager", 55000, 6),
    ("People and Culture Manager", 115000, 7);


INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES 
    ("Hadley", "Mark", 3, null),
    ("Harrison", "Beckham", 8, 1),
    ("Simone", "Pender", 2, null),
    ("Margie", "Walker", 7, null),
    ("Terell", "Sharp", 2, 3);