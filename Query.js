const db = require("./config/connection.js");

//Class provides methods that perform SQL operations based on the inquirer prompt choices selected by the user
class Query {
  /*retrieves a list of departments from the database and returns the result. This method is used to display 
  department names as options in inquirer prompts.*/
  getDepartments() {
    return new Promise((resolve, reject) => {
      db.query("SELECT name FROM department", function (err, results) {
        if (err) {
          reject(err);
        } else {
          const depNames = results.map((result) => result.name);
          resolve(depNames);
        }
      });
    });
  }

  /*retrieves a list of roles from the database and returns the result. This method is used to display job titles 
  as options in inquirer prompts. */
  getRoles() {
    return new Promise((resolve, reject) => {
      db.query("SELECT title FROM role", function (err, results) {
        if (err) {
          reject(err);
        } else {
          const roleTitles = results.map((result) => result.title);
          resolve(roleTitles);
        }
      });
    });
  }

  /*retrieves a list of employee names (concatenated first and last names) from the database and returns the 
  result. This method is used to display employee names as options in inquirer prompts. */
  getEmployees() {
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT CONCAT (first_name, ' ', last_name) AS name FROM employee",
        function (err, results) {
          if (err) {
            reject(err);
          } else {
            const employees = results.map((result) => result.name);
            resolve(employees);
          }
        }
      );
    });
  }

  //retrieves all departments from the database and returns the result as a resolved promise value.
  viewAllDepartments() {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM department", function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  /*retrieves all roles from the database along with the corresponding department names, salary and role id, and 
  returns the result as a resolved promise value.*/
  viewAllRoles() {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT role.id AS role_id, role.title AS job_title, role.salary, department.name AS department 
      FROM role
      JOIN department
      ON role.department_id = department.id`,
        function (err, results) {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  }

  /*retrieves all employee details from the database including their department name, job title, salary, and manager
    name, and returns the result as a resolved promise value. (LEFT JOIN allows data with NULL employee.manager_id 
    to be selected)*/
  viewAllEmployees() {
    return new Promise((resolve, reject) => {
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
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  }

  //inserts a new department into the database with the provided name.
  addDepartment(department) {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO department(name) VALUES (?)`,
        department,
        function (err, results) {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  }

  /*inserts a new role into the database with the provided title, salary, and department. When inserting the role,
  we want to insert the role's department id so we must convert the department name to it's corresponding id*/
  addRole(roleName, roleSalary, roleDepartment) {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO role(title,salary,department_id) VALUES (?,?,(SELECT id FROM department WHERE name=?))`,
        [roleName, roleSalary, roleDepartment],
        function (err, results) {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  }

  /*inserts a new employee into the database with the provided first name, last name, role title, and manager name. 
  The method splits the manager name into first name and last name to retrieve the corresponding manager id from 
  the database. Temp table is created because we cannot reference the table being modified in a subquery in the 
  FROM clause of the outer query. Additionally, the use of the temp subquery ensures that only one row is returned 
  for the manager_id field */
  addEmployee(firstName, lastName, role, manager) {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES (?, ?, (SELECT id FROM role WHERE title = ?), 
        (SELECT id FROM (SELECT id FROM employee WHERE first_name = ? AND last_name = ?) AS temp))`,
        [
          firstName,
          lastName,
          role,
          manager.split(" ")[0],
          manager.split(" ")[1],
        ],
        function (err, results) {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  }

  /*inserts a high-level employee(Manager/Executive/etc.) with no direct managers into the database with the 
  provided first name, last name, and role title.*/
  addManager(firstName, lastName, role) {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id)
        VALUES (?, ?, (SELECT id FROM role WHERE title = ?), null)`,
        [firstName, lastName, role],
        function (err, results) {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  }

  /*updates the role of an existing employee in the database with the provided first name and last name to the 
  provided new role with a new manager.The method splits the employee and manager's names into first name and 
  last name to retrieve their corresponding employee id from the database*/
  updateRole(employee, newRole, newManager) {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE employee 
       SET role_id = (SELECT id FROM role WHERE title=?),
       manager_id = (SELECT id FROM (SELECT id FROM employee WHERE first_name = ? AND last_name = ?) AS temp)
       WHERE first_name = ? AND last_name = ?`,
        [
          newRole,
          newManager.split(" ")[0],
          newManager.split(" ")[1],
          employee.split(" ")[0],
          employee.split(" ")[1],
        ],
        function (err, results) {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  }

  /*updates the role of an existing employee in the database with the provided first name and last name to the 
  provided new managerial role*/
  updateRoletoManager(employee, newRole) {
    return new Promise((resolve, reject) => {
      db.query(
        `UPDATE employee 
       SET role_id = (SELECT id FROM role WHERE title=?),
       manager_id = null
       WHERE first_name = ? AND last_name = ?`,
        [newRole, employee.split(" ")[0], employee.split(" ")[1]],
        function (err, results) {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  }
}

module.exports = Query;
