(function() {
  var App, Dropdown, Tag, addClass, addEventListener, forEach, hasClass, ready, removeClass;

  forEach = Function.prototype.call.bind(Array.prototype.forEach);

  ready = function(fn) {
    if (document.readyState !== 'loading') {
      return fn();
    } else if (document.addEventListener) {
      return document.addEventListener('DOMContentLoaded', fn);
    } else {
      return document.attachEvent('onreadystatechange', function() {
        if (document.readyState !== 'loading') {
          return fn();
        }
      });
    }
  };

  addEventListener = function(el, eventName, handler) {
    if (el.addEventListener) {
      return el.addEventListener(eventName, handler, false);
    } else {
      return el.attachEvent('on' + eventName, function() {
        return handler.call(el);
      });
    }
  };

  addClass = function(el, className) {
    if (el.classList) {
      return el.classList.add(className);
    } else {
      return el.className += ' ' + className;
    }
  };

  removeClass = function(el, className) {
    var make;
    make = function(inner, className) {
      if (inner.classList) {
        inner.classList.remove(className);
      } else if (inner.className) {
        inner.className = inner.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
      }
    };
    if (el.length) {
      return forEach(el, function(item) {
        return make(item, className);
      });
    } else {
      return make(el, className);
    }
  };

  hasClass = function(el, className) {
    if (el.classList) {
      el.classList.contains(className);
    } else {
      new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }
  };

  App = function() {
    this.selected = null;
    forEach(document.querySelectorAll('form.custom select'), (function(_this) {
      return function(select) {
        select.style.display = 'none';
        return new Dropdown(_this, select);
      };
    })(this));
    return addEventListener(document, 'click', (function(_this) {
      return function() {
        if (!!_this.selected) {
          removeClass(_this.selected, 'open');
          _this.selected = null;
        }
      };
    })(this));
  };

  App.prototype.select = function($dropdown) {
    if ($dropdown === this.selected) {
      removeClass($dropdown, 'open');
      this.selected = null;
    } else {
      if (!!this.selected) {
        removeClass(this.selected, 'open');
      }
      addClass($dropdown, 'open');
      this.selected = $dropdown;
    }
  };

  Tag = function(maker, subject) {
    this.maker = maker;
    this.$subject = subject;
    addClass(this.$subject, 'selected');
    this.$container = document.getElementById('tags');
    this.$el = this.el();
    this.$container.appendChild(this.$el);
    return this;
  };

  Tag.prototype.el = function() {
    var el;
    el = document.createElement('a');
    el.className = 'dropdown-tag';
    el.innerHTML = this.$subject.innerHTML;
    el.href = '#';
    addEventListener(el, 'click', (function(_this) {
      return function(e) {
        e.preventDefault();
        return _this.destroy();
      };
    })(this));
    return el;
  };

  Tag.prototype.destroy = function() {
    removeClass(this.$subject, 'selected');
    this.$container.removeChild(this.$el);
    return this.maker.removeFromTags(this);
  };

  Dropdown = function(collection, select) {
    this.collection = collection;
    this.tags = [];
    this.type = select.getAttribute('multiple') || 'single';
    this.defaultPrompt = select.dataset.prompt || "Choose...";
    this.$el = this.el();
    this.$dropdown = this.dropdown();
    this.$pilot = this.pilot();
    forEach(select.querySelectorAll('option'), (function(_this) {
      return function(option) {
        return _this.$dropdown.appendChild(_this.buildItem(option));
      };
    })(this));
    this.$el.appendChild(this.$pilot);
    this.$el.appendChild(this.$dropdown);
    select.parentNode.appendChild(this.$el);
    this.setPilot();
    return this;
  };

  Dropdown.prototype.el = function() {
    var el;
    el = document.createElement('div');
    el.className = 'custom-dropdown-area';
    return el;
  };

  Dropdown.prototype.dropdown = function() {
    var ul;
    ul = document.createElement('ul');
    ul.className = 'f-dropdown custom-dropdown-options';
    return ul;
  };

  Dropdown.prototype.pilot = function() {
    var pilot;
    pilot = document.createElement('a');
    pilot.className = 'custom-dropdown-button';
    pilot.href = '#';
    addEventListener(pilot, 'click', (function(_this) {
      return function(e) {
        e.preventDefault();
        e.stopPropagation();
        return _this.collection.select(_this.$dropdown);
      };
    })(this));
    return pilot;
  };

  Dropdown.prototype.setPilot = function() {
    if (this.$pilot.textContent !== void 0) {
      this.$pilot.textContent = this.calculatePrompt();
    } else {
      this.$pilot.innerText = this.calculatePrompt();
    }
  };

  Dropdown.prototype.calculatePrompt = function() {
    var counter, temp;
    counter = this.tags.length;
    switch (counter) {
      case 0:
        return this.defaultPrompt;
      case 1:
        temp = this.tags[0].$el;
        return temp.textContent || temp.innerText;
      default:
        return counter.toString() + ' items';
    }
  };

  Dropdown.prototype.buildItem = function(option) {
    var li;
    li = document.createElement('li');
    li.className = 'option-item';
    li.innerHTML = option.innerHTML;
    if (option.getAttribute('selected')) {
      this.addToTags(new Tag(this, li));
    }
    addEventListener(li, 'click', (function(_this) {
      return function(e) {
        var previous;
        e.preventDefault();
        e.stopPropagation();
        if (_this.type === 'single') {
          previous = _this.tags[0];
          if (previous && previous.$subject !== e.target) {
            previous.destroy();
          }
        }
        return _this.toggleTag(e.target);
      };
    })(this));
    return li;
  };

  Dropdown.prototype.findTag = function(search) {
    var i, len, ref, tag;
    ref = this.tags;
    for (i = 0, len = ref.length; i < len; i++) {
      tag = ref[i];
      if (tag.$subject === search) {
        return tag;
      }
    }
    return null;
  };

  Dropdown.prototype.addToTags = function(tag) {
    this.tags.push(tag);
    return this.setPilot();
  };

  Dropdown.prototype.removeFromTags = function(tag) {
    var index;
    index = this.tags.indexOf(tag);
    if (index > -1) {
      this.tags.splice(index, 1);
    }
    return this.setPilot();
  };

  Dropdown.prototype.toggleTag = function(li) {
    var tag;
    tag = this.findTag(li);
    if (!!tag) {
      return tag.destroy();
    } else {
      return this.addToTags(new Tag(this, li));
    }
  };

  ready(function() {
    return new App();
  });

}).call(this);
