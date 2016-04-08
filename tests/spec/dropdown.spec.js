describe('Dropdown', function() {
  var form = document.createElement('form');
  var app = new App();
  var select = document.createElement('select');
  form.appendChild(select); // parent element
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

    it('is div element', function(){
      expect(el().tagName).to.equal('DIV');
    });

    it("it has 'custom-dropdown-area' class", function(){
      expect(el().className).to.contain('custom-dropdown-area');
    });
  });

  describe('dropdown method', function() {
    var dropdown = dropdown_empty.dropdown;

    it('is valid', function() {
      expect(dropdown_empty).to.respondTo('dropdown');
    });

    it('returns ul element', function(){
      expect(dropdown().tagName).to.equal('UL');
    });

    it('has class names', function(){
      expect(dropdown().className).to.contain('f-dropdown custom-dropdown-options');
    });
  });

  describe('pilot method', function() {
    var pilot = dropdown_empty.pilot;

    it('is valid', function() {
      expect(dropdown_empty).to.respondTo('pilot');
    });

    it("returns 'A' element", function() {
      expect(pilot().tagName).to.equal('A');
    });

    it("has 'custom-dropdown-button' class", function() {
      expect(pilot().className).to.contain('custom-dropdown-button');
    });

    it("has '#' href", function() {
      expect(pilot().href).to.contain('#');
    });
  });

  it('responds to setPilot method', function() {
    expect(dropdown_empty).to.respondTo('setPilot');
  });

  it('responds to calculatePrompt method', function() {
    expect(dropdown_empty).to.respondTo('calculatePrompt');
  });

  describe('buildItem method', function(){
    var buildItem = dropdown_empty.buildItem;
    var option = document.createElement('option');

    it('is valid', function() {
      expect(dropdown_empty).to.respondTo('buildItem');
    });

    it('returns LI element', function(){
      expect(buildItem(option).tagName).to.equal('LI');
    });
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
