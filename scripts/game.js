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
    static n = 20;
    static gameClient = new GameClient(document.getElementById("username").value);
    static gameField= new Field(Game.n, Game.n);
    

    constructor(){
        // инициируем игру на элементе
        this.gameElement = document.getElementById("game");
        // добавляем слушатель события для игры
        this.gameElement.addEventListener('enemyMove', (event) => {this._enemyMoveHandler(event)});
        // добавляем слушатель события ушедшего соперника
        this.gameElement.addEventListener('enemyGone', () => { console.log('cj,snbt gjqvfyj'); this._showEnemyGone()});
        // клиент для работы с сетью
        // this.gameClient = new GameClient(document.getElementById("username").value);
        //число клеток
        this.n = 20;
        //svg элемент содержащий поле
        this.field_svg = Snap("#field");
        //ширина клетки
        this.w = this.field_svg.node.clientWidth / Game.n; 
        //высота клетки
        this.h = this.field_svg.node.clientHeight / Game.n; 
        //создание объекта поля
        // Game.gameField= new Field(this.n, this.n);
        // передаем ему его svg
        Game.gameField.svg = this.field_svg;

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
                    Game.gameField.setDot(i, j, dot);
                }     
            }
        }
    }

    // обработчик клика по точке для игрока
    _dotClickHandler(){
        // если игра готова начаться и текущий цвет-мой цвет
        if (Game.gameClient.readyState && Game.gameField.getCurMoveColor(false)==Game.gameClient.myColor){
            this.node.style.fill = Game.gameField.getCurMoveColor();
            //выясняем координаты щелчка
            var x = +this.node.dataset.x;
            var y = +this.node.dataset.y;

            // отправляем данные второму игроку
            Game.gameClient.makeMove(x, y);
        
            // ЗДЕСЬ ЗАМЕНЕНО!!!
            if (Game.gameField.getCurMoveColor()==RED_COLOR){
                Game.gameField.getDot(x,y).setRedColor();
                Game.gameField.getDot(x,y).setActive(document.getElementById('red_player').innerHTML);
            }
            else{
                Game.gameField.getDot(x,y).setBlueColor();
                Game.gameField.getDot(x,y).setActive(document.getElementById('blue_player').innerHTML);
            }
        
            // уменьшаем кол-во точек
            Game.gameField.decFreeDots();
            // попытка построить полигон
            if (Game.gameField.trySurround(Game.gameField.getDot(x,y))){
                // обрабатываем графику
                var poly = Game.gameField.getLastSurrounding().getPolygonCoords();
                var w = Game.gameField.svg.node.clientWidth / Game.n;
                var h = Game.gameField.svg.node.clientHeight / Game.n;
                var polygonSVGcoords = [];
                for (var i=0;i<poly.length;i++){
                    // вычисляем координаты на сетке по координатам полигона
                    var polyX = poly[i].x*w;
                    var polyY = poly[i].y*h;
                    polygonSVGcoords.push(polyX);
                    polygonSVGcoords.push(polyY);
                }
                // строим полигон
                var polygon = Game.gameField.svg.polygon(polygonSVGcoords);
                // закарашиваем полигон его цветом
                polygon.node.classList = Game.gameField.getCurMoveColor()==RED_COLOR?"red":"blue";
                // пересчитываем очки
                document.getElementById('red-scores').innerHTML = Game.gameField.getRedScore();
                document.getElementById('blue-scores').innerHTML = Game.gameField.getBlueScore();
            }
            // если полигон построить невозможно
            else{
                // переключаем игрока(цвет)
                Game.gameField.toggleColor();
                // показываем текущий цвет
                if (Game.gameField.getCurMoveColor()==RED_COLOR){
                    var move_marker = document.getElementById("blue_player").getElementsByClassName('move')[0];
                    document.getElementById("red_player").append(move_marker);
                }
                else{
                    var move_marker = document.getElementById("red_player").getElementsByClassName('move')[0];
                    document.getElementById("blue_player").append(move_marker);
                }
                // document.getElementById('dot_color').querySelector('[value="'+Game.gameField.getCurMoveColor()+'"]').selected = true
            }
            // если все поле занято - отображаем результат
            // доработать!!!!
            // если произошещ разрыв с сетью???
            if (Game.gameField.getFreeDots()==0){
                if (Game.gameField.getRedScore() == Game.gameField.getBlueScore())
                    document.getElementById('winner').innerHTML = 'Ничья!'
                else if ((Game.gameField.getRedScore() > Game.gameField.getBlueScore()))
                    document.getElementById('winner').innerHTML = 'Красные победили!'
                else if ((Game.gameField.getRedScore() < Game.gameField.getBlueScore()))
                    document.getElementById('winner').innerHTML = 'Синие победили!';
                // отображаем результат
                document.getElementsByClassName('filler')[0].style.display = 'block';
            }
        }
    }

    // обработчик данных о ходе игрока
    _enemyMoveHandler(event){
        let x = event.detail.x;
        let y = event.detail.y;

        // закрашиваем точку
        Game.gameField.getDot(x, y).svg.node.style.fill = Game.gameField.getCurMoveColor();

        if (Game.gameField.getCurMoveColor()==RED_COLOR){
            Game.gameField.getDot(x,y).setRedColor();
            Game.gameField.getDot(x,y).setActive(document.getElementById('red_player').innerHTML);
        }
        else{
            Game.gameField.getDot(x,y).setBlueColor();
            Game.gameField.getDot(x,y).setActive(document.getElementById('blue_player').innerHTML);
        }
        // уменьшаем кол-во точек
        Game.gameField.decFreeDots();
        // попытка построить полигон
        if (Game.gameField.trySurround(Game.gameField.getDot(x,y))){
            // обрабатываем графику
            var poly = Game.gameField.getLastSurrounding().getPolygonCoords();
            var w = Game.gameField.svg.node.clientWidth / Game.n;
            var h = Game.gameField.svg.node.clientHeight / Game.n;
            var polygonSVGcoords = [];
            for (var i=0;i<poly.length;i++){
                // вычисляем координаты на сетке по координатам полигона
                var polyX = poly[i].x*w;
                var polyY = poly[i].y*h;
                polygonSVGcoords.push(polyX);
                polygonSVGcoords.push(polyY);
            }
            // строим полигон
            var polygon = Game.gameField.svg.polygon(polygonSVGcoords);
            // закарашиваем полигон его цветом
            polygon.node.classList = Game.gameField.getCurMoveColor()==RED_COLOR?"red":"blue";
            // пересчитываем очки
            document.getElementById('red-scores').innerHTML = Game.gameField.getRedScore();
            document.getElementById('blue-scores').innerHTML = Game.gameField.getBlueScore();
        }
        // если полигон построить невозможно
        else{
            // переключаем игрока(цвет)
            Game.gameField.toggleColor();
            // показываем текущий цвет
            if (Game.gameField.getCurMoveColor()==RED_COLOR){
                var move_marker = document.getElementById("blue_player").getElementsByClassName('move')[0];
                document.getElementById("red_player").append(move_marker);
            }
            else{
                var move_marker = document.getElementById("red_player").getElementsByClassName('move')[0];
                document.getElementById("blue_player").append(move_marker);
            }
            // document.getElementById('dot_color').querySelector('[value="'+Game.gameField.getCurMoveColor()+'"]').selected = true
        }
        // если все поле занято - отображаем результат
        // доработать!!!!
        // если произошещ разрыв с сетью???
        if (Game.gameField.getFreeDots()==0){
            if (Game.gameField.getRedScore() == Game.gameField.getBlueScore())
                document.getElementById('winner').innerHTML = 'Ничья!'
            else if ((Game.gameField.getRedScore() > Game.gameField.getBlueScore()))
                document.getElementById('winner').innerHTML = 'Красные победили!'
            else if ((Game.gameField.getRedScore() < Game.gameField.getBlueScore()))
                document.getElementById('winner').innerHTML = 'Синие победили!'
            // отображаем результат
            document.getElementsByClassName('filler')[0].style.display = 'block';
        }

        

    }

    _showEnemyGone(){
        console.log('внутри обработчика');
        document.getElementsByClassName('filler')[0].style.display = 'block';
        document.getElementById("winner").innerHTML = "Your enemy left the game";
    }
}

new Game();




