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

var addEmployee = async () => {
  try {
    var empRow = await connection.query("SELECT * FROM role");
    var choicesArr = empRow.map((employeeRole) => {
      return {
        name: employeeRole.title,
        value: employeeRole.id,
      };
    });

    var managerInfo = await connection.query("SELECT * FROM employees");
    var managerArr = managerInfo.map((empManager) => {
      return {
        name: empManager.first_name + " " + empManager.last_name,
        value: empManager.id,
      };
    });

    if (managerArr.length === 0) {
        managerArr = [{ name: "None", value: null }];
      }

    let noManager = managerArr;
      noManager.push({ name: "None", value: null });

    var response = await inquirer.prompt([
        {
          name: "first_name",
          type: "input",
          message: "What is the Employee's First Name?",
          validate: validInput,
        },
        {
          name: "last_name",
          type: "input",
          message: "What is the Employee's Last Name?",
          validate: validInput,
        },
        {
          name: "role_id",
          type: "list",
          choices: choicesArr,
          message: "What is the Employee's Role?",
        },
        {
          name: "manager_id",
          type: "list",
          choices: managerArr,
          message: "Who is the Employee's Manager?",
        },
      ]);
      console.table(
        "--------------------------",
        "--------------------------",
        "        Just Added        ",
        response,
        "--------------------------"
      );
      var result = await connection.query("INSERT INTO employees SET ?", {
        id: response.id,
        first_name: response.first_name,
        last_name: response.last_name,
        role_id: response.role_id,
        manager_id: response.manager_id,
      });