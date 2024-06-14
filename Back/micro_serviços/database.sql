drop database if exists db_a3;
create database db_a3;

use db_a3;

create table users(
    cpf varchar(11) primary key not null,
    name varchar(200) not null,
    birth varchar(10) not null,
    email varchar(200) not null,
    tags varchar(1500) not null,
    nickname varchar(100) not null,
    password varchar(300) not null,
    gender varchar(100) not null
);