CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE productInfo(
	itemID INTEGER(50) AUTO_INCREMENT NOT NULL,
    productName VARCHAR(100) NOT NULL,
    departName VARCHAR(100) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    stockQuantity INTEGER(20) NOT NULL,
    PRIMARY KEY(itemID)
);

ALTER TABLE productInfo
CHANGE departName  departmentName VARCHAR(100);

INSERT INTO productInfo(productName, departmentName, price, stockQuantity)
VALUES	("Hop On Pop by Dr Suess", "Books", 4.49, 10),
				("Are You My Mother? by P D Eastman", "Books", 2.29, 20),
                ("The Very Hungry Caterpillar by Eric Carle", "Books", 8.09, 15),
                ("Titus's Troublesome Tooth by Linda Jennings", "Books" , 11.29, 16),
                ("Yukon Ho: Calvin and Hobbes by Bill Waterson", "Books", 4.49, 19),
                ("Scientific Progress Goes Boink: Calvin and Hobbes by Bill Waterson", "Books", 5.49, 10),
                ("Asterix the Gaul by Rene Goscinny and Albert Uderzo", "Books", 11.94, 8),
                ("Asterix and the Golden Sickle by Rene Goscinny and Albert Uderzo", "Books", 8.49, 9),
                ("Emperor of All Maladies by Siddhartha Mukherjee", "Books", 11.25, 20),
                ("The Name of the Rose by Umberto Eco", "Books", 11.86, 26);
 
DELETE FROM productInfo;

SELECT DISTINCT * FROM productInfo;