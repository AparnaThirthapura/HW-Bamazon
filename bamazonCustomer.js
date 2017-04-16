/* 
BAMAZON Customer Interface

First Display a message "Welcome to BAMAZON"
and display the products available in a table format
Prompt users with 2 messages
	ask the id of the product they want to buy
	how many units they want to buy
Get both and store them
check if there is enough in the stock
	if not throw an insufficient message andb return 
	else 
	update update the sql and show the customer thier total cost 
*/

var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
	host:"localhost",
	port:3306,
	user:"root",
	password:"",
	database:"bamazonDB"
});

connection.connect(function(err){
	if(err)
		throw(err);
	else{
		// console.log("connected as id" + connection.threadId + "\n");
		console.log("+++++++++++++++++++++++++++");
		console.log("WELCOME TO BAMAZON");
		console.log("+++++++++++++++++++++++++++");	
		start();	
	}
});

var start = function(){
	
	console.log("BAMAZON products available");
	console.log("+++++++++++++++++++++++++++");


	connection.query("SELECT * FROM productInfo", function(err,res){
		// console.log(res);

		var table = new Table({
			head: ["ItemID", "ProductName", "Price", "QuantityAvailable"],
			colWidths: [10, 70, 10, 20]
		});

	for(var i=0; i<res.length; i++){
		var productArr = [res[i].itemID, res[i].productName, res[i].price, res[i].stockQuantity];
		table.push(productArr);
	}
	console.log(table.toString());
	buyItems();
	});
};

var buyItems = function(){
	console.log("+++++++++++++++++++++++++++");
	console.log("Select the Items and Quanity that you want to buy?");
	console.log("+++++++++++++++++++++++++++");

	// console.log(productArr);

	inquirer.prompt([
		{
			name:"Item",
			type:"input",
			message:"Choose the Product by ItemID",
			validate:function(value){
				if(isNaN(value) === false)
					return true;
				else{
					console.log("\n Please enter the ItemID");
					return false;
				}
			}
		},
		{
			name:"Quantity",
			type:"input",
			message:"Choose the Quantity that you want to buy",
			validate:function(value){

				if(isNaN(value) === false)
					return true;
				else{
					console.log("\n Please enter a valid quantity");
					return false;
				}
			}
		}

	]).then(function(answer){
		// console.log(answer);

		var item = answer.Item;
		var quantity = answer.Quantity;

		// console.log(item);
		// console.log(quantity);

		console.log("You entered to buy " + quantity + " items of the product with ID " + item + "\n");

		connection.query("SELECT * FROM productInfo WHERE itemID = ?",[item], function(err,res){

				if (res.length === 0) {
					console.log("Item ID does not exist.");
					start();
				} 
				else {
					if(res[0].stockQuantity === 0){
						console.log("Not in stock");
						start();
					}
					else if(res[0].stockQuantity < quantity){
						console.log("Insufficient Quantity");
						console.log("Enter a different quantity or a different item");
						start();
					}
					else{
						var newQuantity = res[0].stockQuantity - quantity;
						var salePrice = res[0].price * quantity;
						var newProductSales = res[0].productSales + salePrice;

						console.log("+++++++++++++++++++++++++++");
						console.log("Transaction Successful");
						console.log("You bought " + res[0].productName);
						console.log("Your total price is: $" + salePrice);
						console.log("+++++++++++++++++++++++++++");

						connection.query("UPDATE productInfo SET stockQuantity = ?,productSales = ? WHERE itemID = ?", [newQuantity,newProductSales,item], function(err, res){
						});

						//
						var departmentName = res[0].departmentName;
						connection.query("SELECT * FROM departmentInfo WHERE departmentName = ?",[departmentName], function(err1,res1){
							var totalSales = res1[0].totalSales;
							var newTotalSales = totalSales + salePrice;

							connection.query("UPDATE departmentInfo SET totalSales = ? WHERE departmentName = ?", [newTotalSales,departmentName], function(err, res){
							});


						});
						//

						continueOrEnd();
					}//end inner else
				}//end else	
		});//select connection.query() end
	});//inquirer end
};//function buyItems() end

var continueOrEnd = function(){
	inquirer.prompt({
		name:"continue",
		type:"list",
		message:"Do you want to continue shopping?",
		choices:["yes", "no"]
	}).then(function(answer){
		// console.log(answer);
		if(answer.continue === "yes")
			start();
		else{
			console.log("Thank You for Shopping. Have a Good Day");
			connection.end();
		}
	});	
}


 
