describe('App class', function() {
  var form = document.createElement('form');
  var app = new App();
  var select = document.createElement('select');
  form.appendChild(select);
  var dropdown = new Dropdown(app, select);

  it('has selected property', function() {
    expect(app).to.have.property('selected');
  });

  it('selected is set to null', function() {
    expect(app.selected).to.be.a('null');
  });

  describe('selected method', function() {
    it('is valid', function() {
      expect(app).to.respondTo('select');
    });

    it('dropdown has open class when selected', function() {
      expect(dropdown.$el.className).to.not.contain('open');
      app.select(dropdown.$el);
      expect(dropdown.$el.className).to.contain('open');
    });

    it('store selected dropdown element', function() {
      expect(app.selected).to.equal(dropdown.$el);
    });

    it('removes dropdown open class when unselected', function(){
      expect(dropdown.$el.className).to.contain('open');
      app.select(dropdown.$el);
      expect(dropdown.$el.className).to.not.contain('open');
    });
  });
});
