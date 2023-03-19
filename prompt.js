const inquirer = require("inquirer");
// Require Query class
const Query = require("./Query.js");
// Create new instance of Query class
const query = new Query();

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
      "Add a Department",
      "Add a Role",
      "Add an Employee",
      "Update an Employee Role",
      "Quit",
    ],
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
        /* This callback function is used to retrieve employee names from the database and return them as choices 
        for the user to select from. The option "none" is also added in the case that the employee does not have a
        direct manager*/
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

/*Prompts the user with a list of actions they can take related to departments, roles, and employees and waits for 
the user to make a selection. Based on the user's selection,the appropriate corresponding function will execute. 
displayPrompts() calls itself recursively to continue prompting the user with the menu prompt until the "Quit" 
option is selected. */
function displayPrompts() {
  inquirer
    .prompt(menuPrompt)
    .then(async (userChoice) => {
      switch (userChoice.action) {
        case "View All Departments":
        case "View All Roles":
        case "View All Employees":
        case "Add a Department":
        case "Add a Role":
        case "Add an Employee":
        case "Update an Employee Role":
        default:
      }
      displayPrompts();
    })
    .catch((err) => console.log(err));
}

displayPrompts();
