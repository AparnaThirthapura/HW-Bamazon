/*
BAMAZON Manager Interface

Menu Options
	View Products for Sale
		List all the items in the Database
	View Low Inventory
		List all the Items with stockQuantity less than 5
	Add To Inventory
		Display a prompt to add more items to the items currently in the list
	Add New Product
		Allow the Manager to add new product with name price and quantity
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
	
	console.log("BAMAZON MANAGER VIEW");
	console.log("+++++++++++++++++++++++++++");

	inquirer.prompt([
	{
		name:"choices",
		type:"list",
		message:"Welcome! What do you want to do?",
		choices:["View Products for Sale",
					"View Low Inventory",
					"Add To Inventory",
					"Add a new Product"]
	}
	]).then(function(answer){
		// console.log(answer.choices);
		switch(answer.choices){
			case "View Products for Sale":
				viewProductsForSale();
				break;
			case "View Low Inventory":
				viewLowInventory();
				break;
			case "Add To Inventory":
				addToInventory();
				break;
			case "Add a new Product":
				addNewProduct();
				break;
			default:
				viewProductsForSale();
		}

	});//end of inquirer
};//end of function start

var viewProductsForSale = function(){
	console.log("Inside viewProductsForSale function");

	connection.query("SELECT * FROM productInfo", function(err,res){
		// console.log(res);

		var table = new Table({
			head: ["ItemID", "ProductName", "Price", "Department Name", "QuantityAvailable"],
			colWidths: [10, 70, 10,20, 20]
		});

	for(var i=0; i<res.length; i++){
		var productArr = [res[i].itemID, res[i].productName, res[i].price, res[i].departmentName,res[i].stockQuantity];
		table.push(productArr);
	}
	console.log(table.toString());

	continueOrEnd();

	});//end of query

};//end of function

var viewLowInventory = function(){
	console.log("Inside viewLowInventory function");

	connection.query("SELECT * FROM productInfo", function(err,res){
		// console.log(res);

		var table = new Table({
			head: ["ItemID", "ProductName", "Price", "Department Name", "QuantityAvailable"],
			colWidths: [10, 70, 10,20, 20]
		});

	for(var i=0; i<res.length; i++){
		if(res[i].stockQuantity < 5){
			var productArr = [res[i].itemID, res[i].productName, res[i].price, res[i].departmentName, res[i].stockQuantity];
			table.push(productArr);
		}
	}
	console.log(table.toString());

	continueOrEnd();

	});//end of query
};//end of function


var addToInventory = function(){
	console.log("Inside addToInventory function");

	connection.query("SELECT * FROM productInfo", function(err,res){
		// console.log(res);

		var table = new Table({
			head: ["ItemID", "ProductName", "Price", "Department Name", "QuantityAvailable"],
			colWidths: [10, 70, 10,20, 20]
		});

		for(var i=0; i<res.length; i++){
			var productArr = [res[i].itemID, res[i].productName, res[i].price, res[i].departmentName,res[i].stockQuantity];
			table.push(productArr);
		}
		console.log(table.toString());

	

		inquirer.prompt([
		{
			name:"Item",
			type:"input",
			message:"Enter the ItemID of the product that you want to update",
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
			message:"Enter the quantity of the product that you want to update",
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

			var item = answer.Item;
			var quantity = answer.Quantity;

			console.log("You entered to update by " + quantity + " of the items of the product with ID " + item + "\n");

			connection.query("SELECT * FROM productInfo WHERE itemID = ?",[item], function(err,res){

				if (res.length === 0) {
					console.log("Item ID does not exist.");
					start();
				} 
				else{
					var updatedQuantity = parseInt(res[0].stockQuantity) + parseInt(quantity);
					connection.query("UPDATE productInfo SET stockQuantity = ? WHERE itemID = ?", [updatedQuantity,item], function(err, res){
						if(err)
							throw(err);
						else{
							console.log("New Inventory Successful");

							console.log("The New Table is ");
								connection.query("SELECT * FROM productInfo", function(err,res){
								// console.log(res);

								var table = new Table({
									head: ["ItemID", "ProductName", "Price", "Department Name", "QuantityAvailable"],
									colWidths: [10, 70, 10,20, 20]
								});

								for(var i=0; i<res.length; i++){
									var productArr = [res[i].itemID, res[i].productName, res[i].price, res[i].departmentName,res[i].stockQuantity];
									table.push(productArr);
								}
								console.log(table.toString());
								continueOrEnd();
								});//end of query
						}//end else
					});//end query
				}//end else
			});//end query
		});//end inquirer
	});//end of query		
};


var addNewProduct = function(){
	console.log("Inside addNewProduct function");

	connection.query("SELECT * FROM productInfo", function(err,res){
		// console.log(res);

		var table = new Table({
			head: ["ItemID", "ProductName", "Price", "Department Name", "QuantityAvailable"],
			colWidths: [10, 70, 10,20, 20]
		});

		for(var i=0; i<res.length; i++){
			var productArr = [res[i].itemID, res[i].productName, res[i].price, res[i].departmentName,res[i].stockQuantity];
			table.push(productArr);
		}
		console.log(table.toString());

		console.log("Add new products");

		inquirer.prompt([
		{
			name:"ProductName",
			type:"input",
			message:"Enter the Product Name that you want to add",
			validate:function(value){
					if(value !== "")
						return true;
					else{
						console.log("\n Please enter Product Name");
						return false;
					}
				}

		},
		{
			name:"Price",
			type:"input",
			message:"Enter the Price for the Product",
			validate:function(value){
					if(isNaN(value) === false)
						return true;
					else{
						console.log("\n Please enter Price");
						return false;
					}
				}

		},
		{
			name:"DepartmentName",
			type:"input",
			message:"Enter the Department Name of the Product",
			validate:function(value){
					if(value !== "")
						return true;
					else{
						console.log("\n Please enter Department Name");
						return false;
					}
				}

		},
		{
			name:"Quantity",
			type:"input",
			message:"Enter the quantity of the Product",
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

			var productName = answer.ProductName;
			var price = answer.Price;
			var departmentName = answer.DepartmentName;
			var quantity = answer.Quantity;

			connection.query("INSERT INTO productInfo(productName, departmentName, price, stockQuantity) VALUES(?, ?, ?, ?) ",[productName, departmentName, price, quantity], function(err,res){

				if(err)
					throw(err);

				console.log("New Product Successfully Added");

				console.log("The New Table is ");
				connection.query("SELECT * FROM productInfo", function(err,res){
								// console.log(res);

					var table = new Table({
						head: ["ItemID", "ProductName", "Price", "Department Name", "QuantityAvailable"],
						colWidths: [10, 70, 10,20, 20]
					});

					for(var i=0; i<res.length; i++){
						var productArr = [res[i].itemID, res[i].productName, res[i].price, res[i].departmentName,res[i].stockQuantity];
						table.push(productArr);
					}
								
					console.log(table.toString());
					continueOrEnd();
				});//end of query		
			});//end query	
		});//end inquirer
	});//end of query		
};

var continueOrEnd = function(){
	inquirer.prompt({
		name:"continue",
		type:"list",
		message:"Do you want to continue?",
		choices:["yes", "no"]
	}).then(function(answer){
		console.log(answer);
		if(answer.continue === "yes")
			start();
		else{
			console.log("Have a Good Day!!");
			connection.end();
		}
	});	
};

