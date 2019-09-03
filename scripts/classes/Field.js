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
    var curMoveColor = RED_COLOR;//первыми ходят красные

    var dots = [];
    var fieldMatrix = [];

    var surroundings = [];

    

    var self = this;

    this.svg = '';

    init();

    //методы
    // закрыт
    function init(){
            for (var i=1; i<width; i++){
                dots[i] = [];
                fieldMatrix[i] = []
                for (var j=1;j<height; j++){
                    dots[i][j] = 0;
                    fieldMatrix[i][j] = 0;
                }
            }
    }

    function isIncluded(coordsArr, dotCoords){
        for (var i = 0; i<coordsArr.length;i++){
            if (JSON.stringify(coordsArr[i])==JSON.stringify(dotCoords))
                return true;
        }
        return false;
    }

    // вспомогательная функция, проверяющая являются ли координаты соседями
    function isNeighbohors(dotCoords1, dotCoords2){
        if (Math.abs(dotCoords1.x-dotCoords2.x)<=1 && Math.abs(dotCoords1.y-dotCoords2.y)<=1)
            return true
        else
            return false;
    }

    function isEqual(dotCoords1, dotCoords2){
        return JSON.stringify(dotCoords1)==JSON.stringify(dotCoords2);
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

    function sortXandY(polygonDots){
        var sortedDots = [];
        polygonDots.sort(sortY);//сортировка по y
        // //сортировка по x при равных y 
        for (var i=polygonDots[0].y;i<=polygonDots[polygonDots.length-1].y;i++){
            var tmpDots = polygonDots.filter(item => item.y == i);
            tmpDots.sort(sortX);
            for (var j=0; j<tmpDots.length;j++)
                sortedDots.push(tmpDots[j]);
        }
        return sortedDots;
    }

    function buildPathes(startDot){
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
        var color = startDot.getColorCode();
        // 
        var direction = 0;
        var pathes = [];        
        //нет путей длинной 0
        pathes[0] = null;
        pathes[1] = [[curDotCoords]];
        // цикл по путям разной длинны, пока есть что перебирать
        for (var i=1;pathes[i]!==undefined;i++){
            // цикл по путям длинной i
            for (var j=0;j<pathes[i].length;j++){
                // рассматриваем последнюю точку в пути под номером j среди путей длинной i
                curDotCoords = pathes[i][j][i-1];
                // curDot = self.getDot(curDotCoords.x, curDotCoords.y);
                // цикл по направлениям вокруг текущей точки
                direction = 0;
                while (direction < DIRECTIONS){
                    var nextDotCoords = self.getNeigbohor(curDotCoords, direction, color);   
                    direction++;
                    // если нет такой точки продолжаем
                    if (!nextDotCoords)
                        continue;
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
                }

            }

            
        }
        console.dir(pathes);
        return pathes;
    }

    function choosePolygons(pathes){
        // только полигоны
        var polygons = [];
        // отбираем из путей только полигоны
        // рассматриваем пути не менее 4х точек
        for (var i=4;i<pathes.length;i++){
            for (var j=0;j<pathes[i].length;j++){
                // если первая и последняя точки пути соседи, значит полигон замкнулся
                if (isNeighbohors(pathes[i][j][0], pathes[i][j][pathes[i][j].length-1]))
                    polygons.push(pathes[i][j]);
            }
        }
        console.log('из них полигоны:');
        console.dir(polygons);
        return polygons.length>0?polygons:false;
    }

    function checkPolygon(polygon){

    }

    function copyDots(dotsArr){
        var copy = [];
        for(var i =0; i<dotsArr.length;i++){
            copy.push({
                x:dotsArr[i].x,
                y:dotsArr[i].y
            });
        }
        return copy;
    }

    function getInnerDots(sortedDots){
        var innerDots = [];
        // // цикл по y = i
        for (var i=sortedDots[0].y+1; i<=sortedDots[sortedDots.length-1].y-1;i++){
            var tmpDots = sortedDots.filter(item => item.y == i);
            // цикл по каждому отрезку
            for (var j = 0; j<tmpDots.length;j=j+2){
                if (tmpDots[j+1]!=undefined){
                    var x1 = tmpDots[j].x;
                    var x2 = tmpDots[j+1].x;
                    while (++x1<x2){
                        innerDots.push({
                            x:x1,
                            y:i
                        });
                    }
                }
            }
        }
        return innerDots;
    }

    function getEatenDots(innerDotsArr, color){
        var res = [];
        innerDotsArr.forEach(dotCoords => {
            var dot = self.getDot(dotCoords.x, dotCoords.y);
            if (dot.getColor()!=color && dot.isActive() && !dot.isEaten()){
                res.push({
                    x:dot.getX(),
                    y:dot.getY()
                });
                dot.setEaten();
                // fieldMatrix[dotCoords.x][dotCoords.y] = 0;
            }
                
        });
        return res;
    }

    // открытые

    
    this.setDot = function(x,y, dot){
        dots[x][y] = dot;
        fieldMatrix[x][y] = dot.getColorCode();
    }

    this.getDot = function(x,y){
        return dots[x][y];
    }

    this.getNeigbohor = function(dotCoords, direction, color){
        var res = false;
        // ЗДЕСЬ МОГУТ БЫТЬ ИСКЛЮЧЕНИЯ!!!!
        // console.dir(dot);
        var x = dotCoords.x;
        var y = dotCoords.y;
        switch (direction){
            case 0: 
                if (y-1>0)
                    res = {x:x, y:y-1};
                break;
        case 1: if (y-1>0 && x+1<width)
                    res = {x:x+1, y:y-1};
                break;
        case 2:if (x+1<width)
                    res = {x:x+1, y:y};
                break;
        case 3:if (y+1<height && x+1<width)
                    res = {x:x+1, y:y+1};
                break;
        case 4:if (y+1<height)
                    res = {x:x, y:y+1};
                break;
        case 5:if (x-1>0 && y+1<height)
                    res = {x:x-1, y:y+1};
                break;
        case 6:if (x-1>0)
                    res = {x:x-1, y:y};
                break;
        case 7:if (x-1>0 && y-1>0)
                    res = {x:x-1, y:y-1};
                break;
        }
        if (!res)
            return false;
        return dots[res.x][res.y].getColorCode()==color?(dots[res.x][res.y].isEaten()?false:res):false;

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



    // попытка построить полигон
    this.trySurround = function(startDot){
        var color = startDot.getColor();
        var pathes = buildPathes(startDot);
        if (pathes){
            var polygons = choosePolygons(pathes);
            // из всех возможных полигонов ищем соответсующий условиям
            // 1 максимальный по колличеству точек
            // 2 захвативший хотя бы 1 врага
            // 3 не покрывающий уже существующие полигоны(окружения) и не пересекающийся с нимим
            for (var i=0;i<polygons.length-1;i++){
                var tmpSurroundingCoords = polygons[i];//координаты рассматриваемого полигона
                // копируем
                var tmpSurroundingCoordsCopy = copyDots(tmpSurroundingCoords);//копия массива, что бы не испортить полигон
                //массив координат, в котором координаты будут отсортированны по у и x              
                var sortedSurrounding = sortXandY(tmpSurroundingCoordsCopy);

                // console.log('полигон с отсортированными вершинами');
                // console.dir(sortedSurrounding);

                //выявляем координаты внутренних точек
                var innerDotsCoords = getInnerDots(sortedSurrounding);

                // console.log('внутренние точки');
                // console.dir(innerDotsCoords);

                var tmpSurrounding = new Surrounding(startDot.getOwner(), color, tmpSurroundingCoords, innerDotsCoords, []);
                var isAlowed = true;
                surroundings.forEach(surrounding =>{
                    if (surrounding.hasIntersectionsWith(tmpSurrounding)){
                        isAlowed = false;
                        // break;
                    }
                })
                if (isAlowed){
                    var eatenDots = getEatenDots(innerDotsCoords, color);
                    if (eatenDots.length>0){
                        tmpSurrounding.setEatenDots(eatenDots);
                        surroundings.push(tmpSurrounding);

                        console.dir(tmpSurrounding);
                        return true;
                    }
                    
                }    
                // фомируем результат
                

                // console.dir(eatenDots);

                // 


                // }
            }
        }
        return false;
        
    }

    this.getLastSurrounding = function(){
        return surroundings[surroundings.length-1] || false;
    }


    this.getRedScore = function(){
        return redScore;
    }

    this.getBlueScore = function(){
        return blueScore;
    }
}