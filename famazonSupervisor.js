//login protected
require("dotenv").config();

var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require('cli-table');

var table = new Table({
    head: ['department_id', 'department_name', 'over_head_costs', 'product_sales', 'total_profit'], colWidths: [30, 30, 30, 30, 30] 
});

var connection = mysql.createConnection({
    host: process.env.host,
    port: process.env.port,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});

inquirer.prompt([
    {
        type: "list",
        message: "Select a Menu option: ",
        choices: ["View Product Sales by Department", "Create New Department"],
        name: "menu"
    },
]).then(function(inquirerRes){
    switch(inquirerRes.menu) {
        case 'View Product Sales by Department':
            connection.query(
                "SELECT d.department_id, d.department_name, d.over_head_costs, p.product_sales FROM departments AS d LEFT JOIN products AS p ON d.department_name = p.department_name",
                function(err, res) {
                    if (err) throw err;
                    //console.log(res)
                    for (var i = 0; i < res.length; i++) {
                        var itemRow = []
                        itemRow.push(res[i].department_id);
                        itemRow.push(res[i].department_name);
                        itemRow.push(res[i].over_head_costs);
                        itemRow.push(res[i].product_sales);
                        var profits = res[i].product_sales - res[i].over_head_costs;
                        itemRow.push(profits);
                        table.push(itemRow);
                    }
                    console.log(table.toString());
                    connection.end();
                }
            )
            break;
        case 'Create New Department':
            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the name of the department you would like to add?",
                    name: "dname"
                },
                {
                    type: "input",
                    message: "What is the overhead cost of the department you would like to add?",
                    name: "cost"
                },
            ]).then(function(inqRes){
                var newDname = inqRes.dname;
                var oCost = inqRes.cost;
                connection.query({
                    sql: "INSERT INTO departments SET ?",
                    values: [
                        {
                            department_name: newDname,
                            over_head_costs: oCost
                        },
                    ]
                }, function(err, res) {
                    if (err) throw err.sqlMessage;
                    console.log(`New department added!`);
                    connection.end();
                })
            })
            break;
        default:
            console.log('You have encountered an error.')
            break;
    }
})
