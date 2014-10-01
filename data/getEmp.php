<?php
$dsn = 'mysql:host=192.168.1.100:3306;dbname=usana';
$user = "usana_user";
$pass = "obscure";
$arr = array();

try{
	$dbh = new PDO($dsn,$user, $pass);
} catch(PDOException $e){	
	$msg = $e->getMessage();
	$msg = str_replace("'", "\'", $msg);
	echo "{failure:true, msg:'Database connect error!!<br/>".$msg."'}";
	die();
}

if(isset($_GET['filter'])){
	$filter = json_decode($_GET['filter'],true);
	$whereCol = $filter[0]['property'];
	$whereVal = $filter[0]['value'];
	
	if($whereCol == 'All'){
		$whereStmt = "where first_name like concat('%',:whereVal,'%') or last_name like concat('%',:whereVal,'%') or start_date like concat('%',:whereVal,'%') or employee_id like concat('%',:whereVal,'%')";
	}
	elseif($whereCol != 'employee_id'){
		$whereStmt = "where ".$whereCol." like concat('%',:whereVal,'%')";
		//$whereStmt = "where ".$whereCol." like '%$whereVal%'";
	}
	else{
		$whereStmt = "where employee_id = :whereVal";
	}
	
	$sth=$dbh->prepare("select employee_id, first_name, last_name, address_1, address_2, city, state, zip, phone, date_format(start_date,'%m/%d/%Y') as start_date from employee ".$whereStmt);
	$sth->bindParam(':whereVal', $whereVal);
	
	if($sth->execute()){
		//var_dump($sth);
	}
	else{
		$msg = $sth->errorCode();
		$errMsg = $sth->errorInfo();
		$msg .= " -- ".($errMsg[2]);
		$msg = str_replace("'", "\'", $msg);
		echo "{success:false, msg:'Database error!!<br/>".$msg."'}";
		die();
	}
}
else{
	$sth=$dbh->query("select employee_id, first_name, last_name, address_1, address_2, city, state, zip, phone, date_format(start_date,'%m/%d/%Y') as start_date from employee");
}


$sth->setFetchMode(PDO::FETCH_ASSOC);

$arr['success'] = true;
$arr['msg'] = 'loaded data';
while($row = $sth->fetch()){
	$arr['data'][] = $row;
}
$json = json_encode($arr, JSON_NUMERIC_CHECK);
echo $json;

?>