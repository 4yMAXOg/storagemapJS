 <?php 
$result = rawurldecode($_POST["products"]); 

$productsFile = fopen("./products.json", "w");
fwrite($productsFile, $result);
?>
