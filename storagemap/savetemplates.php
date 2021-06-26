 <?php 
$result = rawurldecode($_POST["templates"]); 

$productsFile = fopen("./templates.json", "w");
fwrite($productsFile, $result);
?>
