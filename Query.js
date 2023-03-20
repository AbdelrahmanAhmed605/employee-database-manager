const db = require("./config/connection.js");

// This class contains methods that interact with the database based on user input from the inquirer prompts
class Query {
  /**
   * Retrieves a list of departments from the database and returns the department names as an array.
   * This method is used to display department names as options in inquirer prompts.
   *
   * @returns {Promise} Promise object representing the array of department names
   */
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

  /**
   * Retrieves a list of roles from the database and returns the role titles as an array.
   * This method is used to display job titles as options in inquirer prompts.
   *
   * @returns {Promise} Promise object representing the array of role titles
   */
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

  /**
   * Retrieves a list of employee names (concatenated first and last names) from the database
   * and returns the result as an array. This method is used to display employee names as options
   * in inquirer prompts.
   *
   * @returns {Promise} Promise object representing the array of employee names
   */
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

  /**
   * Retrieves all departments from the database and returns the result as a resolved promise value.
   *
   * @returns {Promise} Promise object representing all departments in the database
   */
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

  /**
   * Retrieves all roles from the database along with the corresponding department names, salary and role id,
   * and returns the result as a resolved promise value.
   *
   * @returns {Promise} Promise object representing all roles in the database
   */

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

  /**
   * Retrieves all employee details from the database including their department name, job title, salary, and manager
   * name, and returns the result as a resolved promise value. A LEFT JOIN operation allows data with NULL employee.manager_id
   * to be selected.
   *
   * @returns {Promise} Resolved promise containing the employee data, or rejected promise containing the error.
   */
  viewAllEmployees() {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT employee.id, employee.first_name, employee.last_name, 
      role.title, department.name AS department, role.salary, 
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
      FROM employee 
      LEFT JOIN role 
      ON employee.role_id = role.id 
      LEFT JOIN department 
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

  /**
   * Retrieves employee details from the database for all employees under the specified manager.
   * The employee details include their department name, job title, salary, and manager name.
   * An INNER JOIN is used to select only rows that have matching records in both tables.
   *
   * @param {string} manager - The name of the manager whose employees are being retrieved.
   * @returns {Promise} A resolved promise containing the employee data, or a rejected promise containing an error.
   */
  viewEmployeeByManager(manager) {
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
      INNER JOIN employee AS manager 
      ON employee.manager_id = manager.id
      WHERE manager.id = (SELECT id FROM (SELECT id FROM employee WHERE first_name = ? AND last_name = ?) AS temp) 
      ORDER BY employee.id`,
        [manager.split(" ")[0], manager.split(" ")[1]],
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

  /**
   * Retrieves employee details from the database for all employees under the specified manager.
   * The employee details include their department name, job title, salary, and manager name.
   * An INNER JOIN is used to select only rows that have matching records in both tables.
   *
   * @param {string} department - The name of the manager whose employees are being retrieved.
   * @returns {Promise} A resolved promise containing the employee data, or a rejected promise containing an error.
   */
  viewEmployeeByDepartment(department) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT employee.id, employee.first_name, employee.last_name, 
      role.title, department.name AS department, role.salary, 
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
      FROM employee 
      LEFT JOIN role
      ON employee.role_id = role.id 
      INNER JOIN department
      ON role.department_id = department.id 
      LEFT JOIN employee AS manager 
      ON employee.manager_id = manager.id
      WHERE department.name = ?
      ORDER BY employee.id`,
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

  /**
   * Retrieves the total budget of a specified department. Adds up the salaries of all the employees in the
   * specified department
   *
   * @param {string} department - The name of the department to be added to the database.
   * @returns {Promise} Resolved promise containing the department data, or rejected promise containing the error.
   */
  viewDepartmentBudget(department) {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT SUM(role.salary) AS total_budget 
        FROM role
        LEFT JOIN department
        ON role.department_id = department.id
        WHERE department.name = ?`,
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

  /**
   * Inserts a new department into the database with the provided name.
   *
   * @param {string} department - The name of the department to be added to the database.
   * @returns {Promise} Resolved promise containing the department data, or rejected promise containing the error.
   */
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

  /**
   * Inserts a new role into the database with the provided title, salary, and department.
   * The department name is converted to its corresponding ID to insert the role's department ID.
   *
   * @param {string} roleName - The title of the new role.
   * @param {number} roleSalary - The salary of the new role.
   * @param {string} roleDepartment - The name of the department the new role belongs to.
   * @returns {Promise} Resolved promise containing the role data, or rejected promise containing the error.
   */
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

  /**
   * Inserts a new employee into the database with the provided first name, last name, role title, and manager name.
   * The manager name is split into first and last name to retrieve the corresponding manager ID from the database.
   * A temporary table is created to reference the modified table in a subquery in the FROM clause of the outer query.
   * Additionally, the use of the temp subquery ensures that only one row is returned for the manager_id field.
   *
   * @param {string} firstName - The first name of the new employee.
   * @param {string} lastName - The last name of the new employee.
   * @param {string} role - The title of the new employee's role.
   * @param {string} manager - The name of the new employee's manager.
   * @returns {Promise} A Promise that resolves with the query results or rejects with an error.
   */
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

  /**
   * Inserts a high-level employee (Manager/Executive/etc.) with no direct managers into the database with the
   * provided first name, last name, and role title.
   *
   * @param {string} firstName - The first name of the new manager.
   * @param {string} lastName - The last name of the new manager.
   * @param {string} role - The title of the new manager's role.
   * @returns {Promise} A Promise that resolves with the query results or rejects with an error.
   */
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

  /**
   * remove a department from the database with the provided name.
   *
   * @param {string} department - The name of the department to be added to the database.
   * @returns {Promise} Resolved promise containing the department data, or rejected promise containing the error.
   */
  removeDepartment(department) {
    return new Promise((resolve, reject) => {
      db.query(
        `DELETE FROM department WHERE name = ?`,
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

  /**
   * removes a role from the database with the provided title
   *
   * @param {string} roleName - The title of the role.
   * @returns {Promise} Resolved promise containing the role data, or rejected promise containing the error.
   */
  removeRole(roleName) {
    return new Promise((resolve, reject) => {
      db.query(
        `DELETE FROM role WHERE title = ?`,
        roleName,
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

  /**
   * Removes an employee from the database given their name and role. The role is used to ensure we are removing
   * the proper employee in case there are more than one employees with the same first and last name
   *
   * @param {string} employeeName - the full name of the employee
   * @param {string} employeeRole - the job title of the employee
   * @returns {Promise} A Promise that resolves with the query results or rejects with an error.
   */
  removeEmployee(employeeName, employeeRole) {
    return new Promise((resolve, reject) => {
      db.query(
        `DELETE FROM employee 
        WHERE (first_name = ? AND last_name = ? AND role_id = (SELECT id FROM role WHERE title = ?));`,
        [employeeName.split(" ")[0], employeeName.split(" ")[1], employeeRole],
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

  /**
   * Updates the role of an existing employee in the database with the provided first name and last name to the
   * provided new role with a new manager. The employee and manager names are split into first and last name to retrieve
   * their corresponding IDs from the database.
   *
   * @param {string} employee - The name of the employee to update.
   * @param {string} newRole - The new role of the employee.
   * @param {string} newManager - The name of the employee's new manager.
   * @returns {Promise} A Promise that resolves with the query results or rejects with an error.
   */
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

  /**
   * Updates the role of an existing employee in the database with the provided first name and last name to the
   * provided new managerial role.
   *
   * @param {string} employee - The full name of the employee to update in the format "first_name last_name".
   * @param {string} newRole - The new managerial role to assign to the employee.
   * @returns {Promise} A Promise that resolves with the results of the database query.
   */
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

  /**
   * Updates the manager of an existing employee in the database. The manager as well as the employee are identified
   * using their first name, last name, and job title. The job title is used as an extra measure in case there are
   * employees with the same first and last name.
   *
   * @param {string} employee - The full name of the employee to update in the format "first_name last_name".
   * @param {string} employeeRole - The job title of the employee.
   * @param {string} manager - The full name of the manager in the format "first_name last_name".
   * @param {string} managerRole - The job title of the manager
   * @returns {Promise} A Promise that resolves with the results of the database query.
   */
  updateEmployeesManager(employee, employeeRole, manager, managerRole) {
    return new Promise((resolve, reject) => {
      db.query(
        `Update employee 
        SET manager_id = (SELECT id FROM (SELECT id FROM employee
          WHERE first_name = ? AND last_name = ? AND role_id = (SELECT id FROM role WHERE title = ?)) AS temp)
          WHERE (first_name = ? AND last_name = ? AND role_id = (SELECT id FROM role WHERE title = ?));`,
        [
          manager.split(" ")[0],
          manager.split(" ")[1],
          managerRole,
          employee.split(" ")[0],
          employee.split(" ")[1],
          employeeRole,
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
}

module.exports = Query;
