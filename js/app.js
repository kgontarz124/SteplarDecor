$(function() {

    var leftArrow = $(".arrow-left");
    var rightArrow = $(".arrow-right");
    var baners = $(".baner");
    var blocks = $(".block");
    var counter = 0;

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


    //podczas scrollu dodaje headerowi klase header-scroll
    var testHeader = function() {
        var top = (window.pageYOffset || document.documentElement.scrollTop)  - (document.documentElement.clientTop || 0);

        if (top > 154) {
            header.classList.add("header-scroll");
        } else {
            header.classList.remove("header-scroll");
        }
    };

    var header = document.querySelector("header");
    testHeader();
    window.addEventListener("scroll", function() {
        testHeader();
    });


    //form
    var $inputs = $('form input[required], form textarea[required], select[required]');

    var displayFieldError = function($elem) {
        var $fieldRow = $elem.closest('.form-row');
        var $fieldError = $fieldRow.find('.field-error');
        if (!$fieldError.length) {
            var errorText = $elem.attr('data-error');
            var $divError = $('<div class="field-error">' + errorText + '</div>');
            $fieldRow.append($divError);
        }
    };

    var hideFieldError = function($elem) {
        var $fieldRow = $elem.closest('.form-row');
        var $fieldError = $fieldRow.find('.field-error');
        if ($fieldError.length) {
            $fieldError.remove();
        }
    };

    $inputs.on('input', function() {
        var $elem = $(this);
        if (!$elem.get(0).checkValidity()) {
            $elem.addClass('error');
        } else {
            $elem.removeClass('error');
            hideFieldError($elem);
        }
    });


    var checkFieldsErrors = function() {
        //ustawiamy zmienną na true. Następnie robimy pętlę po wszystkich polach
        //jeżeli któreś z pól jest błędne, przełączamy zmienną na false.
        var fieldsAreValid = true;
        $inputs.each(function(i, elem) {
            var $elem = $(elem);
            //if (new RegExp(pattern).test($elem.val())) {
            if (elem.checkValidity()) {
                hideFieldError($elem);
                $elem.removeClass('error');
            } else {
                displayFieldError($elem);
                $elem.addClass('error');
                fieldsAreValid = false;
            }
        });
        return fieldsAreValid;
    };


    $('.form').on('submit', function(e) {
        e.preventDefault();

        var $form = $(this);

        if (checkFieldsErrors()) {
            var dataToSend = $form.serializeArray();
            dataToSend = dataToSend.concat(
                $form.find('input:checkbox:not(:checked)').map(function() {
                    return {"name": this.name, "value": this.value}
                }).get()
            );

            var $submit = $form.find(':submit');
            $submit.prop('disabled', 1);
            $submit.addClass('element-is-busy');

            $.ajax({
                url : $form.attr('action'),
                method: $form.attr('method'),
                dataType : 'json',
                data : dataToSend,
                success: function(ret) {
                    if (ret.errors) {
                        ret.errors.map(function(el) {
                            return '[name="'+el+'"]'
                        });
                        checkFieldsErrors($form.find(ret.errors.join(',')));
                    } else {
                        if (ret.status=='ok') {
                            $form.replaceWith('<div class="form-send-success"><strong>Wiadomość została wysłana</strong><span>Dziękujemy za kontakt. Postaramy się odpowiedzieć jak najszybciej</span></div>');
                        }
                        if (ret.status=='error') {
                            $submit.after('<div class="send-error">Wysłanie wiadomości się nie powiodło</div>');
                        }
                    }
                },
                error : function() {
                    console.error('Wystąpił błąd z połączeniem');
                },
                complete: function() {
                    $submit.prop('disabled', 0);
                    $submit.removeClass('element-is-busy');
                }
            });
        }
    })

});
