"use strict";
// класс Точка
function Dot(x, y){
    

    //координаты
    var x = x;
    var y = y;
    //статус
    var status = 'inactive';
    // цвет
    var color = '';
    // кто поставил
    var owner = '';
    //svg элемент представляющий эту точку
    this.svg = '';

    //МЕТОДЫ

    this.getX = function(){
        return x;
    }

    this.getY = function(){
        return y;
    }

    this.getStatus = function(){
        return status;
    }

    this.getOwner = function(){
        return owner;
    }

    this.setActive = function(owner_name){
        status = 'active';
        owner = owner_name;
    }

    this.setDisabled = function(){
        status = 'disabled';
    }

    this.isActive = function(){
        return status == 'active';
    }

    this.isDisabled = function(){
        return status == 'disabled';
    }

    this.setRedColor = function(){
        color = RED_COLOR;
    }

    this.setBlueColor = function(){
        color = RED_COLOR;
    }

    this.getColor = function(){
        return color;
    }

}

function Surrounding(){

}
function Field(w, h){
    //константы
    var DIRECTIONS = 8;
    
    // 0 - вверх
    // 1 - вверх вправо
    // и.т.д. по часовой стрелке

    //свойства
    var height = h;
    var width = w;
    var redScore = 0;
    var blueScore = 0;

    var dots = [];

    var surroundings = [];

    var curMoveColor = RED_COLOR;//первыми ходят красные

    var self = this;

    this.svg = '';

    

    //методы

    //закрытые

    // возвращает координаты ячеек с заданным значением
    

    // открытые

    this.init = function(){
        for (var i=1; i<width; i++){
            dots[i] = [];
            for (var j=1;j<height; j++){
                dots[i][j] = 0;
            }
        }
    }


    this.setDot = function(x,y, dot){
        dots[x][y] = dot;
    }

    this.getDot = function(x,y){
        return dots[x][y];
    }

    // возвращает соседа в указанном направлении, или false в случае его отсутсвия или ошибки
    this.getNeigbohor = function(dot, direction){
        var res = false;
        // ЗДЕСЬ МОГУТ БЫТЬ ИСКЛЮЧЕНИЯ!!!!
        // console.dir(dot);
        var x = dot.getX();
        var y = dot.getY();
        switch (direction){
            case 0: 
                if (y-1>0)
                    res = dots[x][y-1];
                break;
        case 1: if (y-1>0 && x+1<width)
                    res = dots[x+1][y-1];
                break;
        case 2:if (x+1<width)
                    res = dots[x+1][y];
                break;
        case 3:if (y+1<height && x+1<width)
                    res = dots[x+1][y+1];
                break;
        case 4:if (y+1<height)
                    res = dots[x][y+1];
                break;
        case 5:if (x-1>0 && y+1<height)
                    res = dots[x-1][y+1];
                break;
        case 6:if (x-1>0)
                    res = dots[x-1][y];
                break;
        case 7:if (x-1>0 && y-1>0)
                    res = dots[x-1][y-1];
                break;
        }
        return res;
    }

    this.getSameColorNeigbohor = function(dot, direction, color){
        var dot = self.getNeigbohor(dot, direction);

        if (dot)
            if (dot.getColor()==color)
                return dot;
        return false;
    }

    this.getCurMoveColor = function(){
        return curMoveColor;
    }

    // переклчение цвета на противоположный
    this.toggleColor=function(){
        if (curMoveColor==RED_COLOR)
            curMoveColor = BLUE_COLOR;
        else
            curMoveColor = RED_COLOR;
    }
    //передача права ходить второму игроку
    this.togglePlayer = function(){
        self.toggleColor();
        // требует реализации
    }

    

    this.trySurround = function(startDot){
        // вспомогательная функция сравнивающая координаты в массиве с искомыми
        function isIncluded(coordsArr, dotCoords){
            for (var i = 0; i<coordsArr.length;i++){
                if (JSON.stringify(coordsArr[i])==JSON.stringify(dotCoords))
                    return true;
            }
            return false;
        }

        // вспомогательная функция
        function isEqual(dotCoords1, dotCoords2){
            return JSON.stringify(dotCoords1)==JSON.stringify(dotCoords2);
        }

        function isNeighbohors(dotCoords1, dotCoords2){
            if (Math.abs(dotCoords1.x-dotCoords2.x)<=1 && Math.abs(dotCoords1.y-dotCoords2.y)<=1)
                return true
            else
                return false;
        }

        // только полигоны
        var polygons = [];

        var pathes = [];

        
        // ОТЛАДИТЬ ПРАВИЛЬНОЕ ДОБАВЛЕНИЕ В МАССИВ
        var startDotCoords = {
            x:startDot.getX(),
            y:startDot.getY()
        }

        var curDot = startDot;
        var curDotCoords = {
            x:curDot.getX(),
            y:curDot.getY()
        }
        var color = startDot.getColor();
        // var x = startDot.getX();
        // var y = startDot.getY();
        var startDirection = 0;
        var direction = startDirection;

        pathes[0] = null;//нет путей длинной 0
        pathes[1] = [[curDotCoords]];

        // цикл по путям разной длинны, пока есть что перебирать
        for (var i=1;pathes[i]!==undefined;i++){
            // цикл по путям длинной i
            for (var j=0;j<pathes[i].length;j++){
                // рассматриваем последнюю точку в пути под номером j среди путей длинной i
                curDotCoords = pathes[i][j][i-1];
                curDot = field.getDot(curDotCoords.x, curDotCoords.y);
                // curDotCoords = {
                //     x:curDot.getX(),
                //     y:curDot.getY()
                // }
                // console.dir(curDot);
                // цикл по направлениям вокруг текущей точки
                direction = 0;
                while (direction < DIRECTIONS){
                    var nextDot = self.getSameColorNeigbohor(curDot, direction, color);
                    
                    direction++;
                    // если нет такой точки продолжаем
                    if (!nextDot)
                        continue;
                    var nextDotCoords = {
                        x:nextDot.getX(),
                        y:nextDot.getY()
                    }
                    // если путь замкнулся
                    // if (isEqual(startDotCoords, nextDotCoords)){
                    //     var tmpPolygon = [];
                    //     for (var k=0; k<pathes[i][j].length;k++)
                    //         tmpPolygon.push(pathes[i][j][k]);
                    //     polygons.push(tmpPolygon);
                    // }
                    //если такая точка уже входит в путь продолжаем
                    if (isIncluded(pathes[i][j], nextDotCoords))
                        continue;
                    
                    // если точка есть добавляем ее к пути и записываем в пути длинной на 1 больше
                    
                    // var tmpPath = pathes[i][j];
                    var tmpPath = [];
                    for (var k=0; k<pathes[i][j].length;k++)
                        tmpPath.push(pathes[i][j][k]);
                    tmpPath.push(nextDotCoords);
                    if (pathes[i+1]===undefined)
                        pathes[i+1] = [];
                    pathes[i+1].push(tmpPath);
                    if (isEqual(startDotCoords, nextDotCoords)){
                        var tmpPolygon = [];
                        for (var k=0; k<tmpPath.length;k++)
                            tmpPolygon.push(tmpPath[k]);
                        polygons.push(tmpPolygon);
                    }

                }

            }
            
        }
        
        // отбираем из путей только полигоны
        // рассматриваем пути не менее 4х точек
        for (i=4;i<pathes.length;i++){
            for (j=0;j<pathes[i].length;j++){
                // если первая и последняя точки пути соседи, значит полигон замкнулся
                if (isNeighbohors(pathes[i][j][0], pathes[i][j][pathes[i][j].length-1]))
                    polygons.push(pathes[i][j]);
            }
        }
        return polygons;
    }


}

var RED_COLOR = '#ff0000', BLUE_COLOR = '#0000ff';

var n = 20;//число клеток
var field_svg = Snap("#field");//svg элемент содержащий поле
var w = field_svg.node.clientWidth / n; //ширина клетки
var h = field_svg.node.clientHeight / n; //высота клетки

//создание объекта поля
var field= new Field(20, 20);
field.init();
field.svg = field_svg;

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

                // ОСТОРОЖНО КОСТЫЛЬ!!!
                // сверяем выбранный цвет с текущим
                if (field.getCurMoveColor()!=document.getElementById('dot_color').value){
                    field.toggleColor();
                    field.togglePlayer();
                }
                    
                //выясняем координаты щелчка
                var x = +this.node.dataset.x;
                var y = +this.node.dataset.y;
                // меняем статус точки, по которой был щелчек
                
                // сообщаем точке цвет
                if (field.curMoveColor==RED_COLOR){
                    field.getDot(x,y).setRedColor();
                    field.getDot(x,y).setActive('me');
                }
                else{
                    field.getDot(x,y).setBlueColor();
                    field.getDot(x,y).setActive('not me');
                }
                    
            });
            // создаем объект точки
            var dot = new Dot(i, j);
            dot.svg = dot_svg;
            // передаем его внутрь поля
            field.setDot(i, j, dot);
        }     
    }
}
