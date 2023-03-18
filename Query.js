const db = require("./config/connection.js");

//Class provides methods that perform SQL operations based on the inquirer prompt choices selected by the user
class Query {
  /*retrieves a list of departments from the database and returns the result. This method is used to display 
  department names in inquirer prompts.*/
  getDepartments() {
    db.query("SELECT name FROM department", function (err, results) {
      return results;
    });
  }

  /*retrieves a list of roles from the database and returns the result. This method is used to display job titles 
  in inquirer prompts. */
  getRoles() {
    db.query("SELECT title FROM role", function (err, results) {
      return results;
    });
  }

  /*retrieves a list of employee names (concatenated first and last names) from the database and returns the 
  result. This method is used to display employee names in inquirer prompts. */
  getEmployees() {
    db.query(
      "SELECT CONCAT (first_name, ' ', last_name) FROM employee",
      function (err, results) {
        return results;
      }
    );
  }

  //retrieves all departments from the database and logs the result to the console.
  viewAllDepartments() {
    db.query("SELECT * FROM department", function (err, results) {
      console.log(results);
    });
  }

  /*retrieves all roles from the database along with the corresponding department names, salary and role id, and 
  logs the result to the console.*/
  viewAllRoles() {
    db.query(
      `SELECT role.id AS role_id, role.title AS job_title, role.salary, department.name AS department 
      FROM role
      JOIN department
      ON role.department_id = department.id`,
      function (err, results) {
        console.log(results);
      }
    );
  }

  /*retrieves all employee details from the database including their department name, job title, salary, and manager
    name, and logs the result to the console. (LEFT JOIN allows data with NULL employee.manager_id to be selected)*/
  viewAllEmployees() {
    db.query(
      `SELECT employee.id, employee.first_name, employee.last_name, 
      role.title, department.name AS department, role.salary, 
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
      FROM employee 
      JOIN role 
      ON employee.role_id = role.id 
      JOIN department 
      ON role.department_id = department.id 
      LEFT JOIN employee AS manager 
      ON employee.manager_id = manager.id 
      ORDER BY employee.id`,
      function (err, results) {
        console.log(results);
      }
    );
  }

  //inserts a new department into the database with the provided name.
  addDepartment(department) {
    db.query(
      `INSERT INTO department(name) VALUES (?)`,
      department,
      function (err, results) {
        console.log(results);
      }
    );
  }

  /*inserts a new role into the database with the provided title, salary, and department. When inserting the role,
  we want to insert the role's department id so we must convert the department name to it's corresponding id*/
  addRole(roleName, roleSalary, roleDepartment) {
    db.query(
      `INSERT INTO role(title,salary,department_id) VALUES (?,?,(SELECT id FROM department WHERE name=?))`,
      [roleName, roleSalary, roleDepartment],
      function (err, results) {
        console.log(results);
      }
    );
  }

  /*inserts a new employee into the database with the provided first name, last name, role title, and manager name. 
  The method splits the manager name into first name and last name to retrieve the corresponding manager id from 
  the database. Temp table is created because we cannot reference the table being modified in a subquery in the 
  FROM clause of the outer query. Additionally, the use of the temp subquery ensures that only one row is returned 
  for the manager_id field */
  addEmployee(firstName, lastName, role, manager) {
    db.query(
      `INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES (?, ?, (SELECT id FROM role WHERE title = ?), 
        (SELECT id FROM (SELECT id FROM employee WHERE first_name = ? AND last_name = ?) AS temp));`,
      [firstName, lastName, role, manager.split(" ")[0], manager.split(" ")[1]],
      function (err, results) {
        console.log(results);
      }
    );
  }

  /*updates the role of an existing employee in the database with the provided first name and last name to the 
  provided new role.The method splits the employee's name into first name and last name to retrieve the 
  corresponding employee id from the database*/
  updateRole(employee, newRole) {
    db.query(
      `UPDATE employee 
        SET role_id = (SELECT id FROM role WHERE title=?) 
        WHERE first_name = ? AND last_name = ?`,
      [newRole, employee.split(" ")[0], employee.split(" ")[1]],
      function (err, results) {
        console.log(results);
      }
    );
  }
}
