describe('DOM check', function() {
  it('tags container exists in the DOM', function() {
    var tagsElem = document.getElementById('tags');
    expect(tagsElem).to.not.equal(null);
  });

  it('custom form exists in the DOM', function() {
    var formElem = document.querySelectorAll('form.custom');    
    expect(formElem).to.not.equal(null);
  });

  it('has at least one select tag', function() {
    var selectElems = document.querySelectorAll('select');    
    expect(selectElems.length).to.be.above(0);
  });
});
