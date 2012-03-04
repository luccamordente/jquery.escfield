/*
* jQuery Esc Field plugin 0.1.0
*
* Copyright (c) 2011 Dito Internet
* Author: Lucca Mordente (luccamordente@gmail.com)
* Description: A jQuery plugin that allows a field to be focused, 
* cleaned and unfocused by pressing the ESC key. It's also possible
* to bind events to prevent or intercept these strategies.
*
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
*/



(function( $ ) {
  $.fn.escField = function(options) {
    
    
    var 

    // plugin default settings
    defaultSettings = {
              
      notEmpty: notEmptyStrategy = function() {}, //notEmpty
      
      empty: emptyStrategy = function() {}, //empty
  
      blurred: blurredStrategry = function() {}, //blurred
          
    }, //defaultSettings
  
    
    // esc key code
    ESC = 27,
  
  
    // last event timestamp
    lastTimeStamp = 0,
    
    
    plugin = function(field, options) {      
      
      var 
      
      strategies = {
      
        notEmpty: notEmptyStrategy = function() {
          $field.val("");
          if($.browser.mozilla) {
            $field.blur();
            $field.focus();
          }
        }, //notEmpty
        
        empty: emptyStrategy = function() {
          $field.blur();
        }, //empty
    
        blurred: blurredStrategry = function() {
          $field.focus();
        } //blurred
      
      }, //strategies
      
      
      // instance of current field
      $field = field,
      
      
      // plugin settings after initialization
      settings = {},
      
      /**
       * Calls the requested strategy and passes the field to the event,
       *  so you can prevent any predefined event or intercept it with anything.
       *
       * i.e.: 
       *   $('input#search').escField({
       *     empty: function(field) {
       *       field.fadeOut(); // remove field from screen
       *       return false;    // prevents field blurring (would still have focus)
       *     }
       *   });
       * 
       */
      executeStrategy = function(strategy, callback) {
        if(settings[strategy] && settings[strategy]($field) !== false)
          strategies[strategy]();
      }, //executeStrategy
      
      
      /** 
       * Controls if esc was pressed correctly and executes a callback.
       * Wen esc is pressed a keyup event is fired twice.
       * This function allows only one to pass.
       */
      escPressed = function(event,callback){
        if(event.which != ESC) return;
        if(event.timeStamp - lastTimeStamp < 50) return;
        lastTimeStamp = event.timeStamp;
        callback();
      }, //escPressed
    
    
      /**
       * Empties the field if it has content
       * or call the "empty" strategy when it is empty.
       */
      keyup = function(event) {
        escPressed(event,function(){
          console.log($field.val());
          if($field.val()) // not empty
            executeStrategy("notEmpty");
          else
            executeStrategy("empty");
        });
      }, //keyup
    
    
      /**
       * Calls "blurred" strategy if the field is not focused
       */
      documentKeyup = function(event) {
        escPressed(event,function(){      
          if(event.srcElement != $field[0])
            executeStrategy("blurred");
        });
      }; //documentKeyup
      
      
      $.extend(true,settings,defaultSettings,options)
      
      // bind event to field
      $field.bind('keyup.escfield',keyup);
      // bind event do document
      $(document).bind('keyup.escfield',documentKeyup);
    
    
    };
    
    
    plugin(this, options);
    
    return this;
    
  }; //escField
})( jQuery );