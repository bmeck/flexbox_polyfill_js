function flexBox(data) {
  var parent = $(data.parentId),
  fullParentDimension = parent.width(),
  parentSpaceForFlexChildren = fullParentDimension,
  sumWidthFixedChildren = 0,
  flexChildren = parent.children(data.flexClass),
  fixedChildren = parent.children(data.fixedClass),
  numberOfChildren = fixedChildren.length + flexChildren.length,
  sumPaddingFlexChildren = 0,
  margin = 0,
  marginForNextFlexChild = 0,
  elem, parentPadding = 0,
  parentPaddingOtherDim = 0;
  
  fixedChildren.each(function(index, ele) {
    elem = $(ele);
    margin = getMargin(ele, "left") + getMargin(ele, "right");
    parentSpaceForFlexChildren -= elem.width() + margin;
    sumWidthFixedChildren += elem.width() + margin;
  });
  
  parentSpaceForFlexChildren = Math.floor((parentSpaceForFlexChildren - getShiftOfFlexChildN(flexChildren.length)) / flexChildren.length);

  flexChildren.each(function(index, ele) {
    marginForNextFlexChild = 0;
    elem = $(ele);
    parentPadding = getParentPadding(ele, "top");
    parentPaddingOtherDim = getParentPadding(ele, "left");
    marginForNextFlexChild = (index * parentSpaceForFlexChildren) + sumWidthFixedChildren + parentPaddingOtherDim + getShiftOfFlexChildN(index);
    elem.css({
      'display': 'imline-block',
      'position': 'absolute',
      'top': parentPadding,
      'left': marginForNextFlexChild,
      'width': parentSpaceForFlexChildren,
      'height': parent.height()
    });
  });

  function getParentPadding(ele, side) {
    elem = $(ele);
    result = parent.css('padding-' + side) || 0;
    if (result !== 0){
      return parseInt(result, 10);
    }
    result = parent.css('padding') || 0;
    return parseInt(result, 10);
  }

  function getMargin(ele, side) {
    var elem = $(ele);
    if (side === undefined || side === null) {
      margin = elem.css('margin') || 0;
    }
    else {
      margin = elem.css('margin-' + side) || 0;
    }
    return parseInt(margin, 10);
  }

  function getShiftOfFlexChildN(num_of_flex) {
    result = 0;
    for (var i = 0; i < num_of_flex; i++) {
      result += getMargin(flexChildren[i], "left");
      result += getMargin(flexChildren[i], "right");
    }
    return result;
  }
}

$(function() {
  flexBox({
    'parentId': '#parent_box',
    'fixedClass': '.fixed_child',
    'flexClass': '.flex_child'
  });
});