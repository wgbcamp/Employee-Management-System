//required packages
var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");

//temporarily held values
var holdDept;
var holdTitle;
var holdSalary;
var holdFirstName;
var holdLastName;
var holdManager;
var holdIdLength;

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
                ManagerPrompt();
            break;
            case "Add Employee":
                NewEmployeePrompt();
            break;
            case "Update Employee Role":
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

            if(!holdinput.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i)){
                holdinput = '';   
        }
        ViewEmployeesByDepartment(holdinput);

    })
}

function ManagerPrompt(){
    inquirer.prompt([
        {
            type: "input",
            name: "manager_search",
            message: "Enter the name of the manager you want to filter by"
        }
    ]).then(function(data){
        var holdinput = data.manager_search;

        if(!holdinput.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i)){
            holdinput = '';   
    }
        ViewEmployeesByManager(holdinput);

    })
}


function NewEmployeePrompt(){
    inquirer.prompt([
        {
            type: "input",
            name: "add_department",
            message: "Enter the name of the department that this employee will work under."
        }
    ]).then(function(data){
        var holdinput = data.add_department;

        if(!holdinput.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i)){
            console.log("The entry must be more than one character long and be numeric, alphabetical, or alphanumeric.");
            setTimeout(mainPrompt, 100);
        }else{
            holdDept = holdinput;
            setTimeout(titlePrompt, 100); 
        }

    })
    
} 
    
    function titlePrompt(){

            inquirer.prompt([
                {
                    type: "input",
                    name: "add_title",
                    message: "Enter the title of this employee."
                }
            ]).then(function(data){
            var holdinput = data.add_title;
            
            if(!holdinput.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i)){
                console.log("The entry must be more than one character long and be numeric, alphabetical, or alphanumeric.");
                setTimeout(mainPrompt, 100);
            }else{
                holdTitle = holdinput;
                setTimeout(salaryPrompt, 100); 
            }
        })
    
    }   

    function salaryPrompt(){

            inquirer.prompt([
                {
                    type: "input",
                    name: "add_salary",
                    message: "Enter the salary of this employee."
                }
            ]).then(function(data){
                var holdinput = data.add_salary;

                if(!holdinput.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i)){
                    console.log("The entry must be more than one character long and be numeric, alphabetical, or alphanumeric.");
                    setTimeout(mainPrompt, 100);
                }else{
                    holdSalary = holdinput;
                    firstNamePrompt();
                }
            })
    }

    function firstNamePrompt(){

        inquirer.prompt([
            {
                type: "input",
                name: "add_firstname",
                message: "Enter the first name of this employee."
            }
        ]).then(function(data){
            var holdinput = data.add_firstname;

            if(!holdinput.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i)){
                console.log("The entry must be more than one character long and be numeric, alphabetical, or alphanumeric.");
                setTimeout(mainPrompt, 100);
            }else{
                holdFirstName = holdinput;
                lastNamePrompt();
            }
        })
    }

    function lastNamePrompt(){

        inquirer.prompt([
            {
                type: "input",
                name: "add_lastname",
                message: "Enter the last name of this employee."
            }
        ]).then(function(data){
            var holdinput = data.add_lastname;

            if(!holdinput.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i)){
                console.log("The entry must be more than one character long and be numeric, alphabetical, or alphanumeric.");
                setTimeout(mainPrompt, 100);
            }else{
                holdLastName = holdinput;
                EmpysManagerPrompt();
            }
        })
    }

    function EmpysManagerPrompt(){

        inquirer.prompt([
            {
                type: "input",
                name: "add_employeemanager",
                message: "Enter the name of the manager for this employee."
            }
        ]).then(function(data){
            var holdinput = data.add_employeemanager;

            if(!holdinput.match(/^([0-9]|[a-z])+([0-9a-z]+)$/i)){
                console.log("The entry must be more than one character long and be numeric, alphabetical, or alphanumeric.");
                setTimeout(mainPrompt, 100);
            }else{
                holdManager = holdinput;
                GetIdLength();
                setTimeout(addBulkToDatabase, 1000); 
            }
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

function ViewEmployeesByManager(holdinput){

    
    var sql = "SELECT department.id, DeptName, title, salary, first_name, last_name, manager FROM department LEFT JOIN role ON department.id = role.department_id LEFT JOIN employee ON role.department_id = role_id WHERE Manager IN ('" + holdinput + "');";

    queryDatabase(sql);

        if(parsed = ''){
            console.log("There is no employee working under this manager.")         
    }
    setTimeout(mainPrompt, 100); 
}

//ADDS BULK DATA TO DATABASE
function addBulkToDatabase(){

    var sql = "INSERT INTO department (DeptName) VALUES ('" + holdDept + "');"; 
    
    var sql2 = "INSERT INTO role (title, salary, department_id) VALUES ('" + holdTitle + "', " + holdSalary + ", (SELECT id FROM department WHERE id = " + holdIdLength + "));";

    var sql3 = "INSERT INTO employee (first_name, last_name, manager, role_id) VALUES ('" + holdFirstName + "', '" + holdLastName + "', '" + holdManager + "', (SELECT id FROM role WHERE id = " + holdIdLength + "));";

    console.log("var sql= " + sql);
    console.log("var sql2= " + sql2);
    console.log("var sql3= " + sql3);
    addToDatabase(sql, sql2, sql3);

}


function GetIdLength(){
    var sql = "SELECT department.id, DeptName, title, salary, first_name, last_name, manager FROM department LEFT JOIN role ON department.id = role.department_id LEFT JOIN employee ON role.department_id = role_id;";

    connection.query(sql, function(err, data) {
        var parsed = JSON.parse(JSON.stringify(data));
        holdIdLength = parsed.length + 1;
    });  
}

//query database and return to main prompt
function queryDatabase(sql){


    connection.query(sql, function(err, data) {
        var parsed = JSON.parse(JSON.stringify(data));
        var objects = [];

        for (i=0; i< parsed.length; i++){
            objects.push([parsed[i].id, parsed[i].first_name, parsed[i].last_name, parsed[i].title, parsed[i].DeptName, parsed[i].salary, parsed[i].manager]);
        }
            console.table(['id', 'First Name', 'Last Name', 'Title', 'Department', 'Salary', 'Manager'], objects);
    });

    
}

function addToDatabase(sql,sql2, sql3){
    connection.query(sql, function(err, data){
        if(err) throw (err);

    })
    connection.query(sql2, function(err, data){
        if(err) throw (err);

    })
    connection.query(sql3, function(err, data){
        if(err) throw (err);

    })
    ViewAllEmployees();
    setTimeout(mainPrompt, 100);
}


//function invocations
startDatabase();
mainPrompt();