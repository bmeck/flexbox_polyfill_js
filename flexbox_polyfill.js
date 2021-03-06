"use strict"

function flexBox(){
  var cssSheets = document.styleSheets;
  for(var i = 0, max = cssSheets.length; i < max; i++){
    var url = cssSheets[i].href+'';
    $.get(url, success);
  }
  function success(data){
    var parser = new CSSParser(), 
    parsed_css,
    cssRule,
    cssDeclaration,
    flexboxArray = [],
    childCssArray = [],
    index = 0,
    childClass;
    
    parsed_css = parser.parse(data, false, true);
    
    for(var i = 0, max = parsed_css.cssRules.length; i < max; i++){
      cssRule = parsed_css.cssRules[i];
      for(var ii=0, maxii = cssRule.declarations.length; ii < maxii; ii++){
        cssDeclaration = cssRule.declarations[ii];
        if(cssDeclaration.property === 'display' && cssDeclaration.valueText === 'flexbox'){
          $(cssRule.mSelectorText).children().each(function(index, element){
            childClass = $(element).attr('class');
            childCssArray[childClass] = findCssRule('.'+childClass);
          });
          flexboxArray[index] = new flexParent(cssRule, childCssArray);
          index++;
        }
      }
    }
    
    function findCssRule(selector){
      var cssRule;
      for(var i = 0, max = parsed_css.cssRules.length; i < max; i++){
         cssRule = parsed_css.cssRules[i];
         if(cssRule.mSelectorText === selector){
           return cssRule;
         }
      }
      return null;
    }
  }
}

function flexParent(parentCss, childCss){
  this.element = $(parentCss.mSelectorText);
  if(!this.element){
    throw new Error("FlexBox: config selector needs to reference an element on the page");
  }
  this.width = this.element.width();
  if( this.width <= 0){
    console.log('FlexBox warning: Your parent element\'s width is 0.');
  }
  this.height = this.element.height();
  if( this.height <= 0){
    console.log('FlexBox warning: Your parent element\'s height is 0.');
  }
  
  this.reversed = false;
  for(var i = 0, max = parentCss.declarations.length; i < max; i++){
    var rule = parentCss.declarations[i];
    if(rule.property === 'flexbox-direction'){
      switch(rule.valueText){
        case "rl":
          this.reversed = true;
        case "lr":
          this.isHorizontal = true;
          break;
        case "bt":
          this.reversed = true;
        case "tb":
          this.isHorizontal = false;
          break;
      }
    }
  }
  
  this.padding = { 
    left : getPaddingInteger(this.element, "left"), 
    right : getPaddingInteger(this.element, "right"),
    top : getPaddingInteger(this.element, "top"), 
    bottom : getPaddingInteger(this.element, "bottom")
  };
  
  this.children = getChildren(this);
  function getChildren(that){
    var result = [], index2 = 1; 
    result['flex'] = [];
    result['fixed'] = []; 
    that.element.children().each(function(index, element){
      element = $(element);
      var newFlexChild = new flexChild({
        element : element,
        parent : that,
        cssRule : childCss[element.attr('class')],
        orderNumber : index2
      });
      if(newFlexChild.isFlexChild){
        result['flex'].push(newFlexChild);
      } else{
        result['fixed'].push(newFlexChild);
      }
      index2++;
    });
    return result;
  }
  

  
  function getPaddingInteger(elem, side){
    return parseInt(elem.css('padding-'+side) || elem.css('padding'), 10); 
  }
  

  var flexSpace = this.isHorizontal ? this.width : this.height,
  thisChild;
  var mainShiftStart = this.isHorizontal ? this.padding.left : this.padding.top;
  for(var i = 0, max = this.children['fixed'].length; i < max; i++){
    thisChild = this.children['fixed'][i];
    mainShiftStart += this.isHorizontal ? (thisChild.margins.left + thisChild.margins.right + thisChild.width) :
      (thisChild.margins.top + thisChild.margins.bottom + thisChild.height);
  }
  flexSpace -= mainShiftStart;
  for(var ii = 0, maxii = this.children['flex'].length; ii < maxii; ii++){
    thisChild = this.children['flex'][ii];
    flexSpace -= this.isHorizontal ? (thisChild.margins.left) :
      (thisChild.margins.top);
  }
  console.log('flexspace total: ', flexSpace);
  flexSpace = Math.floor(flexSpace/this.children['flex'].length);
  console.log('flexspace per element: ', flexSpace);
  
  for(var iii = 0, maxiii = maxii; iii < maxiii; iii++){    
    thisChild = this.children['flex'][iii];
    if(this.isHorizontal){
      thisChild.width = flexSpace;
    } else{
      thisChild.height = flexSpace;
    }
  }
  
  //now that we've got the widths, we need to get the coordinates for each child.
  var mainShift = {direction: null, amount: 0}, secondaryShift = {direction: 0, amount: 0};
  mainShift.direction = this.isHorizontal ? 'left' : 'top';
  mainShift.amount = this.isHorizontal ? this.padding.left : this.padding.top;
  secondaryShift.direction = this.isHorizontal ? 'top' : 'left';
  secondaryShift.amount += this.isHorizontal ? this.padding.top : this.padding.left;
  //TODO: add reversal after getting the right way working
  var all_children = $.merge(this.children['fixed'], this.children['flex']);
  //order the chidlren marged array by order number
  if(!this.reversed){
    all_children.sort(function(a, b){
      return (a.orderNumber - b.orderNumber);
    });
  } else {
    all_children.sort(function(a, b){
      return (b.orderNumber - a.orderNumber);
    });
  }
  console.dir(all_children);
  for(var vi = 0, maxvi = all_children.length; vi < maxvi; vi++){
    thisChild = all_children[vi];
    mainShift.amount += this.isHorizontal ? thisChild.margins.left : thisChild.margins.top;
    thisChild.mainShift = { amount : mainShift.amount, direction : mainShift.direction};
    mainShift.amount += this.isHorizontal ? (thisChild.width + thisChild.margins.right) :
      (thisChild.margins.bottom + thisChild.height);
      console.log(secondaryShift.amount);
    thisChild.secondaryShift = { amount : secondaryShift.amount, 
        direction : secondaryShift.direction};
    if(this.isHorizontal){
      $(thisChild.element).css({
        'left' : thisChild.mainShift.amount,
        'top' : thisChild.secondaryShift.amount,
        'width' : thisChild.width,
        'height' : thisChild.height
      });
    } else {
      $(thisChild.element).css({
        'top' : thisChild.mainShift.amount,
        'left' : thisChild.secondaryShift.amount,
        'width' : thisChild.width,
        'height' : thisChild.height
      });
    }
  }

  console.log(this);
}

//child class
function flexChild(config){
  var heightRule, widthRule;
  
  this.element = config.element;
  this.width = this.element.width();
  this.height = this.element.height();
  this.mainShift = null;
  this.secondaryShift = null;
  this.margins = {
    top: getMarginInteger(this.element, "top"),
    bottom: getMarginInteger(this.element, "bottom"),
    left: getMarginInteger(this.element, "left"),
    right: getMarginInteger(this.element, "right")
  };
  this.orderNumber = config.orderNumber;
  this.isFlexChild = true;
  for(var i = 0, max = config.cssRule.declarations.length; i < max; i++){
    var rule = config.cssRule.declarations[i];
    if(rule.property === "width"){
      widthRule = rule.valueText;
    }
    if(rule.property === "height"){
      heightRule = rule.valueText;
    }
  }
  
  if(!config.parent.isHorizontal && heightRule !== undefined && heightRule !== null && heightRule !== 'auto'){
    this.isFlexChild = false;
  }
  if(config.parent.isHorizontal && heightRule !== undefined && widthRule !== null && widthRule !== 'auto'){
    this.isFlexChild = false;
  }
  
  this.height = (heightRule === 'auto' && config.parent.isHorizontal) ? (config.parent.height - this.margins.top - this.margins.bottom) : this.height;
  this.width = (widthRule === 'auto' && !config.parent.isHorizontal) ? (config.parent.width - this.margins.left - this.margins.right) : this.width;
  
  function getMarginInteger(elem, side){
    return parseInt(elem.css('margin-'+side) || elem.css('margin'), 10); 
  }
}

(function(){
  flexBox();
})();
