describe('Tag class', function() {
  var li = document.createElement('li');
  var tag = new Tag(li);

  it('constructor returns self', function() {
    expect(tag).to.be.an.instanceof(Tag);
  });

  it('has $subject property', function() {
    expect(tag).to.have.property('$subject');
  });

  it('has $container property', function() {
    expect(tag).to.have.property('$container');
  });

  it('has $el property', function() {
    expect(tag).to.have.property('$el');
  });

  it('responds to el method', function() {
    expect(tag).to.respondTo('el');
  });

  it('responds to destroy method', function() {
    expect(tag).to.respondTo('destroy');
  });
});
