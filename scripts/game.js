// "use strict";
import {Dot} from './classes/Dot.js';
import {Surrounding} from './classes/Surrounding.js';
import {Field} from './classes/Field.js';

var RED_COLOR = '#ff0000', BLUE_COLOR = '#0000ff';

var n = 20;//число клеток
var field_svg = Snap("#field");//svg элемент содержащий поле
var w = field_svg.node.clientWidth / n; //ширина клетки
var h = field_svg.node.clientHeight / n; //высота клетки

//создание объекта поля
var gameField= new Field(20, 20);
gameField.svg = field_svg;

// создание сетки
for (var i = 0; i<n; i++){
    for (var j = 0; j<n; j++){
        // каждая клетка - прямоугольник
        var cell = field_svg.rect(i*w, j*h, w, h);
        cell.node.dataset.x = i;
        cell.node.dataset.y = j;
        // на пересечение клеток(кроме границ) стоят точки(изначально не видны)
        if (i!=0 && j!=0){
            var dot_svg = field_svg.circle(i*w, j*h, 4);
            dot_svg.node.dataset.x = i;
            dot_svg.node.dataset.y = j;
            // обработчик нажатия на svg точки
            dot_svg.click(function(){
                // меняем цвет на указанный
                this.node.style.fill = document.getElementById('dot_color').value;
                //выясняем координаты щелчка
                var x = +this.node.dataset.x;
                var y = +this.node.dataset.y;
                // меняем статус точки, по которой был щелчек
                // console.log(gameField.getCurMoveColor());
                // сообщаем точке цвет
                // console.log(document.getElementById('dot_color').value);
                if (document.getElementById('dot_color').value==RED_COLOR){
                    gameField.getDot(x,y).setRedColor();
                    gameField.getDot(x,y).setActive(document.getElementById('my-name').innerHTML);
                }
                else{
                    gameField.getDot(x,y).setBlueColor();
                    gameField.getDot(x,y).setActive(document.getElementById('opponent-name').innerHTML);
                }

                // уменьшаем кол-во точек
                gameField.decFreeDots(1);
                // поппытка построить полигон
                if (gameField.trySurround(gameField.getDot(x,y))){
                    var poly = gameField.getLastSurrounding().getPolygonCoords();
                    var polygonSVGcoords = [];
                    for (var i=0;i<poly.length;i++){
                        // копировать несортированные коордиаты
                        var polyX = poly[i].x*w;
                        var polyY = poly[i].y*h;
                        polygonSVGcoords.push(polyX);
                        polygonSVGcoords.push(polyY);
                    }
                    var polygon = field_svg.polygon(polygonSVGcoords);
                    polygon.node.classList = document.getElementById('dot_color').value==RED_COLOR?"red":"blue";
                }


            });
            // создаем объект точки
            var dot = new Dot(i, j);
            dot.svg = dot_svg;
            // передаем его внутрь поля
            gameField.setDot(i, j, dot);
        }     
    }
}


