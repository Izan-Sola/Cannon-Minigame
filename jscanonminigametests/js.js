$(document).ready(function () {

    //*trynna learn some math lol

    function drawCurvedLine() {
        var startPosition = $('#start-point').position();
        var endPosition = $('#end-point').position();

        // Define points (P₀ = start, P₂ = end)
        P0 = { x: startPosition.left, y: startPosition.top };
        P2 = { x: endPosition.left, y: endPosition.top };

        // Control point (P₁) - adjust this to change the curve shape
        P1 = {
            x: (P0.x + P2.x) / 2,  // Midpoint X
            y: (P0.y + P2.y) / 2 + -400  // Adjust Y for curvature
        };

        // Number of points to draw (more points = smoother curve)
        steps = 40;
        
        // Draw the curve (e.g., using canvas or just logging points)
        for (t = 0; t <= 1; t += 1 / steps) {

            // Apply Bézier formula
            x = Math.pow(1 - t, 2) * P0.x + 2 * (1 - t) * t * P1.x + Math.pow(t, 2) * P2.x;
            y = Math.pow(1 - t, 2) * P0.y + 2 * (1 - t) * t * P1.y + Math.pow(t, 2) * P2.y;

            // Do something with (x, y), e.g., draw on canvas
        //  console.log(`Point at t=${t.toFixed(2)}: (${x.toFixed(1)}, ${y.toFixed(1)})`);

            $('#test-point').clone().appendTo('#container').addClass('removable');
            $('#test-point').css('left', x.toFixed(1))
            $('#test-point').css('top', y.toFixed(1))
        }
    }
    $(document).on('keydown', function move(k) {

        var pos = $('#end-point').position();
        var top = pos.top;
        var left = pos.left;

        $('.removable').each(function (index, element) { $(element).remove() });

        k.stopPropagation()

        if (k.key == 'w') {
            $('#end-point').css('top', top-10)
        }
        if (k.key == 'a') {
            $('#end-point').css('left', left-10)
        }
        if (k.key == 's') {
            $('#end-point').css('top', top+10)
        }
        if (k.key == 'd') {
            $('#end-point').css('left', left+10)
        }
        drawCurvedLine()
    })

})