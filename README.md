Author: kperch
License: MIT

This was just for the fun of it on a Sunday afternoon. 

What this does:

Version 2.0.3 (11/30/11):
Redid the entire logic setup to objects, ect. It now looks right in vertical and horizontal, and orders children in the same order they are placed on the DOM.

Version 0.2:
Seperated out the actual flexbox logic and made it applicable to a custom parent id and custom flex/fixed children classes.
Did a LOT of refactoring on the js

Version 0.1:
takes a div #parent_div and gives it the flexbox model. takes in fixed-width children .fixed_width and flex-width children 
.flex_width. respects padding on #parent_div, and margin-left and margin-right on children. splits the remaining space left
after fixed-width children and margin and parent padding and divides it between the flex-width children.

