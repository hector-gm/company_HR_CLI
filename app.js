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
        `SELECT id, first_name, last_name, roles.title, department.name, roles.salary, manager 
        FROM employee`,
        (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

let employeeArray = [];

// Define Employee list update function:
const updateEmployeeArray = () => {
    employeeArray = [];
    showAllEmployees().then((res) => {
        res.forEach((element) => {
            employeeArray.push(element.Full_Name);
        });
    });
};

// Call on Inquirer and run our CLI app:
const runApp = () => {
 inquirer
    .prompt(
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
).then((res) => {
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

const addRecord = () => {
    inquirer.prompt({
        name: 'addRecord',
        type: 'list',
        message: 'What do you want to add?',
        choices: [
            'Employee',
            'Role',
            'Department',
            '...go back to previous option']
    }).then((res) => {
        switch (res.addRecord) {
            case 'Employee':
                addEmployee();
                break;
            case 'Role':
                addRole ();
                break;
            case 'Department':
                addDepartment ();
                break;
            case '...go back to previous option':
                runApp();
                break;
            default: break;
        }
    });
};

// If user selects the Add Employee option, run the following prompt:
const addEmployee = () => {
    inquirer
     .prompt([
         {
             name: 'firstName',
             type: 'input',
             message: `Employee's first name?`
         },
         {
             name: 'lastName',
             type: 'input',
             message: `Employee's last name?`
         },
         {
             name: 'role',
             type: 'list',
             message: `Employee's role?`,
             choices: roleArray,
         },
         {
             name: 'manager',
             type: 'list',
             message: `Employee's manager?`,
             choices: [...employeeArray, 'None']
         }
     ]).then((res) => {
         let roleID;
         let managerID;
         showAllRoles().then((response) => {
             response.forEach((element) => {
                if (element.title === res.role) {
                 roleID = element.id;
                }
            });
         }).then (() => {
             showAllEmployees().then((resp) => {
                 resp.forEach((element) => {
                     if (element.Full_Name === res.manager) {
                         managerID = element.id;
                     } else if (res.manager === 'None') {
                         managerID = null;
                     }
                 });
             }). then (() => {
                 let employee = {
                     first_name: res.firstName,
                     last_name: res.lastName,
                     role_id: roleID,
                     manager_id: managerID
                 };
                connection.query(
                    'INSERT INTO employee SET ?'
                    [employee],
                    (err) => {
                        if (err) throw err;
                    }
                );
                    console.table(employee);
                    updateEmployeeArray();
                    runApp();
             });
         });
     }).catch((err) => {
         if (err) throw err;
     });
};

// If user chooses to create a new role, the following prompt runs:

const addRole = () => {
    inquirer
     .prompt([
         {
             name: 'title',
             type: 'input',
             message: 'What is the new role title?'
         },
         {
             name: 'salary',
             type: 'number',
             message: 'What is the salary for this role?'
         },
         {
             name: 'department',
             type: 'list',
             message: 'To what department does the role belong?',
             choices: departmentArray
         }
     ]).then((res) => {
         const title = res.title;
         const salary = res.salary;
         let deptID;
         showAllDepartments().then((department) => {
             department.forEach((element) => {
                 if (element.name === res.department) {
                     deptID = element.id;
                 }
             });
         }).then (() => {
             const role = {
                 title: title,
                 salary: salary,
                 department_id: deptID
             };
             connection.query('INSERT INTO roles SET ?'), [role], (err) => {
                 if (err) { 
                     throw err;
             }
         }});
         console.table(role);
         updateRoles();
         runApp();
     });
};

// Define function to create a new Department in the database:
const addDepartment = () => {
    inquirer
     .prompt({
         name: 'departmentName',
         type: 'input',
         message: 'What Department is being added?'
     }).then((res) => {
         connection.query(
             'INSERT INTO department SET ?',
             [{ name: res.departmentName }],
             (err) => {
                 if (err) {
                    throw err;
                 }
             }
         );
     });
     updateDepartmentArray();
     runApp();
};

// Define the function to allow looking up of records by categories:
const lookUp = () => {
    inquirer
        .prompt({
            name: 'lookFor',
            type: 'list',
            message: 'What would you like to look for?',
            choices: [
                'Show all employees',
                'Show all roles',
                'Show all departments',
                'Show a particular employee',
                'Show all employees by role',
                'Show all employees by department',
                'Go back to previous options'
            ],
        }).then((res) => {
            switch (res.lookFor) {
                case 'Show all employees':
                    showAllEmployees().then((res) =>{
                        console.table(res);
                        runApp();
                    });
                    break;

                case 'Show all roles':
                    showAllRoles().then((res) =>{
                        console.table(res);
                        runApp();
                    });
                    break;
                
                case 'Show all departments':
                    showAllDepartments().then((res) => {
                        console.table(res);
                        runApp();
                    });
                    break;

                case 'Show a particular employee':
                    showEmployee().then((res) => {
                        console.table(res);
                        runApp();
                    });
                    break;
                
                case 'Show all employees by role':
                    showAllByRole().then((res) => {
                        console.table(res);
                        runApp();
                    });
                    break;

                case 'Show all employees by department':
                    showAllByDepartment().then((res) => {
                        console.table(res);
                        runApp();
                    });
                    break;
                
                case 'Go back to previous options':
                    runApp();

                default: break;
            }
        });
};

// Define the individual record look up function referenced above:
const showEmployee = () => {
    inquirer    
        .prompt({
            name: 'employee',
            type: 'list',
            message: 'Choose employee:',
            choices: [...employeeArray, 'Go Back'],
        }).then((res) => {
            if (res.employee === 'Go Back') {
                lookUp();
            } else {
                showAllEmployees().then((employees) => {
                    employees.forEach((element) => {
                        if (res.employee === element.Full_Name) {
                            console.table(element);
                        }
                    });
                    runApp();
                });
            }
        });
};

// Define function to enable search by role:
const showAllByRoleParameters = () => {
    inquirer
        .prompt({
            name: 'role',
            type: 'list',
            message: 'Select role:',
            choices: [...roleArray, 'Go Back']
        }).then ((res) => {
            showAllByRole(res.role).then((response) => {
                console.table(response);
                runApp();
            });
        });
};

const showAllByRole = (role) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT id, first_name, last_name, roles.title, department.name, roles.salary 
            FROM employee WHERE ? ORDER BY id`,
            [{ title: role }],
            (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            }
        );
    });
};

const showAllByDepartmentParameters = () => {
    inquirer
        .prompt({
            name: 'department',
            type: 'list',
            message: 'Select department:',
            choices: [...departmentArray, 'Go back'],
        }).then((res) => {
            showAllByDepartment(res.department).then((response) => {
                console.table(response);
                runApp();
            });
        });
};

const showAllByDepartment = (department) => {
    return new Promise((resolve, reject) => {
        connection.query(
            `SELECT  `
        )
    })
}