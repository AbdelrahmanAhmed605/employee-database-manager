const inquirer = require("inquirer");
// Require Query class
const Query = require("./Query.js");
// Create new instance of Query class
const query = new Query();
// Print out tables in a nice format
const table = require("console.table");
// Prints out a logo in the terminal
const logo = require("asciiart-logo");

// Prints "Employee Database Manager" as a big logo in the terminal
console.log(
  logo({
    name: "Employee Database Manager",
    font: "Doom",
    lineChars: 10,
    padding: 2,
    margin: 2,
    borderColor: "red",
    logoColor: "bold-yellow",
    textColor: "yellow",
  }).render()
);

// Prompt to be displayed on start
const menuPrompt = [
  {
    type: "list",
    message: "What would you like to do?",
    name: "action",
    choices: [
      "View All Departments",
      "View All Roles",
      "View All Employees",
      "View Employees by Manager",
      "View Employees by Department",
      "View a Department's Budget",
      "Add a Department",
      "Add a Role",
      "Add an Employee",
      "Remove a Department",
      "Remove a Role",
      "Remove an Employee",
      "Update an Employee Role",
      "Update an Employee's Manager",
      "Quit",
    ],
  },
];

// Prompt for viewing all the employees under a selected manager
const viewEmployeebyManagerPrompt = [
  {
    type: "list",
    message: "Please select the manager whose employees you'd like to view: ",
    name: "manager",
    choices: async function () {
      try {
        /* This callback function is used to retrieve employee names from the database and return them as choices 
        for the user to select from. The option "none" is also added in the case that the employee does not have a
        direct manager*/
        const employeeNames = await query.getEmployees();
        return employeeNames;
      } catch (err) {
        console.error(err);
        return [];
      }
    },
  },
];

// Prompt for viewing all the employees in a selected department
const viewEmployeebyDepartmentPrompt = [
  {
    type: "list",
    message: "Please select the department you would like to view: ",
    name: "department",
    choices: async function () {
      try {
        /* This callback function is used to retrieve department names from the database and return them as choices 
        for the user to select from.*/
        const depNames = await query.getDepartments();
        return depNames;
      } catch (err) {
        console.error(err);
        return [];
      }
    },
  },
];

// Prompt for viewing the total budget (the combined salaries of all employees) of a selected department
const viewDepartmentBudgetPrompt = [
  {
    type: "list",
    message: "Please select the department you would like to view: ",
    name: "department",
    choices: async function () {
      try {
        const depNames = await query.getDepartments();
        return depNames;
      } catch (err) {
        console.error(err);
        return [];
      }
    },
  },
];

// Prompt for adding new department
const addDepartmentPrompt = [
  {
    type: "input",
    message: "Please enter the Department's Name: ",
    name: "newDepartment",
    validate: function (value) {
      //ensures the user does not enter a blank input
      if (value === "") {
        return "Field cannot be blank, please enter the Department's Name";
      } else {
        return true;
      }
    },
  },
];

// Prompt for adding new role
const addRolePrompt = [
  {
    type: "input",
    message: "Please enter the role's Job Title: ",
    name: "roleName",
    validate: function (value) {
      if (value === "") {
        return "Field cannot be blank, please enter the role's Job Title: ";
      } else {
        return true;
      }
    },
  },
  {
    type: "input",
    message: "Please enter the role's salary: ",
    name: "roleSalary",
    validate: function (value) {
      //ensures the user does not enter a blank input and ensures the input contains only numbers
      const regex = /^\d+(\.\d{1,5})?$/;
      if (value === "") {
        return "Field cannot be blank, please enter the role's salary";
      } else if (!regex.test(value)) {
        return "input must be a valid number";
      } else {
        return true;
      }
    },
  },
  {
    type: "list",
    message: "Please select the department the role belongs to: ",
    name: "roleDepartment",
    choices: async function () {
      try {
        const depNames = await query.getDepartments();
        return depNames;
      } catch (err) {
        console.error(err);
        return [];
      }
    },
  },
];

// Prompt for adding new employee
const addEmployeePrompt = [
  {
    type: "input",
    message: "Please enter the employee's First Name: ",
    name: "employeeFName",
    validate: function (value) {
      // ensures the user does not enter a blank input and ensures there are no spaces in the input as some queries
      // to the database are made by splitting the first and last names using the space between them
      if (value === "") {
        return "Field cannot be blank, please enter the employee's First Name: ";
      } else {
        if (value.indexOf(" ") === -1) {
          return true;
        }
        return "Input should not contain any spaces. If name contains a space, please use a hyphen '-' instead";
      }
    },
  },
  {
    type: "input",
    message: "Please enter the employee's Last Name: ",
    name: "employeeLName",
    validate: function (value) {
      if (value === "") {
        return "Field cannot be blank, please enter the employee's Last Name: ";
      } else {
        if (value.indexOf(" ") === -1) {
          return true;
        }
        return "Input should not contain any spaces. If name contains a space, please use a hyphen '-' instead";
      }
    },
  },
  {
    type: "list",
    message: "Please select the employee's role: ",
    name: "employeeRole",
    choices: async function () {
      try {
        /* This callback function is used to retrieve job titles from the database and return them as choices 
        for the user to select from.*/
        const roleTitles = await query.getRoles();
        return roleTitles;
      } catch (err) {
        console.error(err);
        return [];
      }
    },
  },
  {
    type: "list",
    message: "Please select the employee's manager: ",
    name: "employeeManager",
    choices: async function () {
      try {
        const employeeNames = await query.getEmployees();
        employeeNames.unshift("none");
        return employeeNames;
      } catch (err) {
        console.error(err);
        return [];
      }
    },
  },
];

// Prompt for removing a department
const removeDepartmentPrompt = [
  {
    type: "list",
    message: "Please select the department you would like to remove: ",
    name: "department",
    choices: async function () {
      try {
        const depNames = await query.getDepartments();
        return depNames;
      } catch (err) {
        console.error(err);
        return [];
      }
    },
  },
];

// Prompt for removing a role
const removeRolePrompt = [
  {
    type: "list",
    message: "Please select the role you would like to remove: ",
    name: "role",
    choices: async function () {
      try {
        const roleTitles = await query.getRoles();
        return roleTitles;
      } catch (err) {
        console.error(err);
        return [];
      }
    },
  },
];

// Prompt for removing an employee
const removeEmployeePrompt = [
  {
    type: "list",
    message: "Please select the employee you would like to remove: ",
    name: "employee",
    choices: async function () {
      try {
        const employeeNames = await query.getEmployees();
        return employeeNames;
      } catch (err) {
        console.error(err);
        return [];
      }
    },
  },
  {
    type: "list",
    message: "Please select the job title of your selected employee: ",
    name: "role",
    choices: async function () {
      try {
        const roleTitles = await query.getRoles();
        roleTitles.unshift("none");
        return roleTitles;
      } catch (err) {
        console.error(err);
        return [];
      }
    },
  },
];

// Prompt for updating an existing employee's role
const updateEmployeePrompt = [
  {
    type: "list",
    message: "Please select the employee you wish to update: ",
    name: "updateEmployee",
    choices: async function () {
      try {
        const employeeNames = await query.getEmployees();
        return employeeNames;
      } catch (err) {
        console.error(err);
        return [];
      }
    },
  },
  {
    type: "list",
    message: "Please select the new role of the employee: ",
    name: "updateRole",
    choices: async function () {
      try {
        const roleTitles = await query.getRoles();
        return roleTitles;
      } catch (err) {
        console.error(err);
        return [];
      }
    },
  },
  {
    type: "list",
    message: "Please select the employee's new manager: ",
    name: "updateManager",
    choices: async function () {
      try {
        const employeeNames = await query.getEmployees();
        employeeNames.unshift("none");
        return employeeNames;
      } catch (err) {
        console.error(err);
        return [];
      }
    },
  },
];

// Prompt for updating an employees manager
const updateEmployeesManagerPrompt = [
  {
    type: "list",
    message: "Please select the employee you wish to update: ",
    name: "employee",
    choices: async function () {
      try {
        const employeeNames = await query.getEmployees();
        return employeeNames;
      } catch (err) {
        console.error(err);
        return [];
      }
    },
  },
  {
    type: "list",
    message: "Please select the role of the selected employee: ",
    name: "employeeRole",
    choices: async function () {
      try {
        const roleTitles = await query.getRoles();
        return roleTitles;
      } catch (err) {
        console.error(err);
        return [];
      }
    },
  },
  {
    type: "list",
    message: "Please select the employee's new Manager': ",
    name: "manager",
    choices: async function () {
      try {
        const employeeNames = await query.getEmployees();
        return employeeNames;
      } catch (err) {
        console.error(err);
        return [];
      }
    },
  },
  {
    type: "list",
    message: "Please select the role of the selected manager: ",
    name: "managerRole",
    choices: async function () {
      try {
        const roleTitles = await query.getRoles();
        return roleTitles;
      } catch (err) {
        console.error(err);
        return [];
      }
    },
  },
];

/*Prompts the user with a list of actions they can take related to departments, roles, and employees and waits for 
the user to make a selection. Based on the user's selection,the appropriate corresponding function will execute. 
displayPrompts() calls itself recursively to continue prompting the user with the menu prompt until the "Quit" 
option is selected. */
function displayPrompts() {
  inquirer
    .prompt(menuPrompt)
    .then(async (userChoice) => {
      switch (userChoice.action) {
        // Case statements for viewing all departments, roles, and employees are used to display data to the console
        case "View All Departments":
          const departmentList = await query.viewAllDepartments();
          console.table(departmentList);
          break;
        case "View All Roles":
          const roleList = await query.viewAllRoles();
          console.table(roleList);
          break;
        case "View All Employees":
          const employeeList = await query.viewAllEmployees();
          console.table(employeeList);
          break;
        case "View Employees by Manager":
          await inquirer
            .prompt(viewEmployeebyManagerPrompt)
            .then(async (userManager) => {
              const managerEmployees = await query.viewEmployeeByManager(
                userManager.manager
              );
              console.table(managerEmployees);
            })
            .catch((err) => console.log(err));
          break;
        case "View Employees by Department":
          await inquirer
            .prompt(viewEmployeebyDepartmentPrompt)
            .then(async (userDepartment) => {
              const departmentEmployees = await query.viewEmployeeByDepartment(
                userDepartment.department
              );
              console.table(departmentEmployees);
            })
            .catch((err) => console.log(err));
          break;
        case "View a Department's Budget":
          await inquirer
            .prompt(viewDepartmentBudgetPrompt)
            .then(async (userDepartment) => {
              const departmentBudget = await query.viewDepartmentBudget(
                userDepartment.department
              );
              console.table(departmentBudget);
            })
            .catch((err) => console.log(err));
          break;
        // Case statements for adding a department, role, or employee are used to prompt the user for input and
        // add the new data to the database
        case "Add a Department":
          await inquirer
            .prompt(addDepartmentPrompt)
            .then(async (userDepartment) => {
              await query.addDepartment(userDepartment.newDepartment);
              console.log(
                `\n${userDepartment.newDepartment} Department added to database\n`
              );
            })
            .catch((err) => console.log(err));
          break;
        case "Add a Role":
          await inquirer
            .prompt(addRolePrompt)
            .then(async (userRole) => {
              await query.addRole(
                userRole.roleName,
                userRole.roleSalary,
                userRole.roleDepartment
              );
              console.log(
                `\nNew Database Addition: ${userRole.roleName} job title added to ${userRole.roleDepartment} department with salary of ${userRole.roleSalary}\n`
              );
            })
            .catch((err) => console.log(err));
          break;
        case "Add an Employee":
          await inquirer
            .prompt(addEmployeePrompt)
            .then(async (userEmployee) => {
              // conditional statement is used to add a manager if the user selects "none" as the manager and
              // adds an employee if otherwise
              if (userEmployee.employeeManager === "none") {
                await query.addManager(
                  userEmployee.employeeFName,
                  userEmployee.employeeLName,
                  userEmployee.employeeRole
                );
                console.log(
                  `\nNew Manager, ${userEmployee.employeeFName} ${userEmployee.employeeLName}, added to the employee database\n`
                );
              } else {
                await query.addEmployee(
                  userEmployee.employeeFName,
                  userEmployee.employeeLName,
                  userEmployee.employeeRole,
                  userEmployee.employeeManager
                );
                console.log(
                  `\nNew Employee, ${userEmployee.employeeFName} ${userEmployee.employeeLName}, added to the employee database\n`
                );
              }
            })
            .catch((err) => console.log(err));
          break;
        // Case statements for remove a department, role, or employee are used to prompt the user for input and
        // remove the new data from the database
        case "Remove a Department":
          const removedDepartment = await inquirer
            .prompt(removeDepartmentPrompt)
            .then(async (userDepartment) => {
              await query.removeDepartment(userDepartment.department);
              console.log(
                `\n${userDepartment.department} Department removed from database\n`
              );
            })
            .catch((err) => console.log(err));
          break;
        case "Remove a Role":
          const removedRole = await inquirer
            .prompt(removeRolePrompt)
            .then(async (userRole) => {
              await query.removeRole(userRole.role);
              console.log(`\n${userRole.role} Role removed from database\n`);
            })
            .catch((err) => console.log(err));
          break;
        case "Remove an Employee":
          const removedEmployee = await inquirer
            .prompt(removeEmployeePrompt)
            .then(async (userEmployee) => {
              if (userEmployee.role === "none") {
                await query.removeEmployeeNoRole(userEmployee.employee);
                console.log(
                  `\n${userEmployee.employee}: Employee removed from database\n`
                );
              } else {
                await query.removeEmployee(
                  userEmployee.employee,
                  userEmployee.role
                );
                console.log(
                  `\n${userEmployee.employee}: Employee removed from database\n`
                );
              }
            })
            .catch((err) => console.log(err));
          break;
        // Case statement for updating an employee role is used to prompt the user for input and update the database
        case "Update an Employee Role":
          await inquirer
            .prompt(updateEmployeePrompt)
            .then(async (userUpdate) => {
              // conditional statement is used to update a role to a manager role (their manager_id is set to null) if
              // the user selects "none" as the manager
              if (userUpdate.updateManager === "none") {
                await query.updateRoletoManager(
                  userUpdate.updateEmployee,
                  userUpdate.updateRole,
                  userUpdate.updateManager
                );
                console.log(
                  `\nDatabase Update: Employee, ${userUpdate.updateEmployee}, has been given the new job title: ${userUpdate.updateRole}. Congratulations on the promotion!\n`
                );
              } else {
                await query.updateRole(
                  userUpdate.updateEmployee,
                  userUpdate.updateRole,
                  userUpdate.updateManager
                );
                console.log(
                  `\nDatabase Update: Employee, ${userUpdate.updateEmployee}, has been given the new job title: ${userUpdate.updateRole}\n`
                );
              }
            })
            .catch((err) => console.log(err));
          break;
        // Case statement for updating an employee's manager is used to prompt the user for input and update the database
        case "Update an Employee's Manager":
          const newEmployeeManager = await inquirer
            .prompt(updateEmployeesManagerPrompt)
            .then(async (userUpdate) => {
              await query.updateEmployeesManager(
                userUpdate.employee,
                userUpdate.employeeRole,
                userUpdate.manager,
                userUpdate.managerRole
              );
              console.log(
                `\nDatabase Update: Employee, ${userUpdate.employee}, has been given the new manager: ${userUpdate.manager}\n`
              );
            })
            .catch((err) => console.log(err));
          break;
        // Default case to exit the application which occurs when the user chooses the "Quit" option in the menu prompt
        default:
          console.log("Ending application now...");
          process.exit();
      }
      // recursion to return back to the menu prompt
      displayPrompts();
    })
    .catch((err) => console.log(err));
}

displayPrompts();
