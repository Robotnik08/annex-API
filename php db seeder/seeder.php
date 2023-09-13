<?php
    $json = file_get_contents('test.json');
    $json = json_decode($json);

    $ids = [];
    for ($i = 0; $i < count($json->results); $i++) {
        array_push($ids, $json->results[$i]->id);
    }
    echo $ids;
?>
