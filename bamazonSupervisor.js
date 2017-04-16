/*
BAMAZON Supervisor Interface

Menu Options
	View Products Sale by Department
		List all the items in the Database

	Add New Department
		Allow the Supervisor to add new department
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
	
	console.log("BAMAZON SUPERVISOR VIEW");
	console.log("+++++++++++++++++++++++++++");

	inquirer.prompt([
	{
		name:"choices",
		type:"list",
		message:"Welcome! What do you want to do?",
		choices:["View Products Sale",
					"Add new Department"]
	}
	]).then(function(answer){
		// console.log(answer.choices);
		switch(answer.choices){
			case "View Products Sale":
				viewProductsSale();
				break;
			case "Add new Department":
				addDepartment();
				break;
			default:
				viewProductsSale();
		}

	});//end of inquirer
};//end of function start

var viewProductsSale = function(){
	// console.log("Inside viewProductsSale function");

	connection.query("SELECT * FROM departmentInfo", function(err,res){
		// console.log(res);

		var table = new Table({
			head: ["DepartmentID", "DepartmentName", "OverHeadCost", "TotalSales", "TotalProfit"],
			colWidths: [20, 40, 20, 20, 20]
		});

	for(var i=0; i<res.length; i++){
		var totalProfit = Math.round(res[i].totalSales-res[i].overHeadCost);
		var departmentArr = [res[i].departmentID, res[i].departmentName, res[i].overHeadCost, res[i].totalSales, totalProfit ];

		table.push(departmentArr);

	}
	console.log(table.toString());

	continueOrEnd();

	});//end of query

};//end of function


var addDepartment = function(){
	// console.log("Inside addDepartment function");

	connection.query("SELECT * FROM departmentInfo", function(err,res){
		// console.log(res);

		var table = new Table({
			head: ["DepartmentID", "DepartmentName", "OverHeadCost", "TotalSales"],
			colWidths: [20, 50, 20, 20]
		});

		for(var i=0; i<res.length; i++){
			var departmentArr = [res[i].departmentID, res[i].departmentName, res[i].overHeadCost, res[i].totalSales];
			table.push(departmentArr);
		}
		console.log(table.toString());

		console.log("Add new Department");

		inquirer.prompt([
		{
			name:"DepartmentName",
			type:"input",
			message:"Enter the Department Name that you want to add",
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
			name:"OverHeadCost",
			type:"input",
			message:"Enter the Over Head Cost for that Department",
			validate:function(value){
					if(isNaN(value) === false)
						return true;
					else{
						console.log("\n Please enter the Over Head Cost");
						return false;
					}
				}

		}
		]).then(function(answer){

			var departmentName = answer.DepartmentName;
			var overHeadCost = answer.OverHeadCost;
			
			connection.query("INSERT INTO departmentInfo(departmentName, overHeadCost, totalSales) VALUES(?, ?, ?) ",[departmentName, overHeadCost, 0.00], function(err,res){

				if(err)
					throw(err);

				console.log("New Department Successfully Added");

				console.log("The New Table is ");
				connection.query("SELECT * FROM departmentInfo", function(err,res){
								// console.log(res);

					var table = new Table({
						head: ["DepartmentID", "DepartmentName", "OverHeadCost", "TotalSales"],
						colWidths: [20, 50, 20, 20]
					});

					for(var i=0; i<res.length; i++){

						var departmentArr = [res[i].departmentID, res[i].departmentName, res[i].overHeadCost, res[i].totalSales];
						table.push(departmentArr);
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
		// console.log(answer);
		if(answer.continue === "yes")
			start();
		else{
			console.log("Have a Good Day!!");
			connection.end();
		}
	});	
};

