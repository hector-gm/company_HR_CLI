// Declaring the Node dependencies:
const inquirer = require("inquirer");
const mysql = require("mysql");

// Establishing connection to MySQL for database management: 
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "#3Ck1t0ur561",
    database: "employeeRecords_db",
});

connection.connect(async (err) => {
    if (err) throw err;
    runApp();
})

// Define All Roles look up function:
const showAllRoles = () => {
    return new Promise ((resolve, reject) => {
        connection.query(
            'SELECT id, title, salary, department_id FROM roles',
            (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
    });
};

let roleArray = [];

// Define Update Roles function:
const updateRoles = () => {
    roleArray = [];
    showAllRoles().then((res) => {
        res.forEach((element) => {
            roleArray.push(element.title);
        });
    });
};

// Define All Departments look up function:
const showAllDepartments = () => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT id, name FROM department', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

let departmentArray = [];

// Define Update Departments function:
const updateDepartmentArray = () => {
    departmentArray = [];
    showAllDepartments().then((res) => {
        res.forEach((element) => {
            departmentArray.push(element.name);
        });
    });
};

// Define All Employees look up function:
const showAllEmployees = () => {
    return new Promise((resolve, reject) => {
        connection.query(
            
        )
    })
}

// Call on Inquirer and run our CLI app:
const runApp = () => {
 inquirer
    .prompt([
        {
            name: "initialTask",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Add Record",
                "Look Up",
                "Update Record",
                "Delete Record",
                "Exit",
            ],
        },
)]
    .then((res) => {
        switch (res.initialTask) {
            case "Add Record":
                addRecord();
                break;
            case "Look Up":
                lookUp();
                break;
            case "Update Record":
                updateRecord;
                break;
            case "Delete Record":
                deleteRecord();
                break;
            case "Exit":
                connection.end();
                process.exit();
                break;
            default: break;
        }
    });
};