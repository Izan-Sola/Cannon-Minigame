$(document).ready(function () {

    //*trynna learn some math lol

    function drawCurvedLine(shoot) {
        var startPosition = $('#start-point').position();
        var endPosition = $('#end-point').position();
        let doBreak = false
        // Define points (P₀ = start, P₂ = end)
        P0 = { x: startPosition.left, y: startPosition.top };
        P2 = { x: endPosition.left, y: endPosition.top };

        // Control point (P₁) - adjust this to change the curve shape
        P1 = {
            x: (P0.x + P2.x) / 2,  // Midpoint X
            y: (P0.y + P2.y) / 2 + -400  // Adjust Y for curvature
        };
   // Number of points to draw (more points = smoother curve)
        steps = 60;
        
        // Draw the curve (e.g., using canvas or just logging points)
        for (let t = 0; t <= 1; t += 1 / steps) {

            setTimeout(() => {
                if(doBreak) return
            // Apply Bézier formula
            let x = Math.pow(1 - t, 2) * P0.x + 2 * (1 - t) * t * P1.x + Math.pow(t, 2) * P2.x;
            let y = Math.pow(1 - t, 2) * P0.y + 2 * (1 - t) * t * P1.y + Math.pow(t, 2) * P2.y;
   
            if (shoot) {
                $('#cannon-ball').css({ top: y, left: x });
                point = $('#cannon-ball')
                pointBound = document.getElementById('cannon-ball').getBoundingClientRect()
            } else {
                point = $('#test-point').clone().appendTo('#container')
                point.addClass('removable').css({ left: x.toFixed(1), top: y.toFixed(1) });
                point.addClass(`${t}`)
                pointBound = document.getElementsByClassName(t) 
                pointBound = pointBound[0].getBoundingClientRect()
             //   console.log(pointBound)
            }
         //   console.log($(a).position())
    
            
         //console.log(`Point at t=${t.toFixed(2)}: (${x.toFixed(1)}, ${y.toFixed(1)})`);
       
        $('.collision-object').each(function (index, element) { 
           
            elementBound = element.getBoundingClientRect()
            const horizontalCollision = pointBound.right >= elementBound.left && pointBound.left <= elementBound.right
            const verticalCollision = pointBound.bottom >= elementBound.top && pointBound.top <= elementBound.bottom
        
            if(horizontalCollision && verticalCollision) {
                console.log('COLLISION POINT WITH OBJECT') 
                doBreak = true
            }
        });
        }, t * 400)

     
        }

    }
    
    $(document).on('keydown', function move(k) {

        var pos = $('#end-point').position();
        var top = pos.top;
        var left = pos.left;

        $('.removable').each(function (index, element) { $(element).remove() });

        k.stopPropagation()

        switch(k.key) {
            case 'w': $('#end-point').css('top', top-10); break
            case 'a': $('#end-point').css('left', left-10); break
            case 's': $('#end-point').css('top', top+10); break
            case 'd': $('#end-point').css('left', left+10); break
            case ' ': drawCurvedLine(true); break
        }
    
        if(k.key !== ' ') drawCurvedLine();
        
    })

})