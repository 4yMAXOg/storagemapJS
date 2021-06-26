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
$users = ["sni" => "e69554604f977e8826cce1240bb9c5a1bbc1fe667edb4826abefb242bce6a36d"];
$salt = ["sni" => "Theih6eeuo5feiThxieQuoo5xuu8Eepilee0du1P"];

$user = $_POST['user'];
$password = hash("sha256", $_POST['password'] . $salt[$user]);

if(($password == $users[$user]) && isset($users[$user])) {
    $_SESSION['user'] = $user;
    header("Location: editor.php");
    exit();
} 
?>
