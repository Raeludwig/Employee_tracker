const inquirer = require('inquirer');
const mysql = require('mysql2');
require('console.table');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'company_db'
});

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
      'Update an employee role'
    ],
    name: 'start'
  }])
  .then((response) => {
    const action = response.start;
    switch (action) {
      case 'View all employees':
        viewAllEmployees();
        askToContinue();
        break;
      case 'View all roles':
        viewAllRoles();
        askToContinue();
        break;
      case "Add a role":
        getDepartmentsForRoles();
        break;
      case "Add an employee":
        addEmployee();
        break;
      case "Add a department":
        getDepartmentDetail();
        break;
      case "update and employee role":
        updateRole();
        break;
    }
  });
}


// Function to ask to continue after results
function askToContinue() {
    inquirer.prompt({
      type: 'confirm',
      message: 'Do you want to continue?',
      default: true,
      name: 'continue'
    }).then((answer) => {
      if (answer.continue) {
        init(); // calls the initial prompt again
      } else {
        console.log('Exiting...');
        process.exit(0); // exits the application
      }
    });
  }

function viewAllEmployees() {
  db.query('SELECT * FROM employee', function(err, results) {
    if (err) {
      console.error(err);
    } else {
      console.table(results)
    };
  });
};

function viewAllRoles() {
  db.query('SELECT * FROM roles', function(err, results) {
    if (err) {
      console.error(err);
    } else {
      console.table(results);
    }
  });
};

function getRoleDetail(deptList) {
  inquirer.prompt([{
      type: 'input',
      name: 'title',
      message: 'What is the title of the new role?'
    },
    {
      type: 'number',
      name: 'salary',
      message: 'What is the salary of the new role?'
    },
    {
      type: 'list',
      name: 'department_id',
      message: 'What is the department ID for the new role?',
      choices: deptList
    }
  ])
  .then((response) => {
    db.query(
      "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)",
      [response.title, response.salary, response.department_id],
      function(err, results) {
        if (err) {
          console.error(err);
        } else {
          console.log("New role added successfully!");
          console.table(results);
        }
        init();
      }
    );
  });
}

function getDepartmentsForRoles() {
  db.query('SELECT * FROM department', function(err, results) {
    if (err) {
      console.error(err);
    } else {
      const choiceArray = results.map((dept) => {
        return {
          name: dept.department_name,
          value: dept.id
        };
      });
      getRoleDetail(choiceArray);
      
    }
    getDepartmentsForRoles
  });
}

function getDepartmentDetail() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of the new department?'
    }
  ])
  .then((response) => {
    db.query(
      "INSERT INTO department (department_name) VALUES (?)",
      [response.name],
      function(err, results) {
        if (err) {
          console.error(err);
        } else {
          console.log("New department added successfully!");
          console.table(results);
        }
        init();
      }
    );
  });
}

//Adding an employee
function addEmployee() {
    //call async functions that return promises before starting inquirer prompts that rely on them
    Promise.all([getRoles(), getManagers()])
      .then(([roles, managers]) => {
        const roleChoices = roles.map((role) => ({name: role.title, value: role.id}))
        const managerChoices = managers.map(({id,first_name,last_name}) => ({name: `${first_name} ${last_name}`,value: id}))
  
        //prompt after both queries have resolved with data
        inquirer
          .prompt([
            {
              type: "input",
              name: "first_name",
              message: "What is the employee's first name?",
            },
            {
              type: "input",
              name: "last_name",
              message: "What is the employee's last name?",
            },
            {
              type: "list",
              name: "role_id",
              message: "What is the employee's role?",
              choices: roleChoices,
            },
            {
              type: "list",
              name: "manager_id",
              message: "Who is the employee's manager?",
              choices: managerChoices,
            },
          ])
          .then((answers) => {
            db.query(
              'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
              [answers.first_name, answers.last_name, answers.role_id, answers.manager_id],
              (err, results) => {
                if (err) console.error(err);
                else console.log('New employee added successfully!');
                init();
              }
           
            ); 
              addEmployee();
          });
  
      });
  }
  
  function getRoles() {
    return new Promise((resolve, reject) => {
      // make a database query to get all roles
      db.query('SELECT * FROM roles', function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results); // send query results back as promise resolution
        }
      });
    });
  }
  
  function getManagers() {
    return new Promise((resolve, reject) => {
        const query = "SELECT id, first_name, last_name FROM employee WHERE manager_id IS NULL";
        db.query(query, (err, res) => {
            if (err) {
                reject(err);
            } else {
                resolve(res); // send query results back as promise resolution
            }
        });
    });
  }
  
  function getDepartmentDetail() {
    inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the new department?'
      }
    ])
    .then((response) => {
      db.query(
        "INSERT INTO department (department_name) VALUES (?)",
        [response.name],
        function(err, results) {
          if (err) {
            console.error(err);
          } else {
            console.log("New department added successfully!");
            console.table(results);
          }
          init();
        }
      );
    });
  }
  
  //update roles
  function updateRole() {
    db.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee', function(err, employees) {
      if (err) {
        console.error(err);
      } else {
        inquirer.prompt([
          {
            type: 'list',
            name: 'employee_id',
            message: 'Which employee would you like to update?',
            choices: employees.map((employee) => ({
              name: employee.name,
              value: employee.id
            }))
          },
          {
            type: 'number',
            name: 'role_id',
            message: 'What is the ID of the employee\'s new role?'
          }
        ])
        .then(function({ employee_id, role_id }) {
          db.query(
            'UPDATE employee SET role_id = ? WHERE id = ?',
            [role_id, employee_id],
            function(err, results) {
              if (err) {
                console.error(err);
              } else {
                console.log("Employee role updated successfully!");
              }
              init();
            }
          );
        });
      };
    });
  };
  


init();
