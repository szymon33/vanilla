describe('App class', function() {
  var app = new App();

  it('has selected property', function() {
    expect(app).to.have.property('selected');
  });

  it('has select method', function() {
    expect(app).to.respondTo('select');
  });
});
