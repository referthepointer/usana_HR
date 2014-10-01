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

$request_body = file_get_contents('php://input');
$payload = json_decode($request_body, true);
$data = $payload['data'];

$employee_id = -1;
$query = "update employee set";
$len = count($data);
$i=0;
foreach($data as $key => $value){
	if($i == 0){
		$query .= " $key = :$key";
	}
	elseif($i == $len-1){
		$query .= " where employee_id = :$key";
	}
	else{
		$query .= ", $key = :$key";
	}
	$i++;
}


$sth = $dbh->prepare($query);
if($sth->execute($data)){
	echo "{success:true, msg:'updated ".$data['employee_id'].".'}";
}
else{
	$msg = $sth->errorCode();
	$errMsg = $sth->errorInfo();
	$msg .= " -- ".($errMsg[2]);
	$msg = str_replace("'", "\'", $msg);
	echo "{success:false, msg:'Database insert error!!<br/>".$msg."'}";
}
?>