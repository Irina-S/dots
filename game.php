<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="styles/global.css">
        <link rel="stylesheet" type="text/css" href="styles/game.css">
        <link rel="stylesheet" type="text/css" href="styles/svg.css">
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>DOTS</title>
    </head>
    <body>
        <!-- скрывает содержимое при ajax-запросе -->
        <div class="filler">    
        </div>
        <!-- <h3 class="header">Welcome to "DOTS"!</h3> -->
        <div class="wrapper">
            <div class="field-wrapper">
                <!-- <div class="field"></div> -->
                <svg data-x="3" data-y="2" class="field" id="field"></svg>
            </div>
            <!-- разместить канву ил свг под таблицей -->
            <div class="tabs-wrapper">
                <div class="tab">Player</div>
                <div class="tab">Player</div>
                <div class="tab">Player</div>

                <select class = "tab" id="dot_color">
                    <option value="#ff0000">Красный</option>
                    <option value="#0000ff">Синий<option>
                </select>
            </div>
        </div>
        <!-- скрипты -->
        <script src="scripts\snap.svg.js"></script>
        <script src="scripts\game.js"></script>
    </body>
</html>