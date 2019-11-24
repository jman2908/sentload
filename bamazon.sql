drop database if exists bamazon_db;
create database bamazon_db;
use bamazon_db;

create table products (
item_id integer not null auto_increment,
product_name varchar (70) not null,
department_name varchar (70) not null,
price decimal (10,2) not null,
stock_quantity integer not null,
primary key (item_id)
);

insert into products (product_name, department_name, price, stock_quantity)
values ("iphone", "electronics", 700.00, 10),
	   ("laptop", "electronics", 1000.00, 5),
       ("shirts", "clothing", 30.00, 20),
       ("pants", "clothing", 50.00, 30),
       ("ipad", "electronics", 900.00, 10),
       ("shoes", "clothing", 100.00, 25),
       ("sofa", "furniture", 500.00, 5),
       ("socks", "clothing", 10.00, 40),
       ("love seat", "furtniture", 600.00, 12),
       ("table", "furniture", 100.00, 30);