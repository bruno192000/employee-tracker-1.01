//requirements
const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');

// once connection is successed, then start the app
db.connect(err => {
  if (err) throw err;
  startApp();
});

//prompts for the menu
function startApp() {
  inquirer.prompt([
    {
      type: 'list',
      name: 'toDo',
      message: 'What would you like to do?',
      choices: [
                'View all departments?', 
                'View all roles?',
                'View all employees?', 
                'Add a new department?',
                'Add a new role?',
                'Add a new employee?',
                'Update an employee/s role?',
                'Update an employee/s manager?',
                'Update a role/s department?'
              ]
    },
  //action depending of the option selected
  ]).then(function(action) {
    switch(action.toDo) {
      case 'View all departments?':
        viewDepartments()
        break;

      case 'View all roles?':
        viewRoles()
        break;

      case 'View all employees?':
        viewEmployees()
        break;

      case 'Add a new department?':
        addDepartment()
        break;

      case 'Add a new role?':
        addRole()
        break;

      case 'Add a new employee?':
        addEmployee()
        break;

      case 'Update an employee/s role?':
        updateEmployeeRole()
        break;

      case 'Update an employee/s manager?':
        updateEmployeeMngr()
        break;

      case 'Update a role/s department?':
        updateRoleDept()
        break;
    };
  });
};

//functions for choices selected

//view all departments
const viewDepartments = () =>  {
  const sql = `SELECT * FROM departments`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err)
    }
    console.table(rows)
    startApp();
  });
};

//view roles 
const viewRoles = () =>  {
  const sql = `SELECT roles.id, roles.title, roles.salary, departments.dept_name
  FROM roles
  LEFT JOIN departments ON roles.department_id = departments.id`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err)
    }
    console.table(rows)
    startApp();
  });
};

//view employees 
const viewEmployees = () =>  {
  const sql = `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.dept_name As department, roles.salary, CONCAT(emp.first_name, ' ' ,emp.last_name) AS Manager 
  FROM employees
  LEFT JOIN roles ON employees.role_id = roles.id
  LEFT JOIN departments ON roles.department_id = departments.id
  LEFT JOIN employees emp ON employees.manager_id = emp.id; `;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err)
    }
    console.table(rows)
    startApp();
  });
};

//add new departments 
const addDepartment = () =>  {
  inquirer.prompt([
    {
      type: 'input',
      name: 'addDept',
      message: 'Enter the name of the department you would like to add:'
    }
  //input entered and add it to table
  ]).then(deptName => {
    const sql = `INSERT INTO departments (dept_name)
    VALUES (?)`;
    const dept = deptName.addDept
    db.query(sql, dept, (err, rows) => {
      if (err) {
        console.log(err);
      }
      viewDepartments();
    });
  });
};

//add a new role 
const addRole = () =>  {
  inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the title of the role you would like to add:'
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter the salary of the role:'
    }
  //input entered and add it to table
  ]).then(role => {
    const sql = `INSERT INTO roles (title, salary)
    VALUES (?,?)`;

    const roleAdded = [role.title, role.salary];

    db.query(sql, roleAdded, (err, rows) => {
      if (err) {
        console.log(err);
      }
      viewRoles();
    });
  });
};

//add a new employee 
const addEmployee = () =>  {
  inquirer.prompt([
    {
      type: 'input',
      name: 'firstName',
      message: 'Enter the first name of the employee you would like to add:'
    },
    {
      type: 'input',
      name: 'lastName',
      message: 'Enter the employee\'s last name:'
    }
  //input entered and add it to table
  ]).then(ee => {
    const sql = `INSERT INTO employees (first_name, last_name)
    VALUES (?,?)`;

    const roleAdded = [ee.firstName, ee.lastName];

    db.query(sql, roleAdded, (err, rows) => {
      if (err) {
        console.log(err);
      }
      viewEmployees();
    });
  });
};


//update employee 
const updateEmployeeRole = () =>  {
  
  //arrays with options
  let employeeChoices = []
  let roleChoices = []
  
  const sqlEE = `SELECT id, CONCAT(first_name,' ',last_name) AS Employee FROM employees`
  const sqlRole = `SELECT id, title FROM roles`

  db.query(sqlEE, (err, ee) => {
    if (err) {
      console.log(err);
    }
    //get results and push them to employee
    for (let i = 0; i < ee.length; i++) {
      employeeChoices.push(ee[i].Employee)
    };

    db.query(sqlRole, (err, role) => {
      if (err) {
        console.log(err);
      }
      //get results and push them to employee roles
      for (let i = 0; i < role.length; i++) {
        roleChoices.push(role[i].title);
      };

      inquirer.prompt([
        {
          name: 'eeChoices',
          type: 'list',
          message: 'Whose role would you like to update?',
          choices: employeeChoices
        },
        {
          name: 'roleChoices',
          type: 'list',
          message: 'What is their new role?',
          choices: roleChoices
        }
      ]).then(function(ans) {
        let employeeID;
        let roleID;

        //get element that matches with selected choice, get element's id and assign to employee id variable
        for (i=0; i < ee.length; i++){
          if (ans.eeChoices == ee[i].Employee) {
            employeeID = ee[i].id;
          }
        };
        //get element that matches selected choice, get element's id and assign to role id variable
        for (i=0; i < role.length; i++){
          if (ans.roleChoices == role[i].title){
            roleID = role[i].id;
          }
        };
          
        //update query for assigning new role to employee
        const sqlUpdate = `UPDATE employees SET role_id = ${roleID} WHERE id = ${employeeID}`
        db.query(sqlUpdate, (err, res) => {
          if (err) {
            console.log(err);
          }
          viewEmployees();
        });
      });
    });
  });
};

//update employee's manager 
const updateEmployeeMngr = () =>  {
  
  //list of options in the inquirer choices with array
  let employeeNames = []
  
  const sqlEE = `SELECT id, CONCAT(first_name,' ',last_name) AS Employee FROM employees`

  db.query(sqlEE, (err, ee) => {
    if (err) {
      console.log(err);
    }
    //get results and push employee into employeeNames array.
    for (let i = 0; i < ee.length; i++) {
      employeeNames.push(ee[i].Employee)
    };

    inquirer.prompt([
      {
        name: 'eeChoices',
        type: 'list',
        message: 'Whose manager would you like to update?',
        choices: employeeNames
      },
      {
        name: 'mngrChoices',
        type: 'list',
        message: 'Who is their new manager?',
        choices: employeeNames
      }
    ]).then(function(ans) {
      let employeeID;
      let mngrID;

      //get element that matches selected choice, get element's ID and assign to employee id variable
      for (i=0; i < ee.length; i++){
        if (ans.eeChoices == ee[i].Employee) {
          employeeID = ee[i].id;
        }
      };
      //get element that matches selected choice, get element's id and assign to manager id variable
      for (i=0; i < ee.length; i++){
        if (ans.mngrChoices == ee[i].Employee){
          mngrID = ee[i].id;
        }
      };

      //update for assigning new manager to employee
      const sqlUpdate = `UPDATE employees SET manager_id = ${mngrID} WHERE id = ${employeeID}`
      db.query(sqlUpdate, (err, res) => {
        if (err) {
          console.log(err);
        }
        viewEmployees();
      });
    });
  });
};

//update role's department
const updateRoleDept = () =>  {

  //list of options in the inquirer choices
  let roleArr = []
  let deptArr = []
  
  const sqlRole = `SELECT id, title FROM roles`
  const sqlDept = `SELECT id, dept_name FROM departments`

  db.query(sqlRole, (err, role) => {
    if (err) {
      console.log(err);
    }
    //get results push role into roleArr.
    for (let i = 0; i < role.length; i++) {
      roleArr.push(role[i].title)
    };

    db.query(sqlDept, (err, dept) => {
      if (err) {
        console.log(err);
      }
      //Get results and push department into deptArr.
      for (let i = 0; i < dept.length; i++) {
        deptArr.push(dept[i].dept_name);
      };
      
      inquirer.prompt([
        {
          name: 'roleUD',
          type: 'list',
          message: 'Which role would you like to update the department for?',
          choices: roleArr
        },
        {
          name: 'newDept',
          type: 'list',
          message: 'What is the role\'s updated department?',
          choices: deptArr
        }
      ]).then(function(ans) {
        let deptID;
        let roleID;

        //get element that matches selected choice, get element's id and assign to role id variable
        for (i=0; i < role.length; i++){
          if (ans.roleUD == role[i].title) {
            roleID = role[i].id;
          }
        };
        //get element that matches selected choice, get element's id and assign to dept id variable
        for (i=0; i < dept.length; i++){
          if (ans.newDept == dept[i].dept_name) {
            deptID = dept[i].id;
          }
        };

        //update query for assigning a department to role
        const sqlUpdate = `UPDATE roles SET department_id = ${deptID} WHERE id = ${roleID}`
        db.query(sqlUpdate, (err, res) => {
          if (err) {
            console.log(err);
          }
          viewRoles();
        });
      });
    });
  });
};
