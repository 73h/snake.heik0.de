$(function(){
    hSnake18();
    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
    if(isMobile.any()) {
        if (!document.URL.match(/.+mobile.+/i)) {
            document.location='mobile.html';
		}
    }
});
function hSnake18 () {
    
    if (!$('#hSnake18').length) {
        alert('implement an element like this\r\n<div id="hSnake18" data-rows="20" data-cols="20" data-partsize="12" data-themeuri=""></div>');
        return;
    }
    
    if (typeof hSnake18extends == 'function') {
        hSnake18extends.prototype = {
            gameStartStop:gameStartStop,
            snakeLeft:snakeLeft,
            snakeRight:snakeRight,
            snakeUp:snakeUp,
            snakeDown:snakeDown,
            getElement:getElement,
            getSettings:getSettings
        };
    }
    
    function getElement () {
        return element;
    }
    
    function getSettings () {
        return settings;
    }
    
    // Vars
    var element, settings, snake, startText, pauseText, steps, matrix, lastHeadPosition, gameover, direcetionQueue;
    
    // Elements
    var playingArea, infoArea, breakArea, breakAreaInfo, points, flyingPoints, snakeHead, snakePart, snakeFeed, snakeTimeout;
    
    function loadSettings () {
        element = $('#hSnake18');
        settings = {
            rows : element.data('rows')==undefined?20:element.data('rows'),
            cols : element.data('cols')==undefined?20:element.data('cols'),
            partsize : element.data('partsize')==undefined?24:element.data('partsize'),
            themeuri : element.data('themeuri')==undefined?'hSnake18-theme-default.css':element.data('themeuri')
        };
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = settings.themeuri;
        document.getElementsByTagName("head")[0].appendChild(link);
    }
    
    function createGameElements () {
        startText = 'Hast Du Lust auf eine Runde Snake?<br><br>Die Leertaste startet und stoppt das Spiel.<br><br>Die Pfeiltasten steuern die Schlange.<br><br><b>Gutes Spiel!</b>';
        gameOverText = 'Noch eine Runde?<br><br>Die Leertaste startet und stoppt das Spiel.<br><br>Die Pfeiltasten steuern die Schlange.<br><br><b>Gutes Spiel!</b>';
        pauseText = '<b>.. Pause ..</b>';
        playingArea = $('<div class="hSnake18-playing-area"></div>');
        infoArea = $('<div class="hSnake18-info-area hSnake18-font"></div>');
        breakArea = $('<div class="hSnake18-break-area"></div>');
        breakAreaInfo = $('<div class="hSnake18-font"></div>');
        points = $('<div></div>');
        flyingPoints = $('<div class="hSnake18-flying-points hSnake18-font"></div>');
        inGameInfo = $('<div></div>');
        snakeHead = $('<div class="hSnake18-snake-head"></div>');
        snakePart = $('<div class="hSnake18-snake-part"></div>');
        snakeFeed = $('<div class="hSnake18-snake-feed"></div>');
        element.append([playingArea,infoArea]);
        playingArea.append(breakArea);
        breakArea.append(breakAreaInfo);
        breakAreaInfo.html(startText);
        infoArea.html(['Punkte: ',points,inGameInfo]);
        //setInGameInfo('created outside of work', false);
    }
    
    function styleGameElements () {
        element.addClass('hSnake18-border');
        element.css({
            display:'inline-block',
            position:'relative'
        });
        playingArea.css({
            width:settings.cols*settings.partsize+'px',
            height:settings.rows*settings.partsize+'px',
            position:'relative'
        });
        infoArea.css({
            position:'relative',
			fontWeight:'bold',
			textAlign:'left'
        });
        breakArea.css({
            position:'absolute',
            top:0+'px',
            left:0+'px',
            width:(settings.cols-0)*settings.partsize+'px',
            height:(settings.rows-0)*settings.partsize+'px',
            opacity:0.5,
            textAlign:'center',
            display:'table',
            zIndex:10
        });
        breakAreaInfo.css({
            display:'table-cell',
            verticalAlign:'middle'
        });
        points.css({
            display:'inline'
        });
        flyingPoints.css({
            position:'absolute',
            zIndex:9999,
            fontSize:settings.partsize*3+'px',
            fontWeight:'bold',
            opacity:0.8
        });
        flyingPoints.hide();
        inGameInfo.css({
            float:'right',
            whiteSpace:'nowrap',
			fontWeight:'normal'
        });
        snakeHead.css({
            width:settings.partsize+'px',
            height:settings.partsize+'px',
            position:'absolute',
            zIndex:5
        });
        snakePart.css({
            width:settings.partsize+'px',
            height:settings.partsize+'px',
            position:'absolute',
            zIndex:4
        });
        snakeFeed.css({
            width:settings.partsize+'px',
            height:settings.partsize+'px',
            position:'absolute',
            zIndex:3
        });
    }
    
    function loadKeyEvents () {
        $(document).keydown(function(e){
            switch (e.which) {
                case 32: case 27: gameStartStop(); break;
                case 37: case 65: case 100: snakeLeft(); break;
                case 39: case 68: case 102: snakeRight(); break;
                case 38: case 87: case 104: snakeUp(); break;
                case 40: case 83: case 98: snakeDown(); break;
            }
        });
    }
    
    function gameStartStop () {
        if (gameover) {
            initializeGame();
        }
        if (snake.run === 0 || snake.run === 2) {
            breakArea.fadeOut(200);
            snake.run = 1;
            run();
            setInGameInfo('Leertaste für Pause', false);
        } else {
            snake.run = 2;
            breakAreaInfo.html(pauseText);
            breakArea.fadeIn(200);
        }
    }
    
    function snakeLeft () {
		snakeStep(1,3);
    }
    
    function snakeRight () {
		snakeStep(3,1);
    }
    
    function snakeUp () {
		snakeStep(2,0);
    }
    
    function snakeDown () {
		snakeStep(0,2);
    }
	
    function snakeStep (falseDir, dir) {
        if (snake.run != 1) return;
		if (direcetionQueue.length == 0 && snake.direction === dir) {
			run(true);
		} else {
			var lastDir = direcetionQueue.length==0?snake.direction:direcetionQueue[direcetionQueue.length-1];
			if (lastDir !== dir && lastDir !== falseDir) {
				direcetionQueue.push(dir);
			}
		}
    }
	
    function addPoints (num, top, left) {
        if (num==null) {
            points.html(0);
            return;
        }
        var temp_flyingPoints = flyingPoints.clone();
        element.append(temp_flyingPoints);
        temp_flyingPoints.css({
            top:top,
            left:left
        });
        temp_flyingPoints.html(num);
        temp_flyingPoints.show(200, function(){
			$(this).animate({
				top:settings.rows*settings.partsize+'px',
				left:parseInt(infoArea.css('font-size'),10)*6+'px',
				fontSize:infoArea.css('fontSize'),
				opacity:0.2
			}, 1000, function(){
				points.html(points.html()-0+num);
				$(this).remove();
			});
        });
    }
    
    function setInGameInfo (str, withAnimate) {
        inGameInfo.css({
            opacity:1.0
        }).html(str);
        if (withAnimate) {
            inGameInfo.animate({
                opacity:0.0
            },3000);
        }
    }
    
    function run (withoutRun) {
		if (!withoutRun) withoutRun = false;
		if (withoutRun) window.clearTimeout(snakeTimeout);
        if (snake.run === 2 || gameover) return;
        var eating = false;
        var newHeadPosition = lastHeadPosition;
		if (!withoutRun && direcetionQueue.length > 0) {
			snake.direction = direcetionQueue.shift();
		}
        switch (snake.direction) {
            case 0:
                if (lastHeadPosition%settings.rows == 0) {
                    gameOver();
                    return;
                }
                newHeadPosition -= 1;
                break;
            case 1:
                if (lastHeadPosition >= settings.rows * (settings.cols-1)) {
                    gameOver();
                    return;
                }
                newHeadPosition += settings.rows;
                break;
            case 2:
                if (lastHeadPosition%settings.rows == settings.rows-1) {
                    gameOver();
                    return;
                }
                newHeadPosition += 1;
                break;
            case 3:
                if (lastHeadPosition < settings.rows) {
                    gameOver();
                    return;
                }
                newHeadPosition -= settings.rows;
                break;
        }
        var time = 400-snake.parts.length*(1000/(settings.cols*settings.rows));
        if (time < 200) time = 200;
        if (matrix[newHeadPosition] != null) {
            if (matrix[newHeadPosition].factor) {
                var points = Math.ceil((matrix[newHeadPosition].factor>1?3:1)*20/((new Date().getTime()-matrix[newHeadPosition].time)/500))-0;
                if (points > 30) points = 30;
                if (points > 10) {
                    var congratulations = ['Super..','Weiter so..','Fette Punkte..','YEEEHAA..','Du bist gut..'];
                    setInGameInfo(congratulations[Math.floor(Math.random()*congratulations.length)], true);
                }
                addPoints(points, getTopFromMatrixPosition(newHeadPosition), getLeftFromMatrixPosition(newHeadPosition));
                matrix[newHeadPosition].element.remove();
                matrix[newHeadPosition] = null;
                var new_snakePart = snakePart.clone();
                new_snakePart.data('position',lastHeadPosition);
                setPositionFromMatrixIndex(new_snakePart, lastHeadPosition);
                matrix[lastHeadPosition] = new_snakePart;
                playingArea.append(new_snakePart);
                snake.parts.push(new_snakePart);
                eating = true;
            } else {
                gameOver();
                return;
            }
        }
        if (snake.parts.length > 0) {
            var last_snakePart = snake.parts.shift();
            setPositionFromMatrixIndex(last_snakePart, lastHeadPosition);
            matrix[lastHeadPosition] = last_snakePart;
            matrix[last_snakePart.data('position')] = null;
            last_snakePart.data('position',lastHeadPosition);
            snake.parts.push(last_snakePart);
        } else {
            matrix[lastHeadPosition] = null;
        }
        setPositionFromMatrixIndex(snakeHead, newHeadPosition);
        lastHeadPosition = newHeadPosition;
        matrix[newHeadPosition] = snakeHead;
        steps++;
        if (eating)
            setFeed();
		snakeTimeout = window.setTimeout(run, time);
    }
    
    function gameOver () {
        gameover = true;
        setInGameInfo('Schade .. Game over!', false);
        breakAreaInfo.html(gameOverText);
        breakArea.fadeIn(200);
    }

    function initializeGame () {
		snakeTimeout = null;
		direcetionQueue = [];
        gameover = false;
        steps = 0;
        $('.hSnake18-snake-feed-special,.hSnake18-snake-feed,.hSnake18-snake-part,.hSnake18-snake-head').remove();
        matrix = [];
        for (i=0;i<settings.rows*settings.cols;i++) {
            matrix.push(null);
        }
        snake = {
            run : 0,
            parts : [],
            direction : 3
        };
        var startTop = Math.floor(settings.rows/5);
        var startLeft = settings.cols-Math.floor(settings.cols/4);
        lastHeadPosition = getMatrixIndexFromPositon(startTop,startLeft);
        matrix[lastHeadPosition] = snakeHead;
        setPositionFromMatrixIndex(snakeHead, lastHeadPosition);
        playingArea.append(snakeHead);
        addPoints(null);
        setFeed();
    }
    
    function setFeed() {
        var new_freePositon = getFreePosition();
        if (new_freePositon === false) {
            gameEnd();
        } else {
            var new_snakeFeed = snakeFeed.clone();
            setPositionFromMatrixIndex(new_snakeFeed, new_freePositon);
            var factor = Math.ceil(Math.random()*1.15);
            if (factor > 1) {
                new_snakeFeed.removeClass('hSnake18-snake-feed').addClass('hSnake18-snake-feed-special');
            }
            new_feed = {
                element: new_snakeFeed,
                expired: false,
                factor: factor,
                time: new Date().getTime(),
                age: steps
            };
            matrix[new_freePositon] = new_feed;
            playingArea.append(new_snakeFeed);
        }
    }
    
    function setPositionFromMatrixIndex (element, index) {
        var new_position = {
            top:getTopFromMatrixPosition(index),
            left:getLeftFromMatrixPosition(index)
        };
        element.css(new_position);
    }
    
    function getTopFromMatrixPosition (index) {
        return (index%settings.rows)*settings.partsize+'px';
    }
    
    function getLeftFromMatrixPosition (index) {
        return (Math.floor(index/settings.rows))*settings.partsize+'px';
    }
    
    function getMatrixIndexFromPositon (top, left) {
        return left * settings.rows + top;
    }
    
    function getFreePosition () {
        var freePositions = [];
        $.each(matrix, function(i,pos){
            if (pos === null) {
                freePositions.push(i);
            }
        });
        if (freePositions.length == 0) return false;
        var freePosition = freePositions[Math.floor(Math.random()*freePositions.length)];
        return freePosition;
    }
    
    loadSettings();
    createGameElements();
    styleGameElements();
    loadKeyEvents();
    initializeGame();
    
    //function _(obj) {
    //    alert(JSON.stringify(obj));
    //}
    
}