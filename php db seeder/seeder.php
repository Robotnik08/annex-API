<?php
    //these are the most recent movies from the api as of 2023-09-13
    $ids = [
        615656,
        346698,
        968051,
        912908,
        976573,
        678512,
        614930,
        667538,
        635910,
        979275,
        447277,
        1008042,
        884605,
        872585,
        502356,
        1030987,
        926393,
        532408,
        980489,
        1094713
    ];


    // connect to sql database
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "annex-bios";
    
    //pdo
    try {
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    catch(PDOException $e) {
        echo "Connection failed: " . $e->getMessage();
    }
    // seedDataBase($ids, $conn);
    function seedDataBase ($ids, $conn) {
        for ($day = 0; $day < 366; $day++) {
            $today = date("Y-m-d", strtotime("+$day days"));
            $theatres = ["Leerdam", "Maarsen", "Breukelen", "Bilthoven", "Leidscherijn"];
            $timeofday = ["12:00:00", "15:00:00", "18:00:00", "21:00:00"];
            foreach ($timeofday as $time) {
                foreach ($theatres as $theatre) {
                    for ($s = 0; $s < 5; $s++) {
                        if (rand(0, 3) == 0) continue;
                        $movie_id = $ids[rand(0, count($ids) - 1)];
                        $is3d = rand(0, 1);
                        $screen = $s;
                        $sql = "INSERT INTO showing (movie_id, time, 3d, screen, theatre) VALUES ('$movie_id', '$today $time', '$is3d', '$screen', '$theatre')";
                        $conn->exec($sql);
                    }
                }
            }
        }
    }

    function clearDataBase ($ids, $conn) {
        $sql = "DELETE FROM showing";
        $conn->exec($sql);
    }
?>
