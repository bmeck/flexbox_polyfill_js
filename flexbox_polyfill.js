(function(that) {
  that.flexBox = {};
  that.flexBox.flexIt = function(data) {
    var parent = $(data.parentId),
        horizontal = data.directionToFlex === 'horizontal' ? true : data.directionToFlex === 'vertical' ? false : null,
        fullParentDimension = horizontal ? parent.width() : parent.height(),
        parentSpaceForFlexChildren = fullParentDimension,
        sumWidthFixedChildren = 0,
        flexChildren = parent.children(data.flexClass),
        fixedChildren = parent.children(data.fixedClass),
        numberOfChildren = fixedChildren.length + flexChildren.length,
        sumPaddingFlexChildren = 0,
        margin = 0,
        marginForNextFlexChild = 0,
        elem, parentPadding = 0,
        parentPaddingOtherDim = 0,
        side1, side2, parentPaddingSide = horizontal ? "top" : "left",
        flexChildShiftSide = horizontal ? "left" : "top";

    if (horizontal === null) {
      throw new Error('Wrong direction type given to flexBox');
    }

    fixedChildren.each(function(index, ele) {
      elem = $(ele);
      margin = horizontal ? getMargin(ele, "left") + getMargin(ele, "right") : getMargin(ele, "top") + getMargin(ele, "bottom");
      parentSpaceForFlexChildren -= (horizontal ? elem.width() : elem.height()) + margin;
      sumWidthFixedChildren += (horizontal ? elem.width() : elem.height()) + margin;
    });

    parentSpaceForFlexChildren = Math.floor((parentSpaceForFlexChildren - getShiftOfFlexChildN(flexChildren.length)) / flexChildren.length);
    console.log(parentSpaceForFlexChildren);

    flexChildren.each(function(index, ele) {
      marginForNextFlexChild = 0;
      elem = $(ele);
      parentPadding = getParentPadding(ele, parentPaddingSide);
      parentPaddingOtherDim = getParentPadding(ele, flexChildShiftSide);
      marginForNextFlexChild = (index * parentSpaceForFlexChildren) + sumWidthFixedChildren + parentPaddingOtherDim + getShiftOfFlexChildN(index);
      elem.css({
        'display': 'inline-block',
        'position': 'absolute'
      });
      elem.css(parentPaddingSide, parentPadding + "px");
      elem.css(flexChildShiftSide, marginForNextFlexChild + "px");
      if (horizontal) {
        elem.css({
          'width': parentSpaceForFlexChildren + "px",
          'height': parent.height()
        });
      }
      else {
        elem.css({
          'height': parentSpaceForFlexChildren + "px",
          'width': parent.width()
        });
      }
      console.log(parentPaddingSide, flexChildShiftSide);
    });

    function getParentPadding(ele, side) {
      elem = $(ele);
      result = parent.css('padding-' + side) || parent.css('padding');
      return parseInt(result, 10);
    }
    
    that.flexBox.getParentPadding = getParentPadding;

    function getMargin(ele, side) {
      var elem = $(ele);
      if (side === undefined || side === null) {
        margin = elem.css('margin') || 0;
      }
      else {
        margin = elem.css('margin-' + side) || elem.css('margin');
      }
      return parseInt(margin, 10);
    }
    
    that.flexBox.getMargin = getMargin;

    function getShiftOfFlexChildN(num_of_flex) {
      result = 0;
      if (horizontal) {
        side1 = "left";
        side2 = "right";
      }
      else {
        side1 = "top";
        side2 = "bottom";
      }

      for (var i = 0; i < num_of_flex; i++) {
        result += getMargin(flexChildren[i], side1);
        result += getMargin(flexChildren[i], side2);
      }
      return result;
    }
    
    that.flexBox.getShift = getShiftOfFlexChildN;
  };
  
  return that;
}($));