# 实验室管理平台

主要功能：
主要功能： 登录：用户可以登录系统。
用户管理：包括用户列表的查看和管理。
权限管理：可以查看角色列表和权限列表，进行权限控制。
实验室管理：包括实验室列表的查看和添加新实验室的功能。
预约管理：包括审核列表、预约列表和预约实验室的功能。
更新地图：可能是指更新实验室位置或布局的地图功能。

# 数据表

## 预约表

create table books
(
id int auto_increment
primary key,
lab_id int default 0 null,
book_time date null,
book_class int default 0 null,
book_reason varchar(100) not null,
book_username varchar(20) not null,
book_state int default 0 null
)

## 实验室表

create table labs
(
id int auto_increment
primary key,
title varchar(20) not null,
capacity int default 0 null,
lab_type int default 0 null,
college_type int default 0 null,
x int default 0 null,
y int default 0 null
)

## 权限列表

create table rights
(
id int auto_increment
primary key,
title varchar(20) not null,
path varchar(100) not null,
icon varchar(100) not null,
parent_id int default 0 null,
is_leaf tinyint default 0 null
)

## 角色表

create table roles
(
id int auto_increment
primary key,
roleName varchar(20) not null,
roleType int default 2 null,
rights json not null
)

## 用户表

create table users
(
id int auto_increment
primary key,
username varchar(20) not null,
password varchar(20) not null,
roleId int not null,
is_default int default 0 null,
constraint users_ibfk_1
foreign key (roleId) references roles (id)
)

## 实验室类型表

-- 创建 LabType 表
-- 该表用于存储实验室类型的信息
CREATE TABLE LabType (
id INT AUTO_INCREMENT PRIMARY KEY, -- 实验室类型的唯一标识
name VARCHAR(255) NOT NULL, -- 实验室类型名称
description VARCHAR(255) -- 类型描述
);

## 学院表

-- 创建 Colleges 表
-- 该表用于存储学院的信息
CREATE TABLE Colleges (
id INT AUTO_INCREMENT PRIMARY KEY, -- 学院的唯一标识
name VARCHAR(255) UNIQUE NOT NULL, -- 学院名称
lab_counts INT NOT NULL -- 学院下的实验室数量
);

## 课节表

-- 创建 Classes 表
-- 该表用于存储课程的信息
CREATE TABLE Classes (
id INT AUTO_INCREMENT PRIMARY KEY, -- 课程的唯一标识
name VARCHAR(255) NOT NULL, -- 课程名称
start_time TIME NOT NULL, -- 课程开始时间
end_time TIME NOT NULL -- 课程结束时间
);
