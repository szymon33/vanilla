describe('Dropdown', function() {
  var form = document.createElement('form');
  var app = new App();
  var select = document.createElement('select');
  form.appendChild(select);
  var dropdown_empty = new Dropdown(app, select);

  it('constructor returns self', function() {
    expect(dropdown_empty).to.be.an.instanceof(Dropdown);
  });

  describe('collection property', function() {
    it('is valid', function() {
      expect(dropdown_empty).to.have.property('collection');
    });

    it('has app value', function() {
      expect(dropdown_empty.collection).to.equal(app);
    });
  });

  describe('tags property', function() {
    it('is valid', function() {
      expect(dropdown_empty).to.have.property('tags');
    });

    it('is an array', function() {
      expect(dropdown_empty.tags).to.be.an.instanceof(Array);
    });
  });

  describe('type property', function() {
    it('is valid', function() {
      expect(dropdown_empty).to.have.property('type');
    });

    it("has value 'single'", function() {
      expect(dropdown_empty.type).to.equal('single');
    });

    it("has value 'multiple'", function() {
      select.setAttribute('multiple', 'multiple');
      var dropdown_empty_multiple = new Dropdown(app, select);
      expect(dropdown_empty_multiple.type).to.equal('multiple');
    });
  });

  describe('defaultPrompt property', function() {
    it('is valid', function() {
      expect(dropdown_empty).to.have.property('defaultPrompt');
    });

    it("has value 'Choose...'", function() {
      expect(dropdown_empty.defaultPrompt).to.equal('Choose...');
    });

    it("has custom value", function() {
      select.dataset.prompt = 'blabla';
      var dropdown_with_prompt = new Dropdown(app, select);
      expect(dropdown_with_prompt.defaultPrompt).to.equal('blabla');
    });

  });

  it('has $el property', function(){
    expect(dropdown_empty).to.have.property('$el');      
  });

  it('has $dropdown property', function() {
    expect(dropdown_empty).to.have.property('$dropdown');
  });

  it('has $pilot property', function() {
    expect(dropdown_empty).to.have.property('$pilot');
  });

  describe('el method', function() {
    var el = dropdown_empty.el;

    it('is valid', function() {
      expect(dropdown_empty).to.respondTo('el');
    });

    it('is div tag', function(){
      expect(el().tagName).to.equal('DIV');
    });

    it("it has 'custom-dropdown-area' class", function(){
      expect(el().className).to.equal('custom-dropdown-area');
    });
  });

  it('responds to dropdown method', function() {
    expect(dropdown_empty).to.respondTo('dropdown');
  });

  it('responds to pilot method', function() {
    expect(dropdown_empty).to.respondTo('pilot');
  });

  it('responds to setPilot method', function() {
    expect(dropdown_empty).to.respondTo('setPilot');
  });

  it('responds to calculatePrompt method', function() {
    expect(dropdown_empty).to.respondTo('calculatePrompt');
  });

  it('responds to buildItem method', function() {
    expect(dropdown_empty).to.respondTo('buildItem');
  });

  it('responds to findTag method', function() {
    expect(dropdown_empty).to.respondTo('findTag');
  });

  it('responds to addToTags method', function() {
    expect(dropdown_empty).to.respondTo('addToTags');
  });

  it('responds to removeFromTags method', function() {
    expect(dropdown_empty).to.respondTo('removeFromTags');
  });

  it('responds to toggleTag method', function() {
    expect(dropdown_empty).to.respondTo('toggleTag');
  });

  it('responds to addTag method', function() {
    expect(dropdown_empty).to.respondTo('addTag');
  });
});
