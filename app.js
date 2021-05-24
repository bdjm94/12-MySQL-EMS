const mysql = require("mysql");
const inquirer = require("inquirer");
const util = require("util");
const cTable = require("console.table");
const logo = require("asciiart-logo");
const chalk = require("chalk");

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
    var employeeRow = await connection.query("SELECT * FROM role");
    var employee_role = employeeRow.map((employeeRole) => {
      return {
        name: employeeRole.title,
        value: employeeRole.id,
      };
    });

    var managerInfo = await connection.query("SELECT * FROM employees");
    var employee_manager = managerInfo.map((empManager) => {
      return {
        name: empManager.first_name + " " + empManager.last_name,
        value: empManager.id,
      };
    });

    if (employee_manager.length === 0) {
        employee_manager = [{ name: "None", value: null }];
      }

    let noManager = employee_manager;
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
          choices: employee_role,
          message: "What is the Employee's Role?",
        },
        {
          name: "manager_id",
          type: "list",
          choices: employee_manager,
          message: "Who is the Employee's Manager?",
        },
      ]);
      console.log(chalk.magenta("Just Added", response
      ));
      var result = await connection.query("INSERT INTO employees SET ?", {
        id: response.id,
        first_name: response.first_name,
        last_name: response.last_name,
        role_id: response.role_id,
        manager_id: response.manager_id,
      });
      console.table(
        "-------------------------------------------------------------------",
        ` Success! This employee has been added to your database: ${
          response.first_name + " " + response.last_name
        }`,
        "-------------------------------------------------------------------",
      );
      startPrompt();
    } catch (err) {
      console.log(err);
      startPrompt();
    }
  };

var addRole = async () => {
  try {
    var departmentRow = await connection.query("SELECT * FROM department");
    var id_department = departmentRow.map((departmentID) => {
      return {
        name: departmentID.department_name,
        value: departmentID.id,
      };
    });  
var response = await inquirer.prompt([
      {
        name: "title",
        type: "input",
        message: "What is the new Role's title?",
        validate: validInput,
      },
      {
        name: "salary",
        type: "input",
        message: "What is the new Role's Salary?",
        validate: validNum,
      },
      {
        name: "department",
        type: "list",
        choices: id_department,
        message: "What Department does this Role belong to?",
      },
    ]);

    var allRoles = await connection.query("SELECT * FROM role");
    var roleCheck = allRoles.some((each) => each.title === response.title);
    if (roleCheck) {
      console.log(chalk.red("Error! Role already exists! Please try again."));
      startPrompt();
      return;
    }

    var result = await connection.query("INSERT INTO role SET ?", {
        title: response.title,
        salary: response.salary,
        department_id: response.department,
      });
      console.table(
        "---------------------------------------------------",
          ` This role has been added: ${response.title}  `,
        "---------------------------------------------------");
      startPrompt();
    } catch (err) {
      console.log(err);
      startPrompt();
    }
  };

var addDepartment = async () => {
  try {
    var response = await inquirer.prompt([
      {
        name: "department",
        type: "input",
        message: "What is the new Department's name?",
        validate: validInput,
      },
    ]);  

    var allDepartments = await connection.query("SELECT * FROM department");
    var departmentCheck = allDepartments.some(
      (each) => each.department_name === response.department
    );
    if (departmentCheck) {
      console.log(chalk.red("Error! Department already exists! Please try again."));
      startPrompt();
      return;
    }

var result = await connection.query("INSERT INTO department SET ?", {
        id: response.id,
        department_name: response.department,
    });
      console.table(
        "----------------------------------------------------------------------------------",
        `  Success! This department has been added to your database: ${response.department}  `,
        "----------------------------------------------------------------------------------",
      );
      startPrompt();
    } catch (err) {
      console.log(err);
      startPrompt();
    }
  };

var viewEmployees = async () => {
  try {
    var viewTable = await connection.query(
      "SELECT employees.id, employees.first_name, employees.last_name, role.title, department.department_name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees LEFT JOIN role on employees.role_id = role.id LEFT JOIN department on role.id = department.id LEFT JOIN employees manager on manager.manager_id = employees.manager_id"
    );

    console.table(
      "===========================================================================================================",
      "                                              ALL EMPLOYEES",
      "===========================================================================================================",
      viewTable,
      "==========================================================================================================="
    );
    startPrompt();
  } catch (err) {
    console.log(err);
    startPrompt();
  }
};

var viewRoles = async () => {
  try {
    var viewTable = await connection.query(
      "SELECT role.id, title, salary, department_name AS department FROM role INNER JOIN department ON role.department_id = department.id"
    );
    console.table(
      "==================================================================",
      "                          ALL ROLES",
      "==================================================================",
      viewTable,
      "=================================================================="
    );
    startPrompt();
  } catch (err) {
    console.log(err);
    startPrompt();
  }
};

var viewDepartments = async () => {
  try {
    var viewTable = await connection.query(
      "SELECT * FROM department ORDER BY id"
    );
    console.table(
      "=================================================",
      "               ALL DEPARTMENTS",
      "=================================================",
      viewTable,
      "================================================="
    );
    startPrompt();
  } catch (err) {
    console.log(err);
    startPrompt();
  }
};

var updateEmployeeRoles = async () => {
    try {
var employeeRow = await connection.query("SELECT * FROM employees");
var nameEmployee = employeeRow.map((employeeName) => {
        return {
          name: employeeName.first_name + " " + employeeName.last_name,
          value: employeeName.id,
        };
      });

var employeeResponse = await inquirer.prompt([
    {
        name: "employee_id",
        type: "list",
        message: "Choose an Employee that you wish to update",
        choices: nameEmployee,
        },
    ]);

var roleRow = await connection.query("SELECT * FROM role");
var employeeRoleChoices = roleRow.map((employeeRole) => {
    return {
        name: employeeRole.title,
        value: employeeRole.id,
        };
    });

var roleResponse = await inquirer.prompt([
      {
        name: "role_id",
        type: "list",
        message: "Choose a new Role",
        choices: employeeRoleChoices,
      },
    ]);

var managerInfo = await connection.query("SELECT * FROM employees");
var employee_manager = managerInfo.map((empManager) => {
      return {
        name: empManager.first_name + " " + empManager.last_name,
        value: empManager.id,
      };
    });

if (employee_manager.length === 0) {
    employee_manager = [{ name: "None", value: null }];
    }

let noManager = employee_manager;
    noManager.push({ name: "None", value: null });

var managerResponse = await inquirer.prompt([
    {
          name: "manager_id",
          type: "list",
          message: "Choose a new Manager",
          choices: employee_manager,
    },
]);  

var result = await connection.query(`UPDATE employees SET ?, ? WHERE ?`, [
    { role_id: roleResponse.role_id },
    { manager_id: managerResponse.manager_id},
    { id: employeeResponse.employee_id }
  ]);

  console.log(chalk.green("Success! Role has been updated!"));
  startPrompt();
} catch (err) {
  console.log(err);
  startPrompt();
}
};

var exit = async () => {
    console.table(
      "=================================================",
      "    Thanks for the updates. Come back soon!      ",
      "================================================="),
    connection.end();
    };