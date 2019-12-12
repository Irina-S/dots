// "use strict";
import {RED_COLOR, BLUE_COLOR} from './classes/game-consts.js'

import {Dot} from './classes/Dot.js';
// !!!!!!!!!!!!!!!
import {Surrounding} from './classes/Surrounding.js';
import {Field} from './classes/Field.js';

// для работы с сетью

import {GameClient} from './network/GameClient.js';
// НЕ ПРИСВАИВАТЬ ЦВЕТ ПОКА НЕ ПРИШЕЛ ОТВЕТ ОТ СЕРВЕРА
class Game{
    constructor(){
        // инициируем игру на элементе
        this.gameElement = document.getElementById("game");
        // добавляем слушатель события для игры

        // клиент для работы с сетью
        this.gameClient = new GameClient(document.getElementById("username").value);
        //число клеток
        this.n = 20;
        //svg элемент содержащий поле
        this.field_svg = Snap("#field");
        //ширина клетки
        this.w = this.field_svg.node.clientWidth / this.n; 
        //высота клетки
        this.h = this.field_svg.node.clientHeight / this.n; 
        //создание объекта поля
        this.gameField= new Field(this.n, this.n);
        // передаем ему его svg
        this.gameField.svg = this.field_svg;
        // создаем поле
        for (var i = 0; i<this.n; i++){
            for (var j = 0; j<this.n; j++){
                // каждая клетка - прямоугольник
                var cell = this.field_svg.rect(i*this.w, j*this.h, this.w, this.h);
                // присваем клетке ее координты
                cell.node.dataset.x = i;
                cell.node.dataset.y = j;
                // на пересечение клеток(кроме границ) стоят точки(изначально не видны)
                if (i!=0 && j!=0){
                    // каждая точка - круг
                    var dot_svg = this.field_svg.circle(i*this.w, j*this.h, 4);
                    // присваем точке ее координаты
                    dot_svg.node.dataset.x = i;
                    dot_svg.node.dataset.y = j;
                    // ставим обработчик нажатия на svg точки
                    dot_svg.click(this._dotClickHandler);
                    // создаем объект точки
                    var dot = new Dot(i, j);
                    // передаем ей его svg
                    dot.svg = dot_svg;
                    // передаем его внутрь поля
                    this.gameField.setDot(i, j, dot);
                }     
            }
        }
    }

    _dotClickHandler(){
        // меняем цвет на указанный
        // this.node.style.fill = document.getElementById('dot_color').value;
        this.node.style.fill = this.gameField.getCurMoveColor();
        //выясняем координаты щелчка
        var x = +this.node.dataset.x;
        var y = +this.node.dataset.y;
    
        // ЗДЕСЬ ЗАМЕНЕНО!!!
        if (this.gameField.getCurMoveColor()==RED_COLOR){
            this.gameField.getDot(x,y).setRedColor();
            this.gameField.getDot(x,y).setActive(document.getElementById('player1').innerHTML);
        }
        else{
            this.gameField.getDot(x,y).setBlueColor();
            this.gameField.getDot(x,y).setActive(document.getElementById('player2').innerHTML);
        }
    
        // уменьшаем кол-во точек
        this.gameField.decFreeDots();
        // попытка построить полигон
        if (this.gameField.trySurround(this.gameField.getDot(x,y))){
            // обрабатываем графику
            var poly = this.gameField.getLastSurrounding().getPolygonCoords();
            var polygonSVGcoords = [];
            for (var i=0;i<poly.length;i++){
                // вычисляем координаты на сетке по координатам полигона
                var polyX = poly[i].x*w;
                var polyY = poly[i].y*h;
                polygonSVGcoords.push(polyX);
                polygonSVGcoords.push(polyY);
            }
            // строим полигон
            var polygon = this.field_svg.polygon(polygonSVGcoords);
            // закарашиваем полигон его цветом
            polygon.node.classList = this.gameField.getCurMoveColor()==RED_COLOR?"red":"blue";
            // пересчитываем очки
            document.getElementById('red-scores').innerHTML = this.gameField.getRedScore();
            document.getElementById('blue-scores').innerHTML = this.gameField.getBlueScore();
        }
        // если полигон построить невозможно
        else{
            // переключаем игрока(цвет)
            this.gameField.toggleColor();
            // показываем текущий цвет
            if (this.gameField.getCurMoveColor()==RED_COLOR){
                var move_marker = document.getElementById("player2").getElementsByClassName('move')[0];
                document.getElementById("player1").append(move_marker);
            }
            else{
                var move_marker = document.getElementById("player1").getElementsByClassName('move')[0];
                document.getElementById("player2").append(move_marker);
            }
            // document.getElementById('dot_color').querySelector('[value="'+this.gameField.getCurMoveColor()+'"]').selected = true
        }
        // если все поле занято - отображаем результат
        // доработать!!!!
        // если произошещ разрыв с сетью???
        if (this.gameField.getFreeDots()==0){
            if (this.gameField.getRedScore() == this.gameField.getBlueScore())
                document.getElementById('winner').innerHTML = 'Ничья!'
            else if ((this.gameField.getRedScore() > this.gameField.getBlueScore()))
                document.getElementById('winner').innerHTML = 'Красные победили!'
            else if ((this.gameField.getRedScore() < this.gameField.getBlueScore()))
                document.getElementById('winner').innerHTML = 'Синие победили!'
        }
    
    }

}

new Game();




