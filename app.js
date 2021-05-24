const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");
const cTable = require("console.table");
const logo = require("asciiart-logo");
const chalk = require("chalk")

function displayLogo() {
    console.log(
        logo({
            name: 'Employee Management System',
            lineChars: 10,
            padding: 2,
            margin: 3,
            borderColor: 'grey',
            logoColor: 'green',
            textColor: 'white',
        })
        .render()
    );
}

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employee_tracker_DB",
  });

connection.query = util.promisify(connection.query);

connection.connect((err) => {
    if (err) {
      console.error(chalk.red("Error connecting: " + err.stack));
      return;
    }
    console.log(chalk.magenta("Successfully connected to MySQL server!"));
    displayLogo();
    startPrompt();
  });