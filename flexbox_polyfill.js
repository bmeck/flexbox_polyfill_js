$(function() {
    var full_x, flex_x, fixed_sum = 0,
        parent, flex_children, fixed_children, num_all_children, fixed_margin_sum = 0, padding_flex_children_sum = 0;
    parent = $('#parent_box');
    full_x = parent.width();
    flex_children = parent.children('.flex_child');
    fixed_children = parent.children('.fixed_child');
    num_all_children = flex_children.length + fixed_children.length;
    flex_x = full_x;
    
    fixed_children.each(function(index, ele) {
        elem = $(ele);
        flex_x -= elem.width();
        var margin = get_margin_of_element(ele, null);
        var margin_left = get_margin_of_element(ele, "left");
        var margin_right = get_margin_of_element(ele, "right");
        flex_x -= margin + margin_left + margin_right;
        fixed_sum += $(ele).width();
        fixed_margin_sum += margin + margin_left + margin_right;
    });
    
    flex_x -= get_flex_padding(flex_children.length);

    console.log(flex_x);
    flex_x /= flex_children.length;
    flex_x = Math.floor(flex_x);
    console.log(flex_x);
    flex_children.each(function(index, ele) {
        var total_left = 0;
        var elem = $(ele);
        var padding_top = get_coordinate_after_parent_padding(ele, "top");
        var padding_left = get_coordinate_after_parent_padding(ele, "left");

        total_left = index * flex_x;
        total_left += fixed_sum;
        total_left += padding_left;
        total_left += fixed_margin_sum;
        total_left += get_flex_padding(index);

        elem.css('display', 'inline-block');
        elem.css('position', 'absolute');
        $(elem).css('top', (0 + padding_top));
        $(elem).css('left', total_left);
        $(elem).css('width', flex_x);
        $(elem).css('height', parent.height());
    });

    function get_coordinate_after_parent_padding(ele, side) {
        var elem = $(ele);
        var parent = $(elem.parent());
        var result = parent.css('padding-' + side) ? parseInt(parent.css('padding-' + side), 10) : 0;
        if (result != 0) return result;
        result = parent.css('padding') ? parent.css('padding') : 0;
        return result;
    }

    function get_margin_of_element(ele, side) {
        var elem = $(ele);
        if (side === undefined || side == null) {
            var margin = elem.css('margin') ? elem.css('margin') : 0;
        } else {
            var margin = elem.css('margin-' + side) ? elem.css('margin-' + side) : elem.css('margin') ? elem.css('margin') : 0;
        }
        margin = parseInt(margin, 10);
        return margin;
    }
    
    function get_flex_padding(num_of_flex){
        var result = 0;
        for (var i = 0; i < num_of_flex; i++) {
            var parent_for = $('#parent_box');
            var flex_children_for =parent_for.children('.flex_child');
            result += get_margin_of_element(flex_children_for[i], "left");
            result += get_margin_of_element(flex_children_for[i], "right");
        }
        return result;
    }
});