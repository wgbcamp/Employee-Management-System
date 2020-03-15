//required packages
var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");

//sql server connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "ems_db"
});

//inquirer prompts
function mainPrompt(){
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "main_categories",
            choices: [
                "View All Employees",
                "View All Employees By Department",
                "View All Employees By Manager",
                "Add Employee",
                "Remove Employee",
                "Update Employee Role",
                "Update Employee Manager"
            ]
        }
    ]).then(function(data){

        var answer = data.main_categories;
        switch (answer) {
            case "View All Employees":
                ViewAllEmployees();
                setTimeout(mainPrompt, 100);
            break;
            case "View All Employees By Department":
                DepartmentPrompt();
            break;
            case "View All Employees By Manager":
            break;
            case "Add Employee":
            break;
            case "Remove Employee":
            break;
            case "Update Employee Role":
            break;
            case "Update Employee Manager":
            break;
        }
    })
}

function DepartmentPrompt(){
    inquirer.prompt([
        {
            type: "input",
            name: "department_search",
            message: "Enter the name of the department you want to filter by"
        }
    ]).then(function(data){
        var holdinput = data.department_search;
        ViewEmployeesByDepartment(holdinput);

    })
}

//database functions

function startDatabase(){
    connection.connect(function(err){
        if (err) throw err;
    })
}

function ViewAllEmployees(){
    var sql = "SELECT department.id, DeptName, title, salary, first_name, last_name, manager FROM department LEFT JOIN role ON department.id = role.department_id LEFT JOIN employee ON role.department_id = role_id;";

    queryDatabase(sql);
}


function ViewEmployeesByDepartment(holdinput){

    
    var sql = "SELECT department.id, DeptName, title, salary, first_name, last_name, manager FROM department LEFT JOIN role ON department.id = role.department_id LEFT JOIN employee ON role.department_id = role_id WHERE DeptName IN ('" + holdinput + "');";

    queryDatabase(sql);

        if(parsed = ''){
            console.log("There is no employee working within this department.")         
    }
    setTimeout(mainPrompt, 100);
}

//query database
function queryDatabase(sql){


    connection.query(sql, function(err, data) {
        if (err) throw err;
        var parsed = JSON.parse(JSON.stringify(data));
        var objects = [];

        for (i=0; i< parsed.length; i++){
            objects.push([parsed[i].id, parsed[i].first_name, parsed[i].last_name, parsed[i].title, parsed[i].DeptName, parsed[i].salary, parsed[i].manager]);
        }
            console.table(['id', 'First Name', 'Last Name', 'Title', 'Department', 'Salary', 'Manager'], objects);
    });
    
}

//function invocations
startDatabase();
mainPrompt();