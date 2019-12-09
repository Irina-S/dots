// "use strict";
import {RED_COLOR, BLUE_COLOR} from './classes/game-consts.js'

import {Dot} from './classes/Dot.js';
// !!!!!!!!!!!!!!!
import {Surrounding} from './classes/Surrounding.js';
import {Field} from './classes/Field.js';

// для работы с сетью

import {GameClient} from './network.js';
// НЕ ПРИСВАИВАТЬ ЦВЕТ ПОКА НЕ ПРИШЕЛ ОТВЕТ ОТ СЕРВЕРА
var gameClient = new GameClient();
// gameClient.sendData('ddd', 0);
// gameClient.sendData('username', 0);
// window.addEventListener('load', function(){
//     gameClient.sendData('mmm', 0);
// })

//число клеток
var n = 20;
//svg элемент содержащий поле
var field_svg = Snap("#field");
//ширина клетки
var w = field_svg.node.clientWidth / n; 
//высота клетки
var h = field_svg.node.clientHeight / n; 
//создание объекта поля
var gameField= new Field(20, 20);
// передаем ему его svg
gameField.svg = field_svg;
// отобржаем ход красных маркером
var move_marker = document.createElement('div');
move_marker.className = 'move';
document.getElementById('player1').append(move_marker);

// обработчик события на точке
function dotClickHandler(){
    // меняем цвет на указанный
    // this.node.style.fill = document.getElementById('dot_color').value;
    this.node.style.fill = gameField.getCurMoveColor();
    //выясняем координаты щелчка
    var x = +this.node.dataset.x;
    var y = +this.node.dataset.y;

    // ЗДЕСЬ ЗАМЕНЕНО!!!
    if (gameField.getCurMoveColor()==RED_COLOR){
        gameField.getDot(x,y).setRedColor();
        gameField.getDot(x,y).setActive(document.getElementById('player1').innerHTML);
    }
    else{
        gameField.getDot(x,y).setBlueColor();
        gameField.getDot(x,y).setActive(document.getElementById('player2').innerHTML);
    }

    // уменьшаем кол-во точек
    gameField.decFreeDots();
    // попытка построить полигон
    if (gameField.trySurround(gameField.getDot(x,y))){
        // обрабатываем графику
        var poly = gameField.getLastSurrounding().getPolygonCoords();
        var polygonSVGcoords = [];
        for (var i=0;i<poly.length;i++){
            // вычисляем координаты на сетке по координатам полигона
            var polyX = poly[i].x*w;
            var polyY = poly[i].y*h;
            polygonSVGcoords.push(polyX);
            polygonSVGcoords.push(polyY);
        }
        // строим полигон
        var polygon = field_svg.polygon(polygonSVGcoords);
        // закарашиваем полигон его цветом
        polygon.node.classList = gameField.getCurMoveColor()==RED_COLOR?"red":"blue";
        // пересчитываем очки
        document.getElementById('red-scores').innerHTML = gameField.getRedScore();
        document.getElementById('blue-scores').innerHTML = gameField.getBlueScore();
    }
    // если полигон построить невозможно
    else{
        // переключаем игрока(цвет)
        gameField.toggleColor();
        // показываем текущий цвет
        if (gameField.getCurMoveColor()==RED_COLOR){
            var move_marker = document.getElementById("player2").getElementsByClassName('move')[0];
            document.getElementById("player1").append(move_marker);
        }
        else{
            var move_marker = document.getElementById("player1").getElementsByClassName('move')[0];
            document.getElementById("player2").append(move_marker);
        }
        // document.getElementById('dot_color').querySelector('[value="'+gameField.getCurMoveColor()+'"]').selected = true
    }
    // если все поле занято - отображаем результат
    // доработать!!!!
    // если произошещ разрыв с сетью???
    if (gameField.getFreeDots()==0){
        if (gameField.getRedScore() == gameField.getBlueScore())
            document.getElementById('winner').innerHTML = 'Ничья!'
        else if ((gameField.getRedScore() > gameField.getBlueScore()))
            document.getElementById('winner').innerHTML = 'Красные победили!'
        else if ((gameField.getRedScore() < gameField.getBlueScore()))
            document.getElementById('winner').innerHTML = 'Синие победили!'
    }

}

// создание игрового поля
for (var i = 0; i<n; i++){
    for (var j = 0; j<n; j++){
        // каждая клетка - прямоугольник
        var cell = field_svg.rect(i*w, j*h, w, h);
        // присваем клетке ее координты
        cell.node.dataset.x = i;
        cell.node.dataset.y = j;
        // на пересечение клеток(кроме границ) стоят точки(изначально не видны)
        if (i!=0 && j!=0){
            // каждая точка - круг
            var dot_svg = field_svg.circle(i*w, j*h, 4);
            // присваем точке ее координаты
            dot_svg.node.dataset.x = i;
            dot_svg.node.dataset.y = j;
            // ставим обработчик нажатия на svg точки
            dot_svg.click(dotClickHandler);
            // создаем объект точки
            var dot = new Dot(i, j);
            // передаем ей его svg
            dot.svg = dot_svg;
            // передаем его внутрь поля
            gameField.setDot(i, j, dot);
        }     
    }
}


