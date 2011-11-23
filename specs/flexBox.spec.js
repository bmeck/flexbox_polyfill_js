global.window = require("jsdom");
global.$ = require('jquery').jQueryInit(window, { userAgent: "node-js"});
require('../flexbox_polyfill.js');

global.jQuery = jsdom.env(
  {
    html: 'http://localhost:3030', 
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_7) AppleWebKit/534.24 (KHTML, like Gecko) Chrome/11.0.696.71 Safari/534.24' }
  } ,
  function(err, window){
    return window.jQuery;
});

describe('FlexBox', function(){
  
  describe('HappyPath', function(){
    var flexBoxHorizontal, flexBoxVertical;
    
    beforeEach(function(){
      flexBoxHorizontal = jQuery.flexBox.flexIt({
        'parentId': '#parent_box',
        'fixedClass': '.fixed_child',
        'flexClass': '.flex_child',
        'directionToFlex': 'horizontal'
      });
    
      flexBoxVertical = jQuery.flexBox.flexIt({
        'parentId': '#parent_box_vertical',
        'fixedClass': '.fixed_child_vertical',
        'flexClass': '.flex_child',
        'directionToFlex': 'vertical'
      });
    });
    
    it('should perform the ajax call', function(){
      expect(ajax_call()).toEqual(1);
    });
    
    it('should calculate parent padding correctly for horizontal parents', function(){
      var horizontalChildren = flexBoxHorizontal.flexChildren;
      
      horizontalChildren.each(function(elem, index){
        console.log(index);
        elem = jQuery(elem);
        expect(flexBoxHorizontal.getParentPadding(elem, "top")).toEqual(10);
        expect(flexBoxHorizontal.getParentPadding(elem, "bottom")).toEqual(10);
        expect(flexBoxHorizontal.getParentPadding(elem, "left")).toEqual(10);
        expect(flexBoxHorizontal.getParentPadding(elem, "right")).toEqual(10);
      });
    });
  });
  
  
  describe('NotHappyPath', function() {
    it('should crash if a direction other than vertical or horizontal is given', function() {
      expect(function() {
        jQuery.flexBox.flexIt({
          direction: "wrong way."
        });
      }).toThrow();
    });
  });
  
});