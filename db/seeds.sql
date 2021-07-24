INSERT INTO departments (dept_name)
VALUES
  ('HR'),
  ('Design'),
  ('Finance'),
  ('Software Development');

INSERT INTO roles (title, salary, department_id)
VALUES
  ('Engineer', 89000, 4),
  ('Accountant', 67000, 3),
  ('HR Analyst', 72000, 1),
  ('UI/UX Designer', 80000, 2),
  ('Tech Lead', 90000, 4),
  ('QA and Test Engineer', 85000, 4);


INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
  ('Gustavo', 'Cerati', 4, NULL),
  ('Jimmy', 'Mcgill', 5, 1),
  ('Walter', 'White', 2, 1),
  ('Gustavo', 'Fring', 1, 1),
  ('Jesse', 'Pinkman', 1, 1),
  ('Saul', 'Goodman', 5, 1),
  ('Dexter', 'Morgan', 4, NULL),
  ('Hannibal', 'Lecter', 3, 1),
  ('Charles', 'Xavier', 2, NULL),
  ('Bruce', 'Banner', 6, 1);




  
