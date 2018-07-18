<?php

$data = [];
extract($_GET);

for($i = 0; $i < 12; $i++) {
	$data[] = ['id'=> $i, 'value'=> $query .'-' . mt_rand(10000,99999)];
}

$rets['data'] = $data;
$rets['error'] = 0;

//print_r($rets);
echo json_encode($rets);
