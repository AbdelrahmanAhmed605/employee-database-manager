# Employee Database Manager

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Description

A command-line application that manages a company's employee database, using Node.js, Inquirer, and MySQL. The database contains three tables: department, role, and employee. The schema defining how the data is organized in the database is shown below. Using the npm mysql2 package, we connect to the MySQL server to perform operations on the database. Using the inquirer package, a menu prompt is presented to the user containing a list of actions they can take related to departments, roles, and employees and waits for the user to make a selection. Based on the user's selection, CRUD operations will be made to the SQL database and the results are presented to the user. After each operation, the menu prompt reappears until the user selects the "Quit" option in the menu. During this project, Abdelrahman learnt the following skills:
- Perform MySQL CRUD operations using the npm mysql2 package
- Using JOIN in SQL operations to combine rows from two or more tables, based on a related column between them.
- Using LEFT JOINS in SQL operations to return all records from the left table, and the matched records from the right table (allowing me to present information that contains null data)
- Using INNER JOINS in SQL operations to only return matching records (does not return data with null matches)
- Using subqueries to retrieve data from one or more tables and then use that data to perform additional queries on another table. This allows for greater flexibility and precision when querying databases.
- Creating promise objects to work conduct SQL CRUD operations while running inquirer prompts. This allows the prompt to wait for the completion of the SQL operations before proceeding with the prompts

**Database Schema**

![Schema of Database showing how data is organized](/assets/schema.png)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [How to Contribute](#how-to-contribute)
- [Tests](#tests)
- [Questions](#questions)

## Installation

As the project does not use publishing softwares like Heroku and is only availabe in the command line, the user will have to install the project packages (inquirer, mysql2, asciiart-logo, console.table). To install these packages, the user must navigate to the main directory of the project where the package.json file is contained and run the command `npm i` or `npm install` in the terminal. Once the packages are installed, the user must navigate to the `connection.js` file inside the `config` folder and enter their MySQL configuartion information (host, user, password). This will allow the program to connect to your MySQl account in the server. Next you must navigate to the `schema.sql` file in the `db` folder and enter the following command in the terminal `mysql -u root -p` to connect to the MySQl server. After entering your MySQL password, enter the command `source schema.sql` to run the schema.sql file and create the company database (Please ensure you are in the `db` directory in the terminal). Finally exit the MySQL terminal and return to the main directory where the package.json file is and run the command `npm start` or `node prompt` to run/start the application.

## Usage

For a walkthrough of how to use the application, refer to the following demonstration: https://drive.google.com/file/d/1P930BQhPbT6PK5FmFCX0Rib6B_ukWW2U/view
For a walkthrough of the bonus operations added to the application, refer to the following demonstration: https://drive.google.com/file/d/1tUP_nTflXxSKNjXRHkctlX-QwjLg5C2H/view

Once the packages are installed, to run the application, the user must type `npm start` in the terminal. This will then generate a menu prompt to the user. When the user selects the "view" options, the data will be presented as a formatted table. When the user selects the "add" or "update" options, futher prompts will appear to acquire more information from the user. When the user completes all the prompts, a message will appear confirming the completion of the user's operation to the database. After each operation is completed, the user is returned to the menu prompt to complete as many operations as needed. When the user is done using the application, they can select the "Quit" option in the menu prompt to exit the application.

## License

This project is licensed under the MIT License. To see the license permissions for commercial and non-commercial use, modification, and distribution of the software, please see the full text of the license, available at https://opensource.org/licenses/MIT.

## How to Contribute

N/A

## Tests

N/A

## Questions

If you have any questions regarding this application, feel free to reach me at abdelrahman.ahmed605@hotmail.com with the subject title "Questions for Employee Database Manager"
You can also find me on github here: https://github.com/AbdelrahmanAhmed605


