const mysql = require("mysql");
const inquirer = require("inquirer");
// const cTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "1Russian",
    database: "bamazon"
});

connection.connect(err => {
    console.log('connected as id: ' + connection.threadId);
    if (err) throw err;
    runSearch();
});

function runSearch() {
    connection.query("SELECT * FROM products", (err, response) => {
        if (err) throw err;
        console.table(response);
        inquirer.prompt([
            {
                type: "input",
                name: "id",
                message: "Which ID of the product would you like to buy?"
            },
            {
                type: "input",
                name: "quantity",
                message: "How many units of the product they would like to buy?"
            }
        ]).then(answer => {
            console.log("answer: ", answer.id);
            // const foundObj;
            let newQuant;
            let chosenId;
            for (let i = 0; i < response.length; i++) {
                if (answer.id == response[i].id) {
                    chosenId = response[i].id;
                    const stock = response[i].stock_quantity;
                    // console.log(foundObj)
                    
                    // if product id matches then deduct the user's quantity 
                    console.log("stock_quantity", stock)
                    newQuant = stock - answer.quantity
                    console.log("newQuant: ", newQuant);
                }
            }
            //UPDATE Customers
            //SET ContactName='Alfred Schmidt', City='Frankfurt'
            //WHERE CustomerID=1
            connection.query("UPDATE products SET ? WHERE ?",
            [
              {
                stock_quantity: newQuant
              },
              {
                id: chosenId
              }
            ],
            function(error) {
              if (error) throw err;
              console.log("Items purchased successfully!");
            //   start();
            })
            runSearch();
        });
    });
}

function confirm() {
    inquirer.prompt(
        {
            type: "confirm",
            name: "confirmation",
            message: "Would you like to continue?"
        }
    )
    connection.end();
}
