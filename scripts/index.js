
    //по нажатию на кнопку скрываем содержимое
    document.querySelectorAll('button').forEach(function(item, i, arr){
        item.addEventListener('click', function(){
            console.dir(item);
            document.getElementsByClassName('filler')[0].style.display = 'block';
        });
    });

    //по щелчку добавлять в хидден инфу
