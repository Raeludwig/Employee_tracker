const inquirer= require('inquirer');


function init(){
    inquirer.prompt([{
        type: 'list',
        message: 'What would you like to do?',
        choices:[
            'View all employees',
            'View all roles',
            'Add a role',
            'Add an employee',
            'Add a department',
            'update and employee role'
        ],
        name:'start'
    },])
    .then((response) =>{
        console.log(response);
    });
};

init();