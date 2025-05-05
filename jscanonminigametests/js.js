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
                
                if (shoot) {
                    if (!bouncedElements.includes(element)) {
                        cancelCurve()
                        ballBounce(element)
                        console.log('bounce here', element, bounceCount)
                    }
                    bouncedElements.push(element)
                }
            }
        });
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

    function ballBounce(object) {
        direction = $(object).attr('id').split('-')[1]
        var position = $('#cannon-ball').position();
        console.log(object)

        P0 = { x: position.left, y: position.top }

        switch (direction) {
            case 'right':
                P2 = { x: (position.left / 5), y: (position.top * 2) }; break
            case 'left':
                P2 = { x: (position.left * 5), y: (position.top * 2) }; break
        }

        P1 = {
            x: (P0.x + P2.x) / 2,
            y: (P0.y + P2.y) / 2 - 150
        };

        for (let t = 0; t <= 1; t += 1 / 60) {
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
