describe('FlexBox', function(){
  
  it('should crash if a direction other than vertical or horizontal is given', function(){
    expect( function(){
        $.flexBox.flexIt({ direction : "wrong way." }); 
      }).toThrow();
  });
  
});