(function() {
  var addClass, addEventListener, addTag, buildDiv, buildDropdown, buildPilot, calculatePrompt, closest, findTag, forEach, forEachElement, hasClass, initTags, ready, removeClass, removeTag, setPilot, toggleTag;

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

  addEventListener = function(el, eventName, filter, handler) {
    var make;
    make = function(inner, eventName, handler) {
      if (inner.addEventListener) {
        return inner.addEventListener(eventName, handler, false);
      } else {
        return inner.attachEvent('on' + eventName, function() {
          return handler.call(inner);
        });
      }
    };
    if (filter != null) {
      return forEach(el.querySelectorAll(filter), function(node) {
        return make(node, eventName, handler);
      });
    } else {
      return make(el, eventName, handler);
    }
  };

  forEachElement = function(selector, fn) {
    return forEach(document.querySelectorAll(selector), function(node) {
      return fn(node);
    });
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
        return inner.classList.remove(className);
      } else if (inner.className) {
        return inner.className = inner.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
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
      return el.classList.contains(className);
    } else {
      return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
    }
  };

  closest = function(el, selector) {
    while (el) {
      el = el.parentNode;
      if ((el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector)) {
        break;
      }
    }
    return el;
  };

  buildDiv = function() {
    var div;
    div = document.createElement('div');
    div.className = 'custom-dropdown-area';
    return div;
  };

  buildPilot = function() {
    var pilot;
    pilot = document.createElement('a');
    pilot.className = 'custom-dropdown-button';
    pilot.href = '#';
    return pilot;
  };

  setPilot = function(dropdown) {
    var pilot;
    pilot = dropdown.previousSibling;
    if (pilot.textContent !== void 0) {
      pilot.textContent = calculatePrompt(dropdown);
    } else {
      pilot.innerText = calculatePrompt(dropdown);
    }
    return pilot;
  };

  buildDropdown = function(select) {
    var type, ul;
    type = select.getAttribute('multiple') ? 'multiple' : 'single';
    ul = document.createElement('ul');
    ul.className = 'f-dropdown custom-dropdown-options';
    ul.dataset.prompt = select.dataset.prompt;
    ul.dataset.type = type;
    ul.dataset.target = '#' + select.getAttribute('id');
    forEach(select.querySelectorAll('option'), function(option) {
      var li, span;
      li = document.createElement('li');
      li.className = 'option-item';
      li.dataset.value = option.value;
      span = document.createElement('span');
      span.className = 'option-title';
      span.innerHTML = option.innerHTML;
      li.appendChild(span);
      if (option.getAttribute('selected')) {
        addClass(li, 'selected');
      } else {
        removeClass(li, 'selected');
      }
      return ul.appendChild(li);
    });
    return ul;
  };

  calculatePrompt = function(ul) {
    var defaultPrompt, selectedItems, temp;
    defaultPrompt = ul.dataset.prompt === 'undefined' ? "Choose..." : ul.dataset.prompt;
    selectedItems = ul.querySelectorAll('li.selected').length || 0;
    switch (selectedItems) {
      case 0:
        return defaultPrompt;
      case 1:
        temp = ul.querySelector('li.selected');
        return temp.textContent || temp.innerText;
      default:
        return selectedItems.toString() + ' items';
    }
  };

  findTag = function(target, value) {
    return document.getElementById('tags').querySelector("[data-reftarget='" + target + "'][data-refvalue='" + value + "']");
  };

  addTag = function(elem) {
    var tag, target, value;
    addClass(elem, 'selected');
    target = elem.parentNode.dataset.target;
    value = elem.dataset.value;
    if (findTag(target, value) === null) {
      tag = document.createElement('a');
      tag.className = 'dropdown-tag';
      tag.dataset.reftarget = target;
      tag.dataset.refvalue = value;
      tag.innerHTML = value;
      return document.getElementById('tags').appendChild(tag);
    }
  };

  removeTag = function(elem) {
    var tag, target, value;
    removeClass(elem, 'selected');
    target = elem.parentNode.dataset.target;
    value = elem.dataset.value;
    tag = findTag(target, value);
    return tag.parentNode.removeChild(tag);
  };

  toggleTag = function(elem) {
    if (hasClass(elem, 'selected')) {
      return removeTag(elem);
    } else {
      return addTag(elem);
    }
  };

  initTags = function(dropdown) {
    return forEach(dropdown.querySelectorAll('li.selected'), function(li) {
      return addTag(li);
    });
  };

  ready(function() {
    forEachElement('form.custom select', function(select) {
      var div, dropdown;
      select.style.display = 'none';
      div = buildDiv();
      dropdown = buildDropdown(select);
      div.appendChild(buildPilot());
      div.appendChild(dropdown);
      setPilot(dropdown);
      initTags(dropdown);
      return select.parentNode.appendChild(div);
    });
    addEventListener(document, 'click', '.custom-dropdown-button', function(e) {
      var dropdown, others;
      e.preventDefault();
      e.stopPropagation();
      dropdown = this.nextSibling;
      if (hasClass(dropdown, 'open')) {
        return removeClass(dropdown, 'open');
      } else {
        others = closest(dropdown, 'form.custom').querySelectorAll('.custom-dropdown-options.open');
        removeClass(others, 'open');
        return addClass(dropdown, 'open');
      }
    });
    addEventListener(document, 'click', 'ul.custom-dropdown-options > li', function(e) {
      var dropdown, previous;
      e.preventDefault();
      e.stopPropagation();
      dropdown = this.parentNode;
      if (dropdown.dataset.type === 'single') {
        previous = dropdown.querySelector('li.selected');
        if (previous && previous !== this) {
          removeTag(previous);
        }
      }
      toggleTag(this);
      return setPilot(dropdown);
    });
    addEventListener(document, 'click', null, function(e) {
      var dropdown, li, tag;
      if (hasClass(e.target, 'dropdown-tag')) {
        e.preventDefault();
        tag = e.target;
        dropdown = document.querySelector("[data-target='" + tag.dataset.reftarget + "']");
        li = dropdown.querySelector("[data-value='" + tag.dataset.refvalue + "']");
        removeTag(li);
        return setPilot(dropdown);
      }
    });
    return addEventListener(document, 'click', null, function() {
      var dropdowns;
      dropdowns = document.querySelectorAll('.custom-dropdown-options.open');
      return removeClass(dropdowns, 'open');
    });
  });

}).call(this);
