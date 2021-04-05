var hSnake18extends = function () {};
$(function(){
    var obj = new hSnake18extends();
    //obj.gameStartStop();
    var game = false;
    var width = obj.getSettings().cols * obj.getSettings().partsize;
    var height = obj.getSettings().rows * obj.getSettings().partsize;
    if (!game) {
        var div = $('<div></div>');
        var drittel = (obj.getSettings().cols+obj.getSettings().rows)/2*obj.getSettings().partsize/3;
        var drittel_w = obj.getSettings().cols*obj.getSettings().partsize/3;
        var drittel_h = obj.getSettings().rows*obj.getSettings().partsize/3;
        div.css({
            position:'absolute',
            backgroundColor:'#000',
            opacity:0.5,
            borderRadius:drittel/2+'px',
            zIndex:'50',
            width:drittel_w+'px',
            height:drittel_h+'px',
            top:'0px',
            left:'0px'
        });
        var divs = [
            div.clone().css({top:'0px',left:drittel_w+'px'}),
            div.clone().css({top:drittel_h*2+'px',left:drittel_w+'px'}),
            div.clone().css({top:drittel_h+'px',left:'0px'}),
            div.clone().css({top:drittel_h+'px',left:drittel_w*2+'px'}),
        ];
        obj.getElement().append(divs);
        $.each(divs, function(i,n){
            n.animate({
                opacity:0.1
            },1000);
        });
    }
    obj.getElement().click(function(event){
        var left = event.pageX-$(this).position().left;
        var top = event.pageY-$(this).position().top;
        if (!game) {
            obj.gameStartStop();
            game = true;
            return;
        }
        if (left < width/3 && top > height/3 && top < (height-height/3)) {
            obj.snakeLeft();
        } else if (left > (width-width/3) && top > height/3 && top < (height-height/3)) {
            obj.snakeRight();
        } else if (top < height/3 && left > width/3 && left < (width-width/3)) {
            obj.snakeUp();
        } else if (top > (height-height/3) && left > width/3 && left < (width-width/3)) {
            obj.snakeDown();
        } else {
            obj.gameStartStop();
        }
    });
    
});
