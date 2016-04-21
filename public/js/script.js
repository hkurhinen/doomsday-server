(function() {
  'use strict';

  var TYPING_DELAY = 100;
  var PHASE = 'INTRO'; //INTRO, START, NAME, QUIZ, CODE
  var PRINTING = false;
  
  document.onkeypress = function(e) {
    if(PRINTING){
      return false;
    }
    e = e || window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == 13) {
      switch(PHASE){
        case 'START':
          $.get('/reset');
          askName();
        break;
        case 'NAME':
          $.post('/start', {team: $('.name-input').val()}, function(res){
            $('.name-input').remove();
            PHASE = 'QUIZ';
            askQuestion();
          });
        break;     
        case 'CODE':
          $.post('/end', {code: $('.code-input').val()}, function(res){
            $('.code-input').remove();
            if(res.answer == 'ok'){
              showMsg('You have successfully solved Doomsday Machine, it took you '+res.time+' ms', function(){
                setTimeout(function(){
                    showMsg('Welcome to Doomsday Machine! Press ENTER to begin.', function() {
                      PHASE = 'START';
                    });
                }, 5000);
              });
            }else{
              showMsg('Code was incorrect, try again!', function(){
                PHASE = 'QUIZ';
                setTimeout(function(){
                  askQuestion();
                }, 700);
              });
            }
          });
        break;
      }
    }else if(PHASE == 'QUIZ'){
      if(keyCode == 49){
        $.post('/hint', {option: 1}, function(res){
          askCode();
        });
      }else if(keyCode == 50){
        $.post('/hint', {option: 2}, function(res){
          askCode();
        });
      }else if(keyCode == 51){
        $.post('/hint', {option: 3}, function(res){
          askCode();
        });
      }
    }
  }

  function askCode(){
    $('.option-container').remove();
    showMsg('Input the code: ', function() {
      var codeInput = $('<input />')
        .attr('type', 'text')
        .addClass('code-input')
        .insertAfter('#message')
        .focus();
        PHASE = 'CODE';
    });    
  }

  function askQuestion(){
    showMsg('Which programming language was developed in 1959 by John McCarthy? (Answer by pressing corresponding number.)', function() {
      var optionContainer = $('<div />')
        .addClass('option-container')
          .append('<h3>1. LISP</h3>')
          .append('<h3>2. assembly language</h3>')
          .append('<h3>3. Ruby</h3>')
        .insertAfter('#message');
    });    
  }

  function showMsg(msg, cb) {
    PRINTING = true;
    $('#message').text('');
    var letters = msg.split('');
    async.forEachOf(letters, function(letter, i, callback) {
      return setTimeout(function() {
        $('#message').text($('#message').text() + letter);
        callback();
      }, i * TYPING_DELAY)
    }, function(err) {
      PRINTING = false;
      if (typeof cb === 'function') {
        cb();
      }
    });
  }
  
  function askName(){
    showMsg('What is your name?', function() {
      var nameInput = $('<input />')
        .attr('type', 'text')
        .addClass('name-input')
        .insertAfter('#message')
        .focus();
        PHASE = 'NAME';
    });
  }

  showMsg('Welcome to Doomsday Machine! Press ENTER to begin.', function() {
    PHASE = 'START';
  });

})();