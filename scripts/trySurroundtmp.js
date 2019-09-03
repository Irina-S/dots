

// вспомогательная функция, проверяющая на равенство координтаы



// function restorePolygonDots(dotsArr){
//     var res = [];
//     dotsArr.forEach(dotCoords => {
//         var dot = self.getDot(dotCoords.x, dotCoords.y);
//         res.push(dot);
//     });
//     return res;
// }


// 



// var tmpSurroundingCoords = polygons[polygons.length-1];


console.log('итоговый полигон:');
console.dir(tmpSurroundingCoords);

// из всех возможных полигонов ищем соответсующий условиям
// 1 максимальный по колличеству точек
// 2 захвативший хотя бы 1 врага
// 3 не покрывающий уже существующие полигоны(окружения) и не пересекающийся с нимим
for (var k=polygons.length-1;k>=0;k--){
    var tmpSurroundingCoords = polygons[i];//координаты рассматриваемого полигона
    
    var tmpSurroundingCoordsCopy = copyDots(tmpSurroundingCoords);//копия массива, что бы не испортить полигон

    // копируем
    var sortedSurrounding = sortXandY(tmpSurroundingCoordsCopy);//массив координат, в котором координаты будут отсортированны по у, 
                                //а при равных y по x
    // console.log('полигон с отсортированными вершинами');
    // console.dir(sortedSurrounding);

    //выявляем координаты внутренних точек
    var innerDotsCoords = getInnerDots(sortedSurrounding);

    
    // console.log('внутренние точки');
    // console.dir(innerDotsCoords);

    // фомируем результат
    var eatenDots = getEatenDots(innerDotsCoords, color);
    // console.dir(eatenDots);
    if (polygonDots && eatenDots.length>0){

        var tmpSurrounding = new Surrounding(startDot.getOwner(), color, polygonDots, innerDotsCoords, eatenDots);
        var isAlowed = true;
        surroundings.forEach(surrounding =>{
            if (surrounding.hasIntersectionsWith(tmpSurrounding)){
                isAlowed = false;
                // break;
            }
        })
        if (isAlowed){
            surroundings.push(tmpSurrounding);
            return true;
        }
            
    }

}
return false;

    // возвращает соседа в указанном направлении заданного цвета
    // this.getSameColorNeigbohor = function(dot, direction, color){
    //     var dot = self.getNeigbohor(dot, direction);

    //     if (dot)
    //         if (dot.getColor()==color)
    //             return dot;
    //     return false;
    // }

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

        // возвращает соседа в указанном направлении, или false в случае его отсутсвия или ошибки
    // this.getNeigbohor = function(dot, direction){
    //     var res = false;
    //     // ЗДЕСЬ МОГУТ БЫТЬ ИСКЛЮЧЕНИЯ!!!!
    //     // console.dir(dot);
    //     var x = dot.getX();
    //     var y = dot.getY();
    //     switch (direction){
    //         case 0: 
    //             if (y-1>0)
    //                 res = dots[x][y-1];
    //             break;
    //     case 1: if (y-1>0 && x+1<width)
    //                 res = dots[x+1][y-1];
    //             break;
    //     case 2:if (x+1<width)
    //                 res = dots[x+1][y];
    //             break;
    //     case 3:if (y+1<height && x+1<width)
    //                 res = dots[x+1][y+1];
    //             break;
    //     case 4:if (y+1<height)
    //                 res = dots[x][y+1];
    //             break;
    //     case 5:if (x-1>0 && y+1<height)
    //                 res = dots[x-1][y+1];
    //             break;
    //     case 6:if (x-1>0)
    //                 res = dots[x-1][y];
    //             break;
    //     case 7:if (x-1>0 && y-1>0)
    //                 res = dots[x-1][y-1];
    //             break;
    //     }
    //     return res;
    // }

    this.disableEatenDots = function(coords){
        var score = 0;
        coords.forEach(coord =>{
            self.getDot(coord.getX(), coord.getY()).setEaten();
            score++;
        });
        return score;
    }