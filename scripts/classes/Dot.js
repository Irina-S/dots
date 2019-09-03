import {RED_COLOR, BLUE_COLOR} from './game-consts.js'
/**
 * Конструктор класса Точка
 * 
 * @constructor 
 * 
 * @param {*} x координата по x 
 * @param {*} y координата по y
 */
export function Dot(x, y){
    // константы цветов 
    //ЗАКРЫТЫЕ СВОЙСТВА
    //координаты
    var x = x;
    var y = y;
    //статус
    var status = 'inactive';
    // цвет
    var color = '';
    // кому принадлежит
    var owner = '';
    // ВОЗМОЖНО НУЖНО ДОБАВИТЬ СВОЙСТВА ОБ УЧАСТИИ ТОЧКИ В ОКРУЖЕНИИ

    //ОТКРЫТЫЕ СВОЙСТВА
    //svg элемент представляющий эту точку
    this.svg = '';

    //МЕТОДЫ
    /**
     * Возврат X
     */
    this.getX = function(){
        return x;
    }

     /**
     * Возврат Y
     */
    this.getY = function(){
        return y;
    }

    /**
     * Возврат статуса
     */
    this.getStatus = function(){
        return status;
    }

    /**
     * Возврат имени владельца
     */
    this.getOwner = function(){
        return owner;
    }

    /**
     * Устанавливает статус в активный
     * 
     * @param owner_name имя влядельца
     */
    this.setActive = function(owner_name){
        status = 'active';
        owner = owner_name;
    }


    /**
     * Устанавливает статус в недоступный(точка захваченна)
     */
    this.setEaten = function(){
        status = 'eaten';
    }

    /**
     * Проверяет активнали точка
     */
    this.isActive = function(){
        return status == 'active';
    }

    /**
     * Проверяет окруженна ли точка
     */
    this.isEaten = function(){
        return status == 'eaten';
    }

    /**
     * Установка точки в красный цвет
     */
    this.setRedColor = function(){
        color = RED_COLOR;
    }

    /**
     * Установка точки в синий цвет
     */
    this.setBlueColor = function(){
        color = BLUE_COLOR;
    }

    /**
     * Возврат цвета точки
     */
    this.getColor = function(){
        return color;
    }

    this.getColorCode = function(){
        return color==RED_COLOR?1:(color==BLUE_COLOR?-1:0);
    }

}