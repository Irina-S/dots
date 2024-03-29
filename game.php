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
       
        <div class="filler">
            <form >
                <div class="new-game">
                    <?php echo "<input type='hidden' id='username' name='username' value=".$_GET['username'].">"?>
                    <input type='hidden' name='mode' value='player'>
                    <p class="winner" id="winner">winner</p><br>
                    <input type="submit" value="New game!">
                </div>
                
            </form>
        </div>
        <div class="wrapper" id="game">
            <!-- for displaying connection status -->
            <div class="connection-state" id="connection-state"></div>
            <div class="score-counter">
                <!-- !!!!!!!!!!!!!!что с классами!!!!???? -->
                <div class="red_player" id="red_player">
                    <!-- <div class="move"></div> -->
                </div>
                <div class="red-scores" id="red-scores">0</div>
                <div class="blue_player" id="blue_player">
                    <!-- <div class="move"></div> -->
                </div>
                <div class="blue-scores" id="blue-scores">0</div>
            </div>
            
            <div class="field-wrapper">
                <!-- <div class="field"></div> -->
                <svg class="field" id="field"></svg>
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
        <script src="scripts\Game.js" type="module"></script>
        <!-- <script src="scripts\game-gui.js" type="module"></script> -->
    </body>
</html>