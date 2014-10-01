<?php

$dsn = 'mysql:host=192.168.1.100:3306;dbname=usana';
$user = "usana_user";
$pass = "obscure";


try{
	$dbh = new PDO($dsn,$user, $pass);
} catch(PDOException $e){	
	$msg = $e->getMessage();
	$msg = str_replace("'", "\'", $msg);
	echo "{failure:true, msg:'Database connect error!!<br/>".$msg."'}";
	die();
}



//check to make sure the $_POST contains all the required data, and add them to the statement handle
if(isset($_POST['first_name'])){
	$first_name = $_POST['first_name'];
}
if(isset($_POST['last_name'])){
	$last_name = $_POST['last_name'];
}
if(isset($_POST['address_1'])){
	$address_1 = $_POST['address_1'];
}
if(isset($_POST['address_2'])){
	$address_2 = $_POST['address_2'];
}
else{
	$address_2 = null;
}
if(isset($_POST['city'])){
	$city = $_POST['city'];
}
if(isset($_POST['state'])){
	$state = $_POST['state'];
}
if(isset($_POST['zip'])){
	$zip = $_POST['zip'];
}
if(isset($_POST['phone'])){
	$phone = $_POST['phone'];
}
if(isset($_POST['start_date'])){
	$start_date = new DateTime($_POST['start_date']);
	$start_date = $start_date->format('Y-m-d');	
}


$sth = $dbh->query("select max(employee_id)+1 as nextEmpId from employee");
while($row = $sth->fetch()){
	$employee_id = $row['nextEmpId'];
	if($employee_id == null){
		$employee_id = 1;
	}
}


$sth = $dbh->prepare("insert into employee (employee_id, first_name, last_name, address_1, address_2, city, state, zip, phone, start_date) values (:employee_id, :first_name, :last_name, :address_1, :address_2, :city, :state, :zip, :phone, :start_date)");
$sth->bindParam(':employee_id', $employee_id);
$sth->bindParam(':first_name', $first_name);
$sth->bindParam(':last_name', $last_name);
$sth->bindParam(':address_1', $address_1);
$sth->bindParam(':address_2', $address_2);
$sth->bindParam(':city', $city);
$sth->bindParam(':state', $state);
$sth->bindParam(':zip', $zip);
$sth->bindParam(':phone', $phone);
$sth->bindParam(':start_date', $start_date);

if($sth->execute()){
	$rows_affected = $sth->rowCount();
	echo "{success:true, msg:'Employee $employee_id added'}";
}
else{	
	$msg = $sth->errorCode();
	$errMsg = $sth->errorInfo();
	$msg .= " -- ".($errMsg[2]);
	$msg = str_replace("'", "\'", $msg);
	echo "{failure:true, msg:'Database insert error!!<br/>".$msg."'}";
}
?>