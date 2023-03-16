const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');

const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: '',
        database: 'company_db'
    },
    init()

);


function init() {
    inquirer.prompt([{
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            'View all employees',
            'View all roles',
            'Add a role',
            'Add an employee',
            'Add a department',
            'update and employee role'
        ],
        name: 'start'
    },])
        .then((response) => {
            const action = response.start;
            switch (action) {
                case 'View all employees':
                    viewAllEmployees();
                    break;
                case 'View all roles':
                    viewAllRoles();
                    break;
                case "Add a role":
                    getDepartmentsForRoles();
                    break;
            }
        });
};

function viewAllEmployees() {
    db.query('SELECT * FROM employee', function (err, results) {
        if (err) {
            console.error(err);
        } else {
            console.table(results);
        }

    });
}

function viewAllRoles() {
    db.query('SELECT * FROM roles', function (err, results) {
        if (err) {
            console.error(err);
        } else {
            console.table(results);
        }

    });
}

function getRoleDetail(deptList) {

    inquirer.prompt([{
        type: 'input',
        name: 'title',
        message: 'What is the title of the new role?'
    },
{
    type: 'input',
    name: 'salary',
    message: 'What is the salary of the new role?'
    },
    {
        type: 'list',
        name: 'department_id',
        message: 'What is the title of the new role?',
        choices: deptList
    }
    ]) .then((response) => {
        db.query('SELECT * FROM roles', function (err, results) {
            if (err) {
                console.error(err);
            } else {
                console.table(results);
            }
    
        });
        // TODO:db.query to add response to db
    })
}

function getDepartmentsForRoles(){
    db.query('SELECT * FROM department', function (err, results) {
        if (err) {
            console.error(err);
        } else {
            const choiceArray = results.map((dept)=> {
               return {
                    name: dept.department_name, 
                    value: dept.id
                }
            })
            getRoleDetail(choiceArray)
        }

    });
}
