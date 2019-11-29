<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="styles/global.css">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>DOTS</title>
    </head>
    <body>
        <!-- скрывает содержимое при ajax-запросе -->
        <div class="filler">    
            <form action="game.php" method="get">
                <div class="name-input">
                    <p>Enter your name:</p>
                    <input type="hidden" name="mode" value="">
                    <input name = "username" type="text">
                    <input type="submit" value="Start!">
                </div>    
            </form> 
        </div>
        <h3 class="header">Welcome to "DOTS"!</h3>
        <div class="main-menu">
            <p>Start as:</p>
            <button name="mode" value="leader">Player</button>
            <button name="mode" value="player">Watcher</button>
        </div>
        <!-- скрипты -->
        <script src="scripts\index.js"></script>
    </body>
</html>