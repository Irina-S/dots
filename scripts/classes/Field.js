import {RED_COLOR, BLUE_COLOR} from './game-consts.js'
import {Surrounding} from './Surrounding.js'
export function Field(w, h){
    //константы
    var DIRECTIONS = 8;//направления
    
                        // 0 - вверх
                        // 1 - вверх вправо
                        // и.т.д. по часовой стрелке

    // константы для обозначения цветов
                      
    //свойства
    var height = h;
    var width = w;
    var freeDots = (w-2)*(h-2);
    var redScore = 0;
    var blueScore = 0;

    var dots = [];

    var surroundings = [];

    var curMoveColor = RED_COLOR;//первыми ходят красные

    var self = this;

    this.svg = '';

    

    //методы

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

    // возвращает соседа в указанном направлении заданного цвета
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

    this.decFreeDots = function(dots){
        freeDots-=dots;
    }

    this.getFreeDots = function(){
        return freeDots;
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

    // попытка построить полигон
    this.trySurround = function(startDot){
        // вспомогательная функция сравнивающая координаты в массиве с искомыми
        function isIncluded(coordsArr, dotCoords){
            for (var i = 0; i<coordsArr.length;i++){
                if (JSON.stringify(coordsArr[i])==JSON.stringify(dotCoords))
                    return true;
            }
            return false;
        }

        // вспомогательная функция, проверяющая на равенство координтаы
        function isEqual(dotCoords1, dotCoords2){
            return JSON.stringify(dotCoords1)==JSON.stringify(dotCoords2);
        }

        // вспомогательная функция, проверяющая являются ли координаты соседями
        function isNeighbohors(dotCoords1, dotCoords2){
            if (Math.abs(dotCoords1.x-dotCoords2.x)<=1 && Math.abs(dotCoords1.y-dotCoords2.y)<=1)
                return true
            else
                return false;
        }

        function sortY(dotCoords1, dotCoords2){
            // console.dir([dotCoords1, dotCoords2]);
            if (dotCoords1.y > dotCoords2.y)
                return 1;
            if (dotCoords1.y == dotCoords2.y)
                return 0;
            if (dotCoords1.y < dotCoords2.y)
                return -1;
        }

        function sortX(dotCoords1, dotCoords2){
            // console.dir([dotCoords1, dotCoords2]);
            if (dotCoords1.x > dotCoords2.x)
                return 1;
            if (dotCoords1.x == dotCoords2.x)
                return 0;
            if (dotCoords1.x < dotCoords2.x)
                return -1;
        }

        function restorePolygonDots(dotsArr){
            var res = [];
            dotsArr.forEach(dotCoords => {
                var dot = self.getDot(dotCoords.x, dotCoords.y);
                res.push(dot);
            });
            return res;
        }

        function restoreEatenDots(innerDotsArr, color){
            var res = [];
            innerDotsArr.forEach(dotCoords => {
                var dot = self.getDot(dotCoords.x, dotCoords.y);
                if (dot.getColor()!=color && dot.getStatus()!="inactive" && dot.getStatus()!="eaten"){
                    res.push(dot);
                    dot.setEaten();
                }
                    
            });
            return res;
        }
        // 

        // только полигоны
        var polygons = [];

        // рабочий массив с путями
            // где индекс - длинна путей, содеражащихся во вложенном массиве по этому индексу
        var pathes = [];        
        // стартовая точка(координаты)
        var startDotCoords = {
            x:startDot.getX(),
            y:startDot.getY()
        }
        // текущая точка и ее координаты
        var curDot = startDot;
        var curDotCoords = {
            x:curDot.getX(),
            y:curDot.getY()
        }
        // цвет полигона
        var color = startDot.getColor();
        var direction = 0;

        pathes[0] = null;//нет путей длинной 0
        pathes[1] = [[curDotCoords]];

        // цикл по путям разной длинны, пока есть что перебирать
        for (var i=1;pathes[i]!==undefined;i++){
            // цикл по путям длинной i
            for (var j=0;j<pathes[i].length;j++){
                // рассматриваем последнюю точку в пути под номером j среди путей длинной i
                curDotCoords = pathes[i][j][i-1];
                curDot = self.getDot(curDotCoords.x, curDotCoords.y);
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
                    //если такая точка уже входит в путь продолжаем
                    if (isIncluded(pathes[i][j], nextDotCoords))
                        continue;
                    
                    // если точка есть добавляем ее к пути и записываем в пути длинной на 1 больше
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
        console.log('все пути:')
        console.dir(pathes);
        // отбираем из путей только полигоны
        // рассматриваем пути не менее 4х точек
        for (i=4;i<pathes.length;i++){
            for (j=0;j<pathes[i].length;j++){
                // если первая и последняя точки пути соседи, значит полигон замкнулся
                if (isNeighbohors(pathes[i][j][0], pathes[i][j][pathes[i][j].length-1]))
                    polygons.push(pathes[i][j]);
            }
        }
        console.log('из них полигоны:');
        console.dir(polygons);

        var surrounding = polygons[polygons.length-1];

        console.log('итоговый полигон:');
        console.dir(surrounding);

        // если возможно построить полигон
        if (surrounding){
            // сортируем точки в полигоне
            var sortedSurrounding = [];//массив координат, в котором координаты отсортированны по у, 
                                        //а при равных y по x
            var surroundingCopy = [];//копия массива, что бы не испортить полигон
            for(var i =0; i<surrounding.length;i++){
                surroundingCopy.push({
                    x:surrounding[i].x,
                    y:surrounding[i].y
                });
            }

            surroundingCopy.sort(sortY);//сортировка по y
            // //сортировка по равным y 
            for (var i=surroundingCopy[0].y;i<=surroundingCopy[surroundingCopy.length-1].y;i++){
                var tmpDots = surroundingCopy.filter(item => item.y == i);
                tmpDots.sort(sortX);
                for (var j=0; j<tmpDots.length;j++)
                    sortedSurrounding.push(tmpDots[j]);
            }

            console.log('полигон с отсортированными вершинами');
            console.dir(sortedSurrounding);

            //выявляем координаты внутренних точек
            var innerDotsCoords = [];

            // // цикл по y = i
            for (var i=sortedSurrounding[0].y+1; i<=sortedSurrounding[sortedSurrounding.length-1].y-1;i++){
                var tmpDots = sortedSurrounding.filter(item => item.y == i);
                // цикл по каждому отрезку
                for (var j = 0; j<tmpDots.length;j=j+2){
                    if (tmpDots[j+1]!=undefined){
                        var x1 = tmpDots[j].x;
                        var x2 = tmpDots[j+1].x;
                        while (++x1<x2){
                            innerDotsCoords.push({
                                x:x1,
                                y:i
                            });
                        }
                    }
                }
            }
            console.log('внутренние точки');
            console.dir(innerDotsCoords);

            // фомируем результат
            var polygonDots = restorePolygonDots(surrounding);
            var eatenDots = restoreEatenDots(innerDotsCoords, color);
            console.dir(eatenDots);

        }
        // если можно построить полигон и есть захваченные точки
        if (polygonDots && eatenDots.length>0){
            var newSurrounding = new Surrounding(startDot.getOwner(), color, polygonDots, eatenDots);
            surroundings.push(newSurrounding);
            console.log('новое окружение успешно построенно');
            return true;
        }
        else
            return false;
        
    }

    this.getLastSurrounding = function(){
        return surroundings[surroundings.length-1] || false;
    }

    this.disableEatenDots = function(coords){
        var score = 0;
        coords.forEach(coord =>{
            self.getDot(coord.getX(), coord.getY()).setEaten();
            score++;
        });
        return score;
    }

    this.recalcScores = function(color){
        if (self.getLastSurrounding()){
            var addScore = self.disableEatenDots(self.getLastSurrounding().getEatenCoords());
            if (color==RED_COLOR)
                redScore+=addScore
            else if (color==BLUE_COLOR)
                blueScore+=addScore;
        }
        
    }

    this.getRedScore = function(){
        return redScore;
    }

    this.getBlueScore = function(){
        return blueScore;
    }
}