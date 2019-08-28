import {RED_COLOR, BLUE_COLOR} from './game-consts.js'
/**
 * Конструтор класса Окружение
 * 
 * @constructor
 * 
 * @param {*} owner_name имя владельца
 * @param {*} color_code код цвета окружения
 * @param {*} polygonArr координаты точек полигона
 * @param {*} eatenDotsArr координаты захваченных точек
 */
export function Surrounding(owner_name, color_code, polygonArr, eatenDotsArr){
    var owner = owner_name;
    var color = color_code;
    var polygonDots = polygonArr;
    var eatenDots = eatenDotsArr;

    this.svg = '';

    /**
     * Возврат координат точек полигона
     * 
     * @returns массив координат полигона в виде объектов вида {x:x, y:y}
      */
    this.getPolygonCoords=function(){
        return polygonDots;
    }

    /**
     * Возврат координат точек, окруженных полигоном
     * 
     * @returns массив координат захваченных точек в виде объектов вида {x:x, y:y}
      */
    this.getEatenCoords = function(){
        return eatenDots;
    }

    console.dir(owner);
    console.dir(color);
    console.dir(polygonDots);
    console.dir(eatenDots);

}