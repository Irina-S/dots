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
                //выясняем координаты щелчка
                var x = +this.node.dataset.x;
                var y = +this.node.dataset.y;
                // меняем статус точки, по которой был щелчек
                console.log(field.getCurMoveColor());
                // сообщаем точке цвет
                console.log(document.getElementById('dot_color').value);
                if (document.getElementById('dot_color').value==RED_COLOR){
                    field.getDot(x,y).setRedColor();
                    field.getDot(x,y).setActive(document.getElementById('my-name').innerHTML);
                }
                else{
                    field.getDot(x,y).setBlueColor();
                    field.getDot(x,y).setActive(document.getElementById('opponent-name').innerHTML);
                }

                // уменьшаем кол-во точек
                field.decFreeDots(1);
                // поппытка построить полигон
                if (field.trySurround(field.getDot(x,y))){
                    var polygon = field.getLastSurrounding().getPolygonCoords();
                    var polygonSVGcoords = [];
                    for (var i=0;i<polygon.length;i++){
                        // копировать несортированные коордиаты
                        var polyX = polygon[i].getX()*w;
                        var polyY = polygon[i].getY()*h;
                        polygonSVGcoords.push(polyX);
                        polygonSVGcoords.push(polyY);
                    }
                    var polygon = field_svg.polygon(polygonSVGcoords);
                    polygon.node.classList = document.getElementById('dot_color').value==RED_COLOR?"red":"blue";
                    console.dir(polygon);
                    console.dir(polygonSVGcoords);
                    console.dir(polygon);
                }
                    
                if (document.getElementById('dot_color').value==RED_COLOR){
                    field.recalcScores(RED_COLOR);
                    document.getElementById('red-scores').innerHTML = field.getRedScore();
                }
                else if (document.getElementById('dot_color').value==BLUE_COLOR){
                    field.recalcScores(BLUE_COLOR);
                    document.getElementById('red-scores').innerHTML = field.getBlueScore();
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