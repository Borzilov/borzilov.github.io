<?php

$frm_name  = "YOURNAME";
$recepient = "mail@test.mail";
$sitename  = "AXIT";
$subject   = "New enquiry from site \"$sitename\"";

$name = trim($_POST["name"]);
$email = trim($_POST["email"]);
$message = trim($_POST["message"]);
$subject = trim($_POST["subject"]);
$password = trim($_POST["password"]);

$message = "
E-mail: $email <br>
Name: $name <br>
Password: $password <br>
Subject: $subject <br>
Message: $message
";
 
$headers  = "Content-type: text/html; charset=utf-8 \r\n";
$headers .= "From: <$name> <$email>\r\n"; 

mail($recepient, $subject, $message, $headers); 
?>