const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");
const cTable = require("console.table");
const logo = require("asciiart-logo");
const chalk = require("chalk");
const { async } = require("rxjs");

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

  var startPrompt = async () => {
      try {
          var selection = await inquirer.prompt({
              name: "task",
              type: "list",
              message: "Choose a task from the below",
              choices: [
                  "Add a new Employee",
                  "Add a new Role",
                  "Add a new Department",
                  "View all Employees",
                  "View all Roles",
                  "View all Departments",
                  "Update Employee Roles",
                  "Delete Employee",
                  "Delete Role",
                  "Exit",
              ],
          });
          switch (selection.task) {
            case "Add a new Employee":
                addEmployee();
                break;

            case "Add a new Role":
                addRole();
                break;

            case "Add a new Department":
                addDepartment();
                break;
      
            case "View all Employees":
                viewEmployees();
                break;
                
            case "View all Roles":
                viewRoles();
                break;      

            case "View all Departments":
                viewDepartments();
                break;
      
            case "Update Employee Roles":
                updateEmployeeRoles();
                break;

            case "Delete Employee":
                deleteEmployee();
                break;
                
            case "Delete Role":
                deleteRole();
                break;    
      
            case "Exit":
              exit();
              break;
      
            default:
              connection.end();
          }
        } catch (err) {
          console.log(err);
          console.table(selection.task);
          startPrompt();
        }
      };


const validInput = (answer) => {
    if (answer === "") {
        return "This field cannot be empty!";
    }
        return true;
      };

const validNum = (input) => {
    if (isNaN(input) === false) {
        return true;
    }
        return "Please enter a number!";
      };
