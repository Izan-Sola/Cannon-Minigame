$(document).ready(function () {
    shoot = false
    bounceCount = 0
    let curveTimeouts = []
  
   $('.s').draggable({
    axis: 'x, y',
    cursor: 'crosshair',
    containment: 'parent'
   });
   $('#collision-left').draggable({
    axis: 'x, y',
    cursor: 'crosshair',
    containment: 'parent'
   });
    function clearTimeouts() {
        for (let id of curveTimeouts) clearTimeout(id)
        curveTimeouts = []
    }

    function drawCurvedLine() {
        bounceCount = 0
        bouncedElements = []
        
        var startPosition = $('#start-point').position();
        var endPosition = $('#end-point').position();
        bouncedElements.push($('#start-point'))
        doBreak = false

        P0 = { x: startPosition.left, y: startPosition.top };
        P2 = { x: endPosition.left, y: endPosition.top };

        P1 = {
            x: (P0.x + P2.x) / 2,
            y: (P0.y + P2.y) / 2 - 400
        };
        
        steps = 90+ getDistance($('#start-point'), $('#end-point'))/5
        if(shoot) {
            steps=steps*10
           
        }
        for (let t = 0; t <= 1; t += 1 / steps) {
      
            let timeoutId = setTimeout(() => {
                if (doBreak) return
                bezierCurve(P0, P1, t)
                ballPos = $('#cannon-ball').position()
                P3 = { x: ballPos.left, y: ballPos.top }
                checkCollisions(P1, P3)
            }, t * 600)
            curveTimeouts.push(timeoutId)
        }
    }

    function checkCollisions(PeakP1, PeakP2) {
        $('.collision-object').each(function (index, element) {
            elementBound = element.getBoundingClientRect()
            const horizontalCollision = pointBound.right >= elementBound.left && pointBound.left <= elementBound.right
            const verticalCollision = pointBound.bottom >= elementBound.top && pointBound.top <= elementBound.bottom

            if (horizontalCollision && verticalCollision) {
                doBreak = true
                
                if (shoot && !bouncedElements.includes(element)) {
                    bouncedElements.push(element) 
                    if(bouncedElements.length > 2) bouncedElements.shift()
                    if(bouncedElements.length == 2) distance = getDistance(bouncedElements[0], bouncedElements[1])
                    clearTimeouts()
                    bounceCount+=1
                    peakDistance = (Math.abs(PeakP1.y - PeakP2.y))
                    console.log(peakDistance)
                    ballBounce(element, distance, peakDistance)
                    // console.log('bounce here', element, bounceCount)
                      
                }
            }
        });
    }

    function getDistance(firstPoint, secondPoint) {

        var firstPos = $(firstPoint).position();
        var secondPos = $(secondPoint).position();
 
        distanceX = Math.abs(firstPos.left - secondPos.left)
        distanceY = Math.abs(firstPos.top - secondPos.top)
        distance = Math.sqrt(distanceX*distanceX + distanceY*distanceY)


        return distance
    }

    function bezierCurve(P0, P1, t) {
        let x = Math.pow(1 - t, 2) * P0.x + 2 * (1 - t) * t * P1.x + Math.pow(t, 2) * P2.x;
        let y = Math.pow(1 - t, 2) * P0.y + 2 * (1 - t) * t * P1.y + Math.pow(t, 2) * P2.y;

        if (shoot) {
            $('#cannon-ball').css({ top: y, left: x });
            point = $('#cannon-ball')
            pointBound = document.getElementById('cannon-ball').getBoundingClientRect()
        } else {
            point = $('#test-point').clone().appendTo('#container')
            point.addClass('removable').css({ left: x, top: y });
            point.addClass(`${t}`)
            pointBound = document.getElementsByClassName(t)
            pointBound = pointBound[0].getBoundingClientRect()
        }
    }

    function ballBounce(object, distance, peakDistance) {
        console.log(peakDistance)
        rotation = Math.abs($(object).css('rotate').split('deg')[0])
        bounceFactorX = rotation/10 - bounceCount
        bounceFactorY = (peakDistance/200) / (bounceCount>1 ? bounceCount/2 : 1)

        direction = $(object).attr('id').split('-')[1]
        var position = $('#cannon-ball').position();

        P0 = { x: position.left, y: position.top }
        if(bounceFactorX<1) bounceFactorX+=1
        if(bounceFactorY<1) bounceFactorY+=1
    

        switch (direction) {
            case 'right':          
              P2 = { x: P0.x * bounceFactorX, y: P0.y / bounceFactorY }; break
            case 'left':
              P2 = { x: P0.x / bounceFactorX, y: P0.y / bounceFactorY }; break
        }

    //    P2 = {x: P0.x / (bounceFactorX+(rotation/10)), y: P0.y * (bounceFactorY/(rotation/25))}
        P1 = {
            x: (P0.x + P2.x) / 2,
            y: (P0.y + P2.y) / 2 - 150
        };

        console.log("BOUNCEFACTORY: "+bounceFactorY+ "  BOUNCEFACTORX: "+bounceFactorX)

        if(bounceFactorX<1) reverseFactor = Math.abs(P0.x - P2.x)

        step = 90*(bounceCount*2.75)+distance
        for (let t = 0; t <= 2; t += 1 / step) {
            let timeoutId = setTimeout(() => {
                bezierCurve(P0, P1, t)
                checkCollisions(P1, P2)
            }, t * 600)
            curveTimeouts.push(timeoutId)
        }
    }

    $(document).on('keydown', function move(k) {
        var pos = $('#end-point').position();
        var top = pos.top;
        var left = pos.left;
        clearTimeouts()
        $('.removable').each(function (index, element) { $(element).remove() });

        k.stopPropagation()

        switch (k.key) {
            case 'w': $('#end-point').css('top', top - 10); break
            case 'a': $('#end-point').css('left', left - 10); break
            case 's': $('#end-point').css('top', top + 10); break
            case 'd': $('#end-point').css('left', left + 10); break
            case ' ':
                shoot = true
                drawCurvedLine(); break
        }

        if (k.key !== ' ') {
            shoot = false
            drawCurvedLine();
        }
    })
})
