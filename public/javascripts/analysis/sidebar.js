var boxS = $('#sidebar .menu_box');
for (var i = 0; i < boxS.length; i++) {
    boxS[i].onmouseover = function () {
        var sib = $(this).siblings();
        for (var x = 0; x < sib.length; x++) {
            $(sib[x]).removeClass("current");
        }
        $(this).addClass("current");


        var dn = $(this).children(".menu_sub");
        for (var y = 0; y < dn.length; y++) {
            $(dn[y]).removeClass("dn");
        }
        var siblings = $(this).siblings();
        for (var j = 0; j < siblings.length; j++) {
            var sub = $(siblings[j]).children("menu_sub");
            for (var n = 0; n < sub.length; n++) {
                $(sub[n]).addClass("dn");
            }

        }
    };
    boxS[i].onmouseout = function () {
        $(this).removeClass("current");
        var dn = $(this).children(".menu_sub");

        for (var y = 0; y < dn.length; y++) {
            $(dn[y]).addClass("dn");
        }
        var siblings = $(this).siblings();
        for (var j = 0; j < siblings.length; j++) {
            var sub = $(siblings[j]).children(".menu_sub");
            for (var n = 0; n < sub.length; n++) {
                $(sub[n]).addClass("dn");
            }
        }
    }

}

