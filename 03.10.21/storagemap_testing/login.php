<?php
    ob_start();
    session_start();
?>

<h2>Login</h2>
    <form method="post">
    <input type="text" name="user">
    <input type="password" name="password">
    <input type="submit">
</form>

<?php
$users = ["sni" => "38440e18f1b0f854a4e187d6267d8dea3809f51f8eca9b3ae6e520dee6962191"];
$salt = ["sni" => "Theih6eeuo5feiThxieQuoo5xuu8Eepilee0du1P"];

$user = $_POST['user'];
$password = hash("sha256", $_POST['password'] . $salt[$user]);

if(($password == $users[$user]) && isset($users[$user])) {
    $_SESSION['user'] = $user;
    header("Location: editor.php");
    exit();
} 
?>
