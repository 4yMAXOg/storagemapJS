<canvas id="canvas_id" ></canvas>
<div id="products">
<?php
	$file_str = file_get_contents("./products.json");
	echo $file_str;
?>
</div>
<div id="templates">
<?php
	$file_str = file_get_contents("./templates.json");
	echo $file_str;
?>
</div>

