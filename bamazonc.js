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
    if (err) {
      return console.log(err);
    }
    queryBamazon();
  });
  
  function queryBamazon() {
    console.log("B A M A Z O N");
    console.log("Items for sale");
    console.log("------------------");
    connection.query("SELECT * FROM products", function(err, res) {
      for (var i = 0; i < res.length; i++) {
        console.log("Item # " + res[i].item_id);
        console.log("Product: " +res[i].product_name);
        console.log("Price: $" + res[i].price);
        console.log("Stock Quantity: " + res[i].stock_quantity);
        console.log("------------------");
      }
      mainMenu();
    });
  }
  var mainMenu = function() {
    inquirer.prompt([
      {
        type: "list",
        message: "Please select:",
        choices: ["Buy an Item", "Exit"],
        name: "choice"
      }
    ]).then(function(res) {
      switch (res.choice) {
        case ("Exit"):
          connection.end();
          return;
        case ("Buy an Item"):
          buyItem();
          break;
      }
    });
  };