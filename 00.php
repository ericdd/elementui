<?php

sleep(1);

print_r($_POST);

if($_FILES) {
	echo 'files ----------------------------------------<br />';
	print_r($_FILES);
}




?>
