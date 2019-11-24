var mysql = require(mysql);
var inquirer = require(inquirer);

var connection = mysql.createConnection({
    host:"localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    start();
});

function start() {
    inquirer
    .prompt({
        name:"seeItems",
        type:"list",
        message: "Would you like to buy one of our items?",
        choices: ["YES", "NO"]
    })

    .then(function(answer) {
        innerHeight(answer.seeItems === "YES") {
            displayItems();
        }
        else if(answer.seeItems === "NO") {
            
        }
        else{
        connection.end();
        }
    });
}

function displayItems() {
    console.log("Items up for sale");
  console.log("------------------");
  connection.query("SELECT * FROM products", function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + " | " + res[i].product_name + " | Unit Price: $" + res[i].price + " | Units Remaining: " + res[i].quantity);
      console.log("------------------");
    }
}