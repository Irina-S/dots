function getCoords(arr_2d, value){
    var res = [];
    for (var i=1;i<arr_2d.length;i++){
        for (var j=1; j<arr_2d[i].length;j++){
            if (arr_2d[i][j]==value){
                res.push({
                    x:i,
                    y:j
                })
            }
        }
    }
    return res;
}

function wave(from, to){
    var UNCPROCESSED = -1;
    var IMPASSABLE = -2;
    var TARGET = -3;
    // записываем точки пути
    var path = [];
    //из чьих точек строит полигон
    var owner = from.getOwner();
    // откуда волна
    var x1 = from.getX();
    var y1 = from.getY();
    // куда 
    var x2 = to.getX();
    var y2 = to.getY();
    // формируем матрицу поля
    var field_matrix = [];
    var n_dots = 0;
    for(var i=1;i<width;i++){
        field_matrix[i] = [];
        for(var j=1;j<height;j++){
            //пустые клетки и чужие точки считаем за непроходимые препятсвия
            // console.dir('точка')
            // console.log({x:i, y:j});
            // console.dir(dots[i][j].isActive());
            // console.dir(dots[i][j].getOwner()!=owner)
            if (!dots[i][j].isActive() || dots[i][j].getOwner()!=owner){
                // обозначим непроходимые клетки числом IMPASSABLE
                field_matrix[i][j] = IMPASSABLE
                

            }
            // а необработанные числом UNCPROCESSED
            else{
                field_matrix[i][j] = UNCPROCESSED;
                n_dots++;
            }
                
        }
    }
    console.log('матрица поля');
    console.dir(field_matrix);
    console.dir('от')
    console.log({x:x1, y1:x1});
    console.dir('до')
    console.log({x:x2, y1:y2});


    // начало алгоритма
    // Инициализация
    var d = 0;
    field_matrix[x1][y1] = d;// помечаем стартовую ячейку 0
    // помечаем цель большим числом, т.к. отриц. числами помечаются необработанные и непроходимые ячейки
    field_matrix[x2][y2] = TARGET;
    // Распространение волны
    if (n_dots!=0){
        do{
            var waveSpreadPossible = false; // есть возможность распространения волны(изначально нет)
            //ДЛЯ каждой ячейки loc, помеченной числом d
            var points = getCoords(field_matrix, d);// получаем ее координтаты
            var coords;
            while (coords = points.pop()){
                console.log('ячейка найдена');
                var x = coords.x;
                var y = coords.y;
                // пометить все соседние свободные непомеченные ячейки числом d + 1
                // рассматриваем ее окрестности
                // НУЖНО МОДИФИЦИРОВАТЬ АЛГОРИТМ ЧТО Б ОН ИСКАЛ ДЛИННЕЙШИЙ ПУТЬ
                //рассматриваются только необработанные ячейки, либо ячейки по которым можно пострить путь подлиннее
                field_matrix[x][y-1]==UNCPROCESSED || (!field_matrix[x][y-1]<d-1 && d+1)
                if (y-1>0) //проверка на существование такой ячейки
                    if (field_matrix[x][y-1]==UNCPROCESSED){//проверка ячейки на проходимость
                        field_matrix[x][y-1] = d+1;
                        waveSpreadPossible = true;
                        console.log('волна распространяется');
                    } 
                                
                if (y-1>0 && x+1<width)
                    if (field_matrix[x+1][y-1]==UNCPROCESSED){
                        field_matrix[x+1][y-1] = d+1;
                        waveSpreadPossible = true;
                        console.log('волна распространяется');
                    }                                   
                if (x+1<width)
                    if (field_matrix[x+1][y]==UNCPROCESSED){
                        field_matrix[x+1][y] = d+1;
                        waveSpreadPossible = true;
                        console.log('волна распространяется');
                    }
                                                
                if (y+1<height && x+1<width)
                    if (field_matrix[x+1][y+1]==UNCPROCESSED){
                        field_matrix[x+1][y+1] = d+1;
                        waveSpreadPossible = true;
                        console.log('волна распространяется');
                    }                                    
                if (y+1<height)
                    if (field_matrix[x][y+1]==UNCPROCESSED){
                        field_matrix[x][y+1] = d+1;
                        waveSpreadPossible = true;
                        console.log('волна распространяется');
                    }                                    
                if (x-1>0)
                    if (field_matrix[x-1][y]==UNCPROCESSED){
                        field_matrix[x-1][y] = d+1;
                        waveSpreadPossible = true;
                        console.log('волна распространяется');
                    }            
                if (x-1>0 && y-1>0)
                    if (field_matrix[x-1][y-1]==UNCPROCESSED){
                        field_matrix[x][y-1] = d+1;
                        waveSpreadPossible = true;
                        console.log('волна распространяется');
                    }
            }
            d++;       
            console.log(d);  
            console.log(field_matrix[x2][y2]==TARGET);
            console.log(waveSpreadPossible);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
        } // ПОКА (финишная ячейка не помечена) И (есть возможность распространения волны)
        while (field_matrix[x2][y2]==TARGET && waveSpreadPossible);
    }


    console.dir(field_matrix);
    // ЕСЛИ финишная ячейка помечена
    field_matrix[x2][y2] = d+1;
    if(field_matrix[x2][y2]!=TARGET){
             // ТО
            //   перейти в финишную ячейку
            var x = x2;
            var y = y2;
            path.push({
                x:x,
                y:y
            });
            //   ЦИКЛ
            do{
                //     выбрать среди соседних ячейку, помеченную числом на 1 меньше числа в текущей ячейке
                switch (field_matrix[x][y]-1){
                    case field_matrix[x][y-1]:
                        y--;
                        break;
                    case field_matrix[x+1][y-1]:
                        x++;
                        y--;
                        break;
                    case field_matrix[x+1][y]: 
                        x++;
                        break;
                    case field_matrix[x+1][y+1]:
                        x++;
                        y++;
                        break;
                    case field_matrix[x][y+1]:
                        y++;
                        break;
                    case field_matrix[x-1][y+1]: 
                        x--;
                        y++;
                        break;
                    case field_matrix[x-1][y]: 
                        x--;
                        break;
                    case field_matrix[x-1][y-1]:    
                        x--;
                        y--;  
                        break;  
                }
                //     перейти в выбранную ячейку и добавить её к пути
                path.push({
                    x:x,
                    y:y
                });
            } while(x!=x1 && y1!=y);
            //   ПОКА текущая ячейка — не стартовая
            //   ВОЗВРАТ путь найден 
            return path;
    }
    // ИНАЧЕ
    else{
        //   ВОЗВРАТ путь не найден
        return path;
    }
        
        
}