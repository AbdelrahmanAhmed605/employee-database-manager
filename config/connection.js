const mysql = require("mysql2");

// Create a new MySQL connection with the given configuration
const connection = mysql.createConnection(
  {
    host: "",
    // MySQL username,
    user: "",
    // MySQL password
    password: "",
    // Name of the database to connect to
    database: "company",
  },
  console.log(`Connected to the courses_db database.`)
);

// Attempt to connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: ", err);
    return;
  }
  console.log("Connection established successfully.");
});

module.exports = connection;
