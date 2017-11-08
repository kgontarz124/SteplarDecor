$(function() {

    var leftArrow = $(".arrow-left");
    var rightArrow = $(".arrow-right");
    var baners = $(".baner");
    var blocks = $(".block");

    var counter = 0;
	console.log(blocks);

    //funkcja przewijanie do przodu
    function skipForward() {
        counter++;
        if (counter > baners.length - 1) {
            counter = 0;
            baners.first().addClass("active");
            baners.eq(baners.length -1).removeClass("active");
            blocks.first().addClass("active-block");
            blocks.eq(blocks.length -1).removeClass("active-block");
        } else {
            baners.eq(counter).addClass("active");
            baners.eq(counter-1).removeClass("active");
            blocks.eq(counter).addClass("active-block");
            blocks.eq(counter-1).removeClass("active-block");
        }
    }


    //automatyczne przewijanie
    setInterval(function() {
        skipForward();
    }, 4000);

    //slider
    //przewijanie do przodu
    rightArrow.on("click", function() {
            skipForward();
    });

    //przewijanie do tylu
    leftArrow.on("click", function() {
            counter--;
            if (counter < 0) {
                counter = baners.length - 1;
                baners.eq(counter).addClass("active");
                baners.first().removeClass("active");
                blocks.eq(counter).addClass("active-block");
                blocks.first().removeClass("active-block");
            } else {
                baners.eq(counter+1).removeClass("active");
                baners.eq(counter).addClass("active");
                blocks.eq(counter+1).removeClass("active-block");
                blocks.eq(counter).addClass("active-block");
            }
    });
});
