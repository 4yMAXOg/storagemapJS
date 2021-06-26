<html>
	<head>
        <?php require("maphead.php"); ?>
		<?php require("mainhead.php"); ?>
		<style>
			#canvas_id {
				/* border: solid; */
				width: 100%;
				height: 99%;
                /* Rotate */
                transform: rotate(90deg) translate(40%, 0) scale(1, 2);
			}
			body {
				margin: 0;
			}
		</style>
		<script src="storage.js?random=<?php echo uniqid(); ?>"></script>
	</head>
	
	<body>
		<?php require("mainbody.php"); ?>
	</body>
</html>
