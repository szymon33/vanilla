describe('Tag', function() {
  var tags = document.createElement('div');
  var li = document.createElement('li');
  li.innerHTML = 'blabla';
  var tag = new Tag(li);

  it('constructor returns self', function() {
    expect(tag).to.be.an.instanceof(Tag);
  });

  describe('subject property', function() {
    it('is valid', function() {
      expect(tag).to.have.property('$subject');
    });

    it('is that li element', function() {
      expect(tag.$subject).to.not.be.a('null');
      expect(tag.$subject).to.equal(li);
    });

    it('has class selected', function() {
      expect(tag.$subject.className).to.contain('selected');
    });
  });

  describe('container property', function(){
    tags.id = 'tags';

    it('is valid', function(){
      expect(tag).to.have.property('$container');
      expect(tag.$container).to.not.be.a('null');
    });

    it('is div', function() {
      expect(tag.$container.tagName).to.equal('DIV');
    });

    it('id equals "tags"', function() {
      expect(tag.$container.id).to.equal('tags');
    });
  });

  it('has $el property', function() {
    expect(tag).to.have.property('$el');
  });

  describe('el method', function() {
    var el = tag.el;

    it('is valid', function() {
      expect(tag).to.respondTo('el');
    });

    it("returns 'a' element", function() {
      expect(tag.el().tagName).to.equal('A');
    });

    it("has class 'dropdown-tag'", function(){
      expect(tag.el().className).to.contain('dropdown-tag');
    });

    it("has innerHTML from subject", function(){
      expect(tag.el().innerHTML).to.equal('blabla');
      expect(tag.el().innerHTML).to.equal(tag.$subject.innerHTML);
    });

    it("has href '#'", function(){
      expect(tag.el().href).to.contain('#');
    });
  });

  describe('destroy method', function() {
    it('is valid', function() {
      expect(tag).to.respondTo('destroy');
    });
  });
});
