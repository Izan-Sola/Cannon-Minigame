$(document).ready(function () {
    shoot = false
    bounceCount = 0
    let curveTimeouts = []
  
    function cancelCurve() {
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

        steps = 60;

        for (let t = 0; t <= 1; t += 1 / steps) {
            let timeoutId = setTimeout(() => {
                if (doBreak) return
                bezierCurve(P0, P1, t)
                checkCollisions()
            }, t * 600)
            curveTimeouts.push(timeoutId)
        }
    }

    function checkCollisions() {
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
                    cancelCurve()
                    bounceCount+=1
                    ballBounce(element, distance)
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
        console.log(distance)
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

    function ballBounce(object, distance) {
    
        rotation = Math.abs($(object).css('rotate').split('deg')[0])
        bounceFactorX = ((distance/100)*1.5)
        bounceFactorY = bounceFactorX*1.25
        console.log(rotation, bounceFactorY)

        direction = $(object).attr('id').split('-')[1]
        var position = $('#cannon-ball').position();

        P0 = { x: position.left, y: position.top }

        switch (direction) {
            case 'right':
                
              //  P2 = { x: (P0.x / (bounceFactorX+(rotation/10)))-bounceCount, y: (P0.y * (bounceFactorY/(rotation/25))) }; break
            case 'left':
             //   P2 = { x: (P0.x * (bounceFactorX+(rotation/10)))-bounceCount, y: (P0.y * (bounceFactorY/(rotation/25))) }; break
        }
        //P2 = {x: P0.x , y:}
        P1 = {
            x: (P0.x + P2.x) / 2,
            y: (P0.y + P2.y) / 2 - 150
        };
        step = 80*(bounceCount*2)
        console.log(step+"steps")
        for (let t = 0; t <= 1.25; t += 1 / step) {
            let timeoutId = setTimeout(() => {
                bezierCurve(P0, P1, t)
                checkCollisions()
            }, t * 600)
            curveTimeouts.push(timeoutId)
        }
    }

    $(document).on('keydown', function move(k) {
        var pos = $('#end-point').position();
        var top = pos.top;
        var left = pos.left;

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
