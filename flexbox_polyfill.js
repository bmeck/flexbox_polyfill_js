function flexBox(data) {
    var parent = $(data.parentId), 
        full_x = parent.width(), 
        flex_x = full_x,
        fixed_children_width_sum = 0,
        flex_children = parent.children(data.flexClass), 
        fixed_children = parent.children(data.fixedClass), 
        num_all_children = fixed_children.length + flex_children.length,
        padding_flex_children_sum = 0,
        margin = 0,
        total_left = 0,
        elem,
        padding_top = 0,
        padding_left = 0;
    
    fixed_children.each(function(index, ele) {
        elem = $(ele);
        margin = get_margin_of_element(ele, "left") + get_margin_of_element(ele, "right");
        flex_x -= elem.width() + margin;
        fixed_children_width_sum += elem.width() + margin;
    });
    
    flex_x = Math.floor((flex_x - get_flex_margin(flex_children.length)) / flex_children.length);
    
    flex_children.each(function(index, ele) {
        total_left = 0;
        elem = $(ele);
        
        padding_top = get_coordinate_after_parent_padding(ele, "top");
        padding_left = get_coordinate_after_parent_padding(ele, "left");
        total_left = (index * flex_x) + fixed_children_width_sum + padding_left + get_flex_margin(index);

        elem.css({
            'display' : 'imline-block',
            'position' : 'absolute',
            'top' : padding_top,
            'left' : total_left,
            'width' : flex_x,
            'height' : parent.height()
        });
    });

    function get_coordinate_after_parent_padding(ele, side) {
        elem = $(ele);
        result = parent.css('padding-' + side) || 0;
        
        if (result !== 0) return parseInt(result, 10);
        result = parent.css('padding') || 0;
        
        return parseInt(result, 10);
    }

    function get_margin_of_element(ele, side) {
        var elem = $(ele);
        
        if (side === undefined || side === null) {
          margin = elem.css('margin') || 0;
        } else {
          margin = elem.css('margin-' + side) || 0;
        }
        return parseInt(margin, 10);
    }
    
    function get_flex_margin(num_of_flex){
        result = 0;
        
        for (var i = 0; i < num_of_flex; i++) {
            result += get_margin_of_element(flex_children[i], "left");
            result += get_margin_of_element(flex_children[i], "right");
        }
        
        return result;
    }
}

$(function(){
   flexBox({
     'parentId' : '#parent_box',
     'fixedClass' : '.fixed_child',
     'flexClass' : '.flex_child'
   }); 
});