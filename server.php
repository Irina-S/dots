<?php
    //отправка заголовков клиенту
    function sendHeaders($headersText, $newSocket, $host, $port){
        $headers = array();
        $tmpline = preg_split("/\r\n/", $headersText);
        foreach ($tmpline as $line){
            $line = rtrim($line);
            // $matches = array();
            if (preg_match("/\A(\S+): (.*)\z/", $line, $matches)){
                $headers[$matches[1]] = $matches[2];
            }
        }

        $key = $headers['Sec-WebSocket-Key'];
        $sKey = base64_encode(pack('H*', sha1($key.'258EAFA5-E914-47DA-95CA-C5AB0DC85B11')));
        $strHeader = "HTTP/1.1 101 Switching Protocols \r\n".
        "Upgrade: websocket\r\n".
        "Connection: Upgrade\r\n".
        "WebSocket-Origin: $host\r\n".
        "WebSocket-Location: ws://$host:$port/chat/server.php\r\n".
        "Sec-WebSocket-Accept:$sKey\r\n\r\n";

        socket_write($newSocket, $strHeader, strlen($strHeader));
    }

    //формирует данные, которуе будут переданны в клиентскую часть
    function seal($socketData){
        $b1 = 0x81;
        $length = strlen($socketData);
        $header = "";
        //значение 2 байта зависит от длинны данных
        if ($length <= 125){
            $header = pack('CC', $b1, $length);
        } 
        else if (($length > 125) && ($length < 65536)){
            $header = pack('CCn', $b1, 126, $length);
        }
        else if ($length >= 65536){
            $header = pack('NN', $b1, 127, $length);
        }
        return $header.$socketData;
    }

    //разбирает пришедшие данные
    function unseal($socketData){
        $length = ord($socketData[1]) & 127;
        //расположение маски и данных зависит от длинны данных и значения 2 байта
        if ($length == 126){
            $mask = substr($socketData, 4, 4);
            $data = substr($socketData, 8);
        }
        else if ($length == 127){
            $mask = substr($socketData, 10, 4);
            $data = substr($socketData, 14);
        }
        else{
            $mask = substr($socketData, 2, 4);
            $data = substr($socketData, 6);
            
        }
        $socketStr = "";
        //декодирование:применение маски к данным
        for ($i = 0; $i<strlen($data); ++$i){
            $socketStr.= $data[$i]^$mask[$i%4];
        }
        //echo "Новое сообщение:".$socketStr;
        return $socketStr;
    }

    // отправка данных клиенту
    function send($message, $clientSocket){
        $messageLength = strlen($message);
        @socket_write($clientSocket, $message, $messageLength);
        return true;
    }

    // поиск ппары по никнейму
    function findPairByUser($gamePairs, $username){
        foreach ($gamePairs as $gamePair){
            if (in_array($username, $gamePair))
                return $gamePair;
        }
        return false;
    }

    function findPairBySocket($gamePairs, $socket){
        foreach ($gamePairs as $gamePair){
            if (in_array($socket, $gamePair))
                return $gamePair;
        }
        return false;
    }

    function prepareMsg($type, $data){
        $message = array(
            "type"=>$type,
            "data"=>$data
        );
        return json_encode($message);
    }

    define("PORT", "8090");

    define("REQUEST_FOR_GAME", 0);
    define("NEW_MOVE", 1);
    define("COLOR_ASSIGN", 2);
    define("ENEMY_ASSIGN", 3);
    define("ENEMY_MOVE", 4);
    define("MARKER_SET", 5);
    define("ENEMY_GONE", 6);

    $socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
    socket_set_option($socket,  SOL_SOCKET, SO_REUSEADDR, 0);

    socket_bind($socket, 0, PORT);

    socket_listen($socket);

    //массив клиентских сокетов
    $clientSocketArray = array($socket);

    // массив пар игроков
    $gamePairs = [];

    while (true){
        $newSocketArray = $clientSocketArray;
        //есть ли доступные символы для чтения?
        //возвращает массив сокетов, состояние которых было изменено
        $nullA = [];
        //отслеживаем сокеты, состояние которых было изменено
        socket_select($newSocketArray, $nullA, $nullA, 0, 10);
        //если есть новые запросы на соединения
        if (in_array($socket, $newSocketArray)){
            //создаем новый клиентский сокет
            $newSocket = socket_accept($socket);
            $clientSocketArray[] = $newSocket;

            //устанавливаем соединение
            $header = socket_read($newSocket, 1024);
            sendHeaders($header, $newSocket, "localhost/dots", PORT);
            // var_dump($header);
            // echo "\n";

            //удаляем обработанный сокет
            $newSocketArrayIndex = array_search($socket, $newSocketArray);
            unset($newSocketArray[$newSocketArrayIndex]);
        }
        
        //1
        // проходим по массиву сокетов
        foreach ($newSocketArray as $newSocketArrayResourse){
            //поэтапное считывание информации из сокета
            echo "Массив пар до обработки:\n";
                var_dump($gamePairs);
                echo "\n";
            while (socket_recv($newSocketArrayResourse, $socketData, 1024, 0)>=1){
                //декодируем сообщение
                $socketMessage = unseal($socketData);
                $messageObj = json_decode($socketMessage);

                // var_dump($socketMessage);
                // echo "\n";
                // var_dump($messageObj);
                // echo "\n";
                // print_r($messageObj->user);
                // обернуть это в функцию!!!!!!!!!!!!!!!!
                // проверяем тип сообщения
                echo "обработка........\n";
                var_dump($messageObj);
                echo "\n";
                if ($messageObj->type===REQUEST_FOR_GAME){
                    // если это новый запрос на игру
                    echo "запрос на игру........\n";
                    if ($gamePairs[count($gamePairs) - 1]["blue_player"] != NULL || count($gamePairs)==0){
                        // если все пары укомплектованны, и нужно создать новую
                        echo "новая пара........\n";
                        $gamePairs[] = array(
                            "red_player" => $messageObj->user,
                            "blue_player" => NULL,
                            "red_socket"=>$newSocketArrayResourse,
                            "blue_socket"=>NULL
                        );

                        // echo "Красные ".$messageObj->user;
                        // echo "\n";

                        // отправлем цвет 1 игроку
                        send(seal(prepareMsg(COLOR_ASSIGN, "red")), $newSocketArrayResourse);

                    }
                    else{
                        // если последний игрок ождиает противника
                        $gamePairs[count($gamePairs)-1]["blue_player"] = $messageObj->user;
                        $gamePairs[count($gamePairs)-1]["blue_socket"] = $newSocketArrayResourse;
                        
                        // уведомление красному игроку
                        // echo "Синие ".$messageObj->user;
                        // echo "\n";

                        // отправлем цвет 2 игроку
                        send(seal(prepareMsg(COLOR_ASSIGN, "blue")), $newSocketArrayResourse);
                        // отправляем уведомление о противнике красному игроку о синем
                        send(seal(prepareMsg(ENEMY_ASSIGN, $gamePairs[count($gamePairs)-1]["blue_player"])), $gamePairs[count($gamePairs)-1]["red_socket"]);
                        // отправляем уведомление о протинике синему игроку о красном
                        send(seal(prepareMsg(ENEMY_ASSIGN, $gamePairs[count($gamePairs)-1]["red_player"])), $gamePairs[count($gamePairs)-1]["blue_socket"]);
                        // установка красного маркера
                        send(seal(prepareMsg(MARKER_SET, "red")), $gamePairs[count($gamePairs)-1]["red_socket"]);
                        send(seal(prepareMsg(MARKER_SET, "red")), $gamePairs[count($gamePairs)-1]["blue_socket"]);

                    }
                    // var_dump($gamePairs);
                    // echo "\n";
                }
                // если это ход в игре
                else if ($messageObj->type==NEW_MOVE){
                    echo "Ход в игре\n";
                    
                    $pair = findPairByUser($gamePairs, $messageObj->user);
                    // echo "Пара найдена\n";
                    // var_dump($pair);
                    // отправка данных от красного к синему
                    if (array_search($messageObj->user, $pair)=="red_player"){
                        send(seal(prepareMsg(ENEMY_MOVE, $messageObj->data)), $pair["blue_socket"]);
                        // echo "отправленно синему\n";
                        // print_r($pair["blue_player"]);
                    }
                    // отправка данных от синего к красному
                    else if (array_search($messageObj->user, $pair)=="blue_player"){
                        send(seal(prepareMsg(ENEMY_MOVE, $messageObj->data)), $pair["red_socket"]);
                        // echo "отправленно красному\n";
                        // print_r($pair["red_player"]);
                    }
                    
                }
                echo "Массив пар:\n";
                var_dump($gamePairs);
                echo "\n";
                break 2;
            }
            
            ///2
            //обработка клеинтов, которые покинули игру
            $socketData = @socket_read($newSocketArrayResourse, 1024, PHP_NORMAL_READ);
            if ($socketData === false){
                echo "клиент покинул игру\n";
                // оповещаем противника
                $pair = findPairBySocket($gamePairs, $newSocketArrayResourse);
                var_dump($pair);
                echo "\n";
                if (array_search($newSocketArrayResourse, $pair)=="red_socket"){
                    send(seal(prepareMsg(ENEMY_GONE, array())), $pair["blue_socket"]);
                    echo "синему отправленно уведомление об уходе красного\n";
                    print_r($pair["blue_player"]);
                    echo "\n";
                    // удаляем сокет противника
                    $enemySocketArrayIndex = array_search($pair["blue_socket"], $clientSocketArray);
                    unset($clientSocketArray[$enemySocketArrayIndex]);
                }
                // отправка данных от синего к красному
                else if (array_search($newSocketArrayResourse, $pair)=="blue_socket"){
                    send(seal(prepareMsg(ENEMY_GONE,  array())), $pair["red_socket"]);
                    echo "красному отправленно уведомление об уходе синего\n";
                    print_r($pair["red_player"]);
                    echo "\n";
                    // удаляем сокет противника
                    $enemySocketArrayIndex = array_search($pair["red_socket"], $clientSocketArray);
                    unset($clientSocketArray[$enemySocketArrayIndex]);
                }
                // убираем соответсвующий сокет
                $newSocketArrayIndex = array_search($newSocketArrayResourse, $clientSocketArray);
                unset($clientSocketArray[$newSocketArrayIndex]);
                // 
                echo "Массив пар до удаления пары\n";
                var_dump($gamePairs);
                echo "\n";
                // удаляем пару
                $gamePairIndex = array_search($pair, $gamePairs);
                // 
                echo "Индекс пары\n";
                var_dump($gamePairIndex);
                echo "\n";
                foreach($gamePairs[$gamePairIndex] as $key=>$value){
                    unset($gamePairs[$gamePairIndex][$key]);
                }
                unset($gamePairs[$gamePairIndex]);
                echo "Массив пар после удаления пары\n";
                var_dump($gamePairs);
                echo "\n";
                // echo "Массив сокетов после удаления пары\n";
                // var_dump($clientSocketArray);
                // echo "\n";
            }
        }  
         
    }

    socket_close($socket);

?>