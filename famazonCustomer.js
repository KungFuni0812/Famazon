//login protected
require("dotenv").config();

var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require('cli-table');

var table = new Table({
    head: ['ID', 'Product Name', 'Price'], colWidths: [10, 30, 10] 
});


var connection = mysql.createConnection({
    host: process.env.host,
    port: process.env.port,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});

var productArray = []

connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log(res);
    productArray = res;
    for (var i = 0; i < res.length; i++) {
        var itemRow = []
        itemRow.push(res[i].id);
        itemRow.push(res[i].product_name);
        itemRow.push(res[i].price);
        table.push(itemRow);
    }
    console.log(table.toString());
    inquirer.prompt([
        {
            type: "input",
            message: "What is the ID of the product you would like to buy?",
            name: "id"
        },
        {
        type: "input",
            message: "How many units of the product you would like to buy?",
            name: "quantity"
        },
    ]).then(function(inquirerResponse){
        var quan = parseInt(inquirerResponse.quantity);
        var objMatch = productArray.find(obj => obj.id == inquirerResponse.id);
        var stockQuan = parseInt(objMatch.stock_quantity);
        var prodPrice = parseFloat(objMatch.price);
        var prodSales = parseFloat(objMatch.product_sales);
        if(stockQuan >= quan) {
            var newSales = (prodPrice * quan) + prodSales
            var newQuan = stockQuan - quan;
            connection.query(
                "UPDATE products SET ? WHERE ?", 
                [
                    {
                        stock_quantity: newQuan,
                        product_sales: newSales
                    },
                    {
                        id: inquirerResponse.id
                    }
                ],
                function(err, result) {
                    if(err) throw err;
                    connection.end();
                }
            )
        }else {
            console.log("Insufficient Stock Quantity!")
            connection.end();
        }
        
    });
    
});
    




