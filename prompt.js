const inquirer = require("inquirer");
const Query = require("./Query.js");
const query = new Query();

const menuPrompt = [
  {
    type: "list",
    message: "What would you like to do?",
    name: "action",
    choices: [
      "View All Departments",
      "View All Roles",
      "View All Employees",
      "Add a Department",
      "Add a Role",
      "Add an Employee",
      "Update an Employee Role",
      "Quit",
    ],
  },
];

const addDepartmentPrompt = [
  {
    type: "input",
    message: "Please enter the Department's Name: ",
    name: "newDepartment",
    validate: function (value) {
      if (value === "") {
        return "Field cannot be blank, please enter the Department's Name";
      } else {
        return true;
      }
    },
  },
];

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
      const regex = /^[0-9]+$/;
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
    choices: query.getDepartments(),
  },
];

const updateEmployeePrompt = [
  {
    type: "list",
    message: "Please select the employee you wish to update: ",
    name: "updateEmployee",
    choices: query.getEmployees(),
  },
  {
    type: "list",
    message: "Please select the new role of the employee: ",
    name: "updateRole",
    choices: query.getRoles(),
  },
];

function displayPrompts() {
  inquirer
    .prompt(menuPrompt)
    .then((userChoice) => {
      switch (userChoice.action) {
        case "View All Departments":
          query.viewAllDepartments();
          break;
        case "View All Roles":
          query.viewAllRoles();
          break;
        case "View All Employees":
          query.viewAllEmployees();
          break;
        case "Add a Department":
          inquirer
            .prompt(addDepartmentPrompt)
            .then((userDepartment) => {
              query.addDepartment(userDepartment.newDepartment);
            })
            .catch((err) => console.log(err));
          break;
        case "Add a Role":
          inquirer.prompt(addRolePrompt).then((userRole) => {
            query.addRole(
              userRole.roleName,
              userRole.roleSalary,
              userRole.roleDepartment
            );
          });
          break;
        case "Add an Employee":
          const employeeChoices = query.getEmployees();
          employeeChoices.unshift("none");
          inquirer
            .prompt([
              {
                type: "input",
                message: "Please enter the employee's First Name: ",
                name: "employeeFName",
                validate: function (value) {
                  if (value === "") {
                    return "Field cannot be blank, please enter the employee's First Name: ";
                  } else {
                    return true;
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
                    return true;
                  }
                },
              },
              {
                type: "list",
                message: "Please select the employee's role: ",
                name: "employeeRole",
                choices: query.getRoles(),
              },
              {
                type: "list",
                message: "Please select the employee's manager: ",
                name: "employeeManager",
                choices: employeeChoices,
              },
            ])
            .then((userEmployee) => {
              if (userEmployee.employeeManager === "none") {
                query.addManager(
                  userEmployee.employeeFName,
                  userEmployee.employeeLName,
                  userEmployee.employeeRole
                );
              } else {
                query.addEmployee(
                  userEmployee.employeeFName,
                  userEmployee.employeeLName,
                  userEmployee.employeeRole,
                  userEmployee.employeeManager
                );
              }
            });
          break;
        case "Update an Employee Role":
          inquirer.prompt(updateEmployeePrompt).then((userUpdate) => {
            query.updateRole(userUpdate.updateEmployee, userUpdate.updateRole);
          });
          break;
        default:
          console.log("Ending application now...");
          process.exit();
      }
      displayPrompts();
    })
    .catch((err) => console.log(err));
}

displayPrompts();
