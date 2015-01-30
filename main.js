



(function($, undefined) {
    var _home = false;
    var _sidrName = 'sidr';
    var _initialHeight;
    var _$window;
    var _$document;
    var _windowHeight;
    var _windowWidth;
    var _smallScreen;
    var _scrollTriggerPoint;
    var _bounceRemoved = false;
    var _isTouchDevice = Modernizr.touch;
    var _ie = window.navigator.userAgent.indexOf("MSIE ") >= 0;
    var _currentFrame = 0;
    var inertiaInterval;

    var TABLET_WIDTH = "768";
    var DESKTOP_WIDTH = "1024";
    var MINIMUM_PASSWORD_LENGTH = 6;
    var HIGHEST_ENTROPY_LEVEL = 40;
    var DEFAULT_NUMBER_OF_STRENGTH_INDICATORS = 4;



    //Possible input validations in order of priority.  Once we hit one we show that one.
    var ERRORS = [
        {
            key: "required",
            validate: function(val) {
                return !!val;
            }
        },
        {
            key: "email",
            validate: function(val) {
                return (/(.+)@(.+){2,}\.(.+){2,}/.test(val));
            }
        },
        {
            key: "equal",
            validate: function(val1,val2) {
                return val1 === val2;
            }
        },

    ];

    function _userLocale() {

        var userLocale = navigator.language || navigator.userLanguage;
        var lowUserLocal = userLocale.toLowerCase();

        if (lowUserLocal != 'en-us'){
            $('.cookie-message').removeClass('hidden');
        }
        console.log(lowUserLocal);

    };

    function _scrollHandler(evt){
        var scrollTop = _$document.scrollTop();
        if (_windowWidth < TABLET_WIDTH) {
            //return;
        }
        if(_home){
            if(!_isTouchDevice && !_ie){

                for(var i=0;i<$('.anim').length;i++){
                    var el = $('.anim').eq(i);
                    if(el.offset().top < scrollTop+_windowHeight-_scrollTriggerPoint){
                        el.addClass('in');
                    }else{
                        el.removeClass('in');
                    }
                }
            }else{
                $('.anim').addClass('in');
                $('.big-bg').addClass('static');
                $('.signup-bg').addClass('static-signup-bg');
            }

            // async image loading
            if(scrollTop > $('.divider-one').offset().top-500 || _smallScreen){
                var url = 'url(/marketing/images/hero2.jpg)';
                if(_smallScreen){
                    url = 'url(/marketing/images/mobile/hero2@2x.jpg)';
                }
                $('.divider-one.bg').css({
                    'background-image': url
                });
            }
            if(scrollTop > $('.divider-two').offset().top-500 || _smallScreen){
                var url = 'url(/marketing/images/hero3.jpg)';
                if(_smallScreen){
                    url = 'url(/marketing/images/mobile/hero3@2x.jpg)';
                }
                $('.divider-two-bg').css({
                    'background-image': url
                });
            }
        }
        if(scrollTop > 230 || (_smallScreen && scrollTop > 50)){
            $('.header').addClass('in')
        }else{
            $('.header').removeClass('in')
        }
    }

    function _pageResize () {
        console.log('page resize')
        _windowHeight = _$window.height();
        _windowWidth = _$window.width();
        if (_windowWidth < TABLET_WIDTH){
            _smallScreen = true;
        }else{
            _smallScreen = false;
        }

        if(_home){
            _instantTop = $('.divider-one').offset().top;
            _friendlyTop = $('.divider-two').offset().top;
            _signupTop = $('form .btn').offset().top;
            _scrollTriggerPoint = 150;
            if(_smallScreen){
                _instantTop = 600;
                _friendlyTop = 2600;
                _scrollTriggerPoint = 100;
            }
        }
        _scrollHandler();
        _setHeroBackgrounds();
    }
    function _setHeroBackgrounds() {
        if($('.divider-one').css('background-image')){
            var url = 'url(/marketing/images/hero2.jpg)';
            if(_smallScreen){
                url = 'url(/marketing/images/mobile/hero2@2x.jpg)';
            }
            $('.divider-one').css({
                'background-image': url
            });
        }
        if($('.divider-two').css('background-image')){
            var url = 'url(/marketing/images/hero3.jpg)';
            if(_smallScreen){
                url = 'url(/marketing/images/mobile/hero3@2x.jpg)';
            }
            $('.divider-two').css({
                'background-image': url
            });
        }
    }

    function _getMinHeight(width) {
        if (_windowWidth > TABLET_WIDTH) {
            return 600;
        } else {
            return 300;
        }
    }

    $('.cookie-message').on('click',_hideCookieMessage)
    function _hideCookieMessage() {
        $('.cookie-message').addClass('hidden');
    }

    // language cookie

    function _setLanguageCookie(e){

        e.stopPropagation();

        var url = window.location.href;
        var lang = $(this).attr("id");

        document.cookie = "i18next=" + lang + "; path=/ ";

        window.location.href = '/' + lang;

        _setLanguageMenu();

    }

    function _setLanguageMenu(){
        var pathArray = window.location.pathname.split( '/' );
        var languageID = pathArray[1];
        var acceptedLangs = ['de', 'en', 'fr', 'pt', 'es', 'ja', 'zh'];

        if (languageID && acceptedLangs.indexOf(languageID) > -1) {
            //console.log('cookie exists');
            var languageName = $('#' + languageID).attr("name");
            var languageNameShort = $('#' + languageID).attr("id");
            //console.log(languageName);
        }
        else{
            //console.log('cookie does not exist');
            var languageID = 'en'
            var languageName = 'english';
            var languageNameShort = 'en';
            //console.log(languageName);
        }

        $('.language').removeClass('active');
        $('#' + languageID).addClass('active');

        if (_windowWidth < TABLET_WIDTH){
            $('.language-button').html('<a href="#language">' + languageNameShort + '</a>');
        }else{
            $('.language-button').html('<a href="#language">' + languageNameShort + '</a>');
        }
    }

    function _getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    function _registerUser(evt) {
        evt.preventDefault();

        var $form = $('form#contactForm');
        var data = {
            customer: {
                firstName: $('#firstName').val(),
                lastName: $('#lastName').val(),
                email: $('#email').val(),
                password: $('#password').val(),
                passwordVerify: $('#passwordVerify').val(),
            }
        };
        var orgText = $("#register-user-btn").text();
        var error;

        if (!_validateInput($("#firstName"))) {
            error = true;
        }

        if (!_validateInput($('#lastName'))) {
            error = true;
        }

        if (!_validateInput($('#email'))) {
            error = true;
        }

        if (!_validateInput($('#password'))) {
            error = true;
        }

        if (!_validateInput($('#passwordVerify'))) {
            error = true;
        }

        if (error) {
            return;
        }

        $('.error-message').removeClass('error');
        $("#register-user-btn").text(i18n.home.submitting);
        $.ajax({
            type: 'POST',
            data: data,
            url: '/api/v2/customers',
            success: function(data, status) {
                // write in cookies
                _writeSessionToCookie(data);
                _gaq.push(['_trackEvent', 'account', 'register', undefined, undefined]);
                location.href = '/';
            },
            error: function(response, status, reason) {
                _handleRegisterErrorResponseFromServer(response);
                $("#register-user-btn").text(orgText);
            }
        });
    }

    function _writeSessionToCookie(data) {
        var sessionCookie = {
            _ : {
                value: data.response.sessionToken.value,
                customerId: data.response.sessionToken.customerId
            }
        };

        document.cookie = "_ys_session=" + escape(JSON.stringify(sessionCookie));
    }

    function _validateInput($input) {
        var $label = $input.prev('label');
        var $message = $('.error-message');

        var validationErrorMsg;
        var validationResult;

        for(var i=0; i<ERRORS.length; i++) {
            validationErrorMsg = $input.data(ERRORS[i].key);

            if(validationErrorMsg) {

                if($input.attr('id') === 'password' && $('#passwordVerify').val() != '') {
                    _validateInput($('#passwordVerify'));
                }

                if(ERRORS[i].key == 'equal') {
                    validationResult = !ERRORS[i].validate($input.val(), $($input.data('equalwith')).val());
                } else {
                    validationResult = !ERRORS[i].validate($input.val());
                }

                if(validationResult) {

                    $label.text(validationErrorMsg.replace('__name__', $label.data('label')));
                    $label.addClass('error');
                    $input.addClass('error');

                    return false;

                }else {
                    $input.removeClass('error');
                    $label.removeClass('error');
                    $label.text($label.data('label'));
                }
            }
        }
        return true;
    }

    $('#password').keyup(function() {
        var passwordValue = $(this).val();
        var entropy = zxcvbn(passwordValue).entropy;
        var score;

        if (passwordValue.length < MINIMUM_PASSWORD_LENGTH) {
            score = 0;
        } else {
            score = Math.floor(entropy / (HIGHEST_ENTROPY_LEVEL / DEFAULT_NUMBER_OF_STRENGTH_INDICATORS));
        }
        $('.strength-text .veryWeak, .strength-text .weak, .strength-text .good, .strength-text .strong').css({
            display: 'none'
        })
        if (score ===  0) {
            $('.strength-indicators').removeClass('weak');
            $('.strength-indicators').removeClass('good');
            $('.strength-indicators').removeClass('strong');
            $('.strength-indicators').addClass('veryWeak');

            $('.strength-text .veryWeak').css({
                display: 'block'
            });
        } else if (score ===  1) {
            $('.strength-indicators').removeClass('veryWeak');
            $('.strength-indicators').removeClass('good');
            $('.strength-indicators').removeClass('strong');

            $('.strength-indicators').addClass('weak');
            $('.strength-text .weak').css({
                display: 'block'
            });
        } else if (score === 2) {
            $('.strength-indicators').removeClass('veryWeak');
            $('.strength-indicators').removeClass('weak');
            $('.strength-indicators').removeClass('strong');

            $('.strength-indicators').addClass('good');
            $('.strength-text .good').css({
                display: 'block'
            });
        } else if (score >= 3) {
            $('.strength-indicators').removeClass('veryWeak');
            $('.strength-indicators').removeClass('weak');
            $('.strength-indicators').removeClass('good');

            $('.strength-indicators').addClass('strong');
            $('.strength-text .strong').css({
                display: 'block'
            });
        }

    });

    function _handleFormValidation(evt) {
        _validateInput($(this));
    }

    function _handlePasswordValidation(evt) {
        _validatePassword($(this));
    }

    function _registerEventListeners() {
        //$("#signup-btn").click(_sendSignUp);
        $("input").change(_handleFormValidation);
        $('.language-button').on('click',_showLanguages);
        $('#menu-affordance').on('click',_showSideMenu);
        $('.language').on('click', _setLanguageCookie);
        $('#register-user-btn').click(_registerUser);
        $('.server-error .btn').click(_hideServerError);

        _$window.bind('resize', _pageResize);
        _$window.scroll(_scrollHandler);

        $(window).bind('touchstart',function(e){
            _isTouchDevice = true;
        })
        // $(window).bind('touchstart',function(e){
        //   _isTouchDevice = true;
        //   $(window).on('scroll',function(ev){
        //     ev.preventDefault();
        //   });
        //   $(window).on('mousewheel',function(ev){
        //     ev.preventDefault();
        //   });
        //   moved = 0;
        //   var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        //   touchStartY = touch.pageY;
        //   clearInterval(inertiaInterval);
        //   _scrollHandler();
        // })
        // $(window).bind('touchmove',function(e){
        //   e.preventDefault();
        //   var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
        //   moved = touch.pageY-touchStartY;
        //   _currentFrame -= moved/40;
        //   _currentFrame = Math.max(_currentFrame,0);
        //   touchStartY = touch.pageY;
        //   _scrollHandler();
        // })
        // $(window).bind('touchend',function(e){
        //   inertiaInterval = setInterval(function(){
        //     moved*=.95;
        //     _currentFrame -= moved/40;
        //     _currentFrame = Math.max(_currentFrame,0);
        //     if(Math.abs(moved) < .2){
        //       clearInterval(inertiaInterval)
        //     }
        //     _scrollHandler();
        //   },10)
        // })
    }

    function _hideMenus() {
        _hideSideMenu();
        _hideLanguages();
        _hideServerError();
    }
    function _hideServerError() {
        $('.server-error').removeClass('in')
    }
    function _showLanguages(){
        $('.language-menu').addClass('in');
        $('.dim-overlay').addClass('on');
        $('.dim-overlay, .main-content, .language-menu').on('click', _hideMenus);
    }

    function _hideLanguages(){
        $('.language-menu').removeClass('in');
        $('.dim-overlay').removeClass('on');
        $('.dim-overlay, .main-content').on('click', _hideMenus);
    }
    function _showSideMenu(){
        $('.side-menu').addClass('in');
        $('.dim-overlay').addClass('on');
        $('.dim-overlay, .main-content, .side-menu').on('click', _hideMenus);
    }

    function _hideSideMenu(){
        $('.side-menu').removeClass('in');
        $('.dim-overlay').removeClass('on');
        $('.dim-overlay, .main-content').on('click', _hideMenus);
    }


    function _handleSidr() {
        $('#menu-affordance')
        // $('#menu-affordance').sidr({
        //   name: _sidrName,
        //   side: 'right',
        //   onOpen: function() {
        //     //$('body').addClass('no-scroll');
        //     window.ontouchmove = function(e) {e.preventDefault();e.stopPropogation();};
        //     $('#sidr ul').click(function(evt) { evt.stopPropagation();});
        //     $('html').click(function() { $.sidr('close', 'sidr')});
        //   },
        //   onClose: function() {
        //     $('body').removeClass('no-scroll');
        //     window.onscroll = undefined;
        //     window.ontouchmove = undefined;
        //     $('html').off('click');
        //   }
        // });
    }

    function _handleRegisterErrorResponseFromServer(response) {
        var httpCode = response.status;
        var statusObj;
        if (response.responseJSON && response.responseJSON.response && response.responseJSON.response.status) {
            statusObj = response.responseJSON.response.status;
        }

        if (_isMaintenanceMode(httpCode, statusObj)) {
            _handleMaintenanceRedirect(response);
        } else if (_isServerError(response) || _isServerWarning(response.status, statusObj)) {
            _handleGenericRegisterErrorResponseFromServer(response);
        } else {
            _handleServerErrors(response);
        }
    }

    function _handleServerErrors(response) {
        var errors;
        if (response.responseJSON && response.responseJSON.response && response.responseJSON.response.errors) {
            errors = response.responseJSON.response.errors;
        }

        if (_isEmailTakenError(response, errors)) {
            _handleEmailTakenError(response);
        } else if (_isPasswordLengthError(response, errors)) {
            _handlePasswordLengthError(response);
        } else {
            _handleGenericRegisterErrorResponseFromServer(response);
        }
    }

    function _isPasswordLengthError(response, errors) {
        if (errors && errors.password) {
            if (errors.password instanceof Array) {
                return errors.password.indexOf("tooWeak") != -1;
            } else {
                return errors.password === "tooWeak";
            }
        }

        return false;
    }

    function _isEmailTakenError(response, errors) {
        if (errors && errors.email) {
            if (errors.email instanceof Array) {
                return errors.email.indexOf("taken") != -1;
            } else {
                return errors.email === "taken";
            }
        }

        return false;
    }

    function _handleMaintenanceRedirect(response) {
        window.location.href = response.getResponseHeader('X-Redirect-To');
    }

    function _isServerError(httpCode, statusObj) {
        return httpCode >= 500 && !_isMaintenanceMode(httpCode, statusObj);
    }

    function _isServerWarning(httpCode, statusObj) {
        return httpCode === 400 && statusObj.code === -1;
    }

    function _isMaintenanceMode(httpCode, statusObj) {
        return httpCode === 503 && statusObj && statusObj.code === -2;
    }

    function _handleGenericRegisterErrorResponseFromServer(response) {
        $('.server-error').addClass('in').find($('.error-message')).html(i18n.errors.generic);
    }

    //$('.test').click(_handleEmailTakenError('test'));

    function _handlePasswordLengthError(response) {

        var $message = $('.error-message');

        $message.text(i18n.errors.tooWeak.replace('__attribute__', i18n.home.passwordShort));
        $message.addClass('error');

    }

    function _handleEmailTakenError(response) {

        var $message = $('.error-message');

        $message.text(i18n.home.errors.taken);
        $message.addClass('error');
    }


    $(document).ready(function() {
        // mobile fast click handler
        FastClick.attach(document.body);

        //position the header to be 90%;
        _$window = $(window);
        _$document = $(window.document);
        _home = (typeof isHome !== 'undefined') ? isHome : false;
        _registerEventListeners();
        _userLocale();
        _handleSidr();
        _pageResize();
        _setLanguageMenu();
    });
})(jQuery);
