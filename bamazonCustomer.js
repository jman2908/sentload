var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
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
  console.log(`
    ____  ___    __  ______ _____   ____  _   __
   / __ )/   |  /  |/  /   /__  /  / __ \/ | / /
  / __  / /| | / /|_/ / /| | / /  / / / /  |/ /
 / /_/ / ___ |/ /  / / ___ |/ /__/ /_/ / /|  /
/_____/_/  |_/_/  /_/_/  |_/____/\____/_/ |_/
`);
  console.log("Items up for sale");
  console.log("------------------");
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) {
      console.error("error connecting: " + err.stack);
    }
    loadProducts();
  });
  

  function loadProducts() {
 
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;
      console.table(res);

      promptCustomerForItem(res);
    });
  }
  

  function promptCustomerForItem(inventory) {
   
    inquirer
      .prompt([
        {
          type: "input",
          name: "choice",
          message: "What is the ID of the item you would you like to purchase? [Quit with Q]",
          validate: function(val) {
            return !isNaN(val) || val.toLowerCase() === "q";
          }
        }
      ])
      .then(function(val) {
       
        checkIfShouldExit(val.choice);
        var choiceId = parseInt(val.choice);
        var product = checkInventory(choiceId, inventory);
  
       
        if (product) {
         
          promptCustomerForQuantity(product);
        }
        else {
          // Otherwise let them know the item is not in the inventory, re-run loadProducts
          console.log("\nThat item is not in the inventory.");
          loadProducts();
        }
      });
  }
  
  // Prompt the customer for a product quantity
  function promptCustomerForQuantity(product) {
    inquirer
      .prompt([
        {
          type: "input",
          name: "quantity",
          message: "How many would you like? [Quit with Q]",
          validate: function(val) {
            return val > 0 || val.toLowerCase() === "q";
          }
        }
      ])
      .then(function(val) {
        // Check if the user wants to quit the program
        checkIfShouldExit(val.quantity);
        var quantity = parseInt(val.quantity);
  
        // If there isn't enough of the chosen product and quantity, let the user know and re-run loadProducts
        if (quantity > product.stock_quantity) {
          console.log("\nInsufficient quantity!");
          loadProducts();
        }
        else {
          // Otherwise run makePurchase, give it the product information and desired quantity to purchase
          makePurchase(product, quantity);
        }
      });
  }
  
  // Purchase the desired quantity of the desired item
  function makePurchase(product, quantity) {
    connection.query(
      "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
      [quantity, product.item_id],
      function(err, res) {
        // Let the user know the purchase was successful, re-run loadProducts
        console.log("\nSuccessfully purchased " + quantity + " " + product.product_name + "'s!");
        loadProducts();
      }
    );
  }
  
  // Check to see if the product the user chose exists in the inventory
  function checkInventory(choiceId, inventory) {
    for (var i = 0; i < inventory.length; i++) {
      if (inventory[i].item_id === choiceId) {
        // If a matching product is found, return the product
        return inventory[i];
      }
    }
    // Otherwise return null
    return null;
  }
  
  // Check to see if the user wants to quit the program
  function checkIfShouldExit(choice) {
    if (choice.toLowerCase() === "q") {
      // Log a message and exit the current node process
      console.log("Goodbye!");
      process.exit(0);
    }
  }
};