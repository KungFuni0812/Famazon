//login protected
require("dotenv").config();

var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require('cli-table');

var table = new Table({
    head: ['ID', 'Product Name', 'Price', 'Stock Quantity'], colWidths: [10, 20, 10, 20] 
});

var connection = mysql.createConnection({
    host: process.env.host,
    port: process.env.port,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});

function buildProductTable(resultArray) {
    for (var i = 0; i < resultArray.length; i++) {
        var itemRow = []
        itemRow.push(resultArray[i].id);
        itemRow.push(resultArray[i].product_name);
        itemRow.push(resultArray[i].price);
        itemRow.push(resultArray[i].stock_quantity);
        table.push(itemRow);
    }
    console.log(table.toString());
}

inquirer.prompt([
    {
        type: "list",
        message: "Select a Menu option: ",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
        name: "menu"
    },
]).then(function(inquirerRes){
    switch(inquirerRes.menu) {
        case 'View Products for Sale':
            connection.query("SELECT * FROM products", function(err, res){
                if (err) throw err;
                buildProductTable(res);
                connection.end();
            });
            break;
        case 'View Low Inventory':
            connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function(err, res){
                if (err) throw err;
                buildProductTable(res);
                connection.end();
            });
            break;
        case 'Add to Inventory':
            var productArray = [];
            var itemNamelist = [];
            connection.query("SELECT * FROM products", function(err, res) {
                if (err) throw err;
                productArray = res;
                for (var p = 0; p < res.length; p++ ) {
                    itemNamelist.push(productArray[p].product_name);
                }
                inquirer.prompt([
                    {
                        type: "list",
                        message: "Select an Item to update the quantity: ",
                        choices: itemNamelist,
                        name: "item"
                    },
                    {
                        type: "input",
                        message: "How many units of the product you would like to add?",
                        name: "quantity"
                    },
                ]).then(function(resp){
                    var quan = parseInt(resp.quantity);
                    var objMatch = productArray.find(obj => obj.product_name == resp.item);
                    var stockQuan = parseInt(objMatch.stock_quantity)
                    var newQuan = stockQuan + quan;
                    var respItem = resp.item;
                    connection.query(
                        "UPDATE products SET ? WHERE ?", 
                        [
                            {
                                stock_quantity: newQuan
                            },
                            {
                                product_name: respItem
                            }
                        ],
                        function(err, result) {
                            if(err) throw err;
                            if(result.affectedRows >= 1) {
                                console.log(`${respItem} has been updated. The total quantity is now ${newQuan}`)
                            } else{
                                console.log(`${respItem}'s quantity did not update successfully. Try again.`)
                            }
                            connection.end();
                        }
                    )
                });
            });
            break;
        case 'Add New Product':
            connection.query('SELECT department_name FROM departments', function(err, res) {
                if (err) throw err;
                console.log(res);
                var departmentList = []
                for (var i = 0; i < res.length; i++) {
                    departmentList.push(res[i].department_name);
                }
                inquirer.prompt([
                    {
                        type: "input",
                        message: "What is the name of the product you would like to add?",
                        name: "name"
                    },
                    {
                        type: "list",
                        message: "What is the department of the product you would like to add?",
                        choices: departmentList,
                        name: "department"
                    },
                    {
                        type: "input",
                        message: "What is the price of the product you would like to add?",
                        name: "price"
                    },
                    {
                        type: "input",
                        message: "What is the quantity of the product you would like to add?",
                        name: "quantity"
                    },
                ]).then(function(inquirerResp){
                    connection.query("INSERT INTO  products SET ?",
                        {
                            product_name: inquirerResp.name,
                            department_name: inquirerResp.department,
                            price: inquirerResp.price,
                            stock_quantity: inquirerResp.quantity
                        },
                        function(err, res) {
                            if (err) throw err;
                            if(res.affectedRows >= 1) {
                                console.log(`${inquirerResp.name} has been added!`)
                            } else{
                                console.log(`${inquirerResp.name} did not add to inventory successfully. Try again.`)
                            }
                            connection.end();
                        }
                    )
                });
            })
            
            break;
        default:
            console.log('You have encountered an error.')
            break;
    }
})