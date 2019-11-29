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
        <div class="wrapper">
            <!-- for displaying connection status -->
            <div class="connection-state" id="connection-state"></div>
            <div class="score-counter">
                <!-- !!!!!!!!!!!!!!что с классами!!!!???? -->
                <div class="player1" id="my-name"><?php echo $_GET['username']?></div>
                <div class="red-scores" id="red-scores">0</div>
                <div class="player2" id="opponent-name">opponent</div>
                <div class="blue-scores" id="blue-scores">0</div>
            </div>
            <!-- <div class="winner" id="winner">
            </div> -->
            <div class="field-wrapper">
                <div class="field"></div>
                <!-- <svg data-x="3" data-y="2" class="field" id="field"></svg> -->
            </div>
            <!-- <div class="tabs-wrapper">
                <select class = "tab" id="dot_color">
                    <option value="#ff0000">Красный</option>
                    <option value="#0000ff">Синий<option>
                </select>
            </div> -->
        </div>
        <!-- скрипты -->
        <script src="scripts\snap.svg.js"></script>
        <!-- <script src="scripts\game.js" type="module"></script> -->
        <!-- <script src="scripts\game-gui.js" type="module"></script> -->
    </body>
</html>