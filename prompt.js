const inquirer = require("inquirer");
inquirer
  .prompt([
    {
      type: "list",
      message: "What would you like to do?",
      name: "action",
      choices: [
        "View All Departments",
        "view All Roles",
        "View All Employees",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Update an Employee Role",
        "Quit",
      ],
    },
  ])
  .then((userChoice) => {})
  .catch((err) => console.log(err));
