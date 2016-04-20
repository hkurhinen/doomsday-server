(function() {
  'use strict';

  var TYPING_DELAY = 100;
  var PHASE = 'INTRO'; //INTRO, START, NAME, CODE
  
  document.onkeypress = function(e) {
    e = e || window.event;
    if (e.keyCode == 13) {
      switch(PHASE){
        case 'START':
          askName();
        break;
        case 'NAME':
          alert('Hello '+$('.name-input').val());
        break;
        case 'CODE':
        break;
      }
    }
  }

  function showMsg(msg, cb) {
    $('#message').text('');
    var letters = msg.split('');
    async.forEachOf(letters, function(letter, i, callback) {
      return setTimeout(function() {
        $('#message').text($('#message').text() + letter);
        callback();
      }, i * TYPING_DELAY)
    }, function(err) {
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