<html>
	<head>
        <? require("maphead.php"); ?> 
		<style>
			#canvas_id {
				/* border: solid; */
				width: 1240px;
				height: 720px;
			}
			body {
				margin: 0;
			}
		</style>
		<?php require("mainhead.php"); ?>
		<script src="mobile.js?random=<?php echo uniqid(); ?>"></script>
	</head>
	
	<body>
		<?php require("mainbody.php"); ?>
	</body>
</html>
