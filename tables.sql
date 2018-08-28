drop table if exists towns,registrations;

create table towns
(
	id serial not null primary key,
	town_name varchar(50) not null,
	starts_with varchar(10) not null
);

create table registrations
(
	id serial not null primary key,
	reg_number varchar(20) not null,
	town_id int not null,
	foreign key (town_id) references towns(id)
);
