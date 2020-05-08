<?php

$servername = "localhost";
$username = "webwx";
$password = "wm17fdc";
$conn = new mysqli($servername, $username, $password);
$conn->set_charset('utf8');
if ($conn->connect_error) {
    die("数据库连接失败: " . $conn->connect_error);
}
$type = $_POST['type'];
$sql="SELECT con  FROM webwx.jqr where type=? ORDER BY RAND() LIMIT 1";
$stmt = $conn->prepare($sql);        
$stmt->bind_param('s',$type);
$stmt->execute();

$result = $stmt->get_result();
while($row = $result->fetch_assoc()) {
	$con=$row["con"];
}

echo $con;
	


?>
