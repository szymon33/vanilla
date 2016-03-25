#
# Helper Methods
#

forEach = Function.prototype.call.bind( Array.prototype.forEach )

ready = (fn) ->
  if (document.readyState != 'loading')
    fn()
  else if (document.addEventListener)
    document.addEventListener('DOMContentLoaded', fn)
  else
    document.attachEvent 'onreadystatechange', ->
      fn() if (document.readyState != 'loading')

addEventListener = (el, eventName, filter, handler) ->
  make = (inner, eventName, handler) ->
    if (inner.addEventListener)
      inner.addEventListener(eventName, handler, false)
    else
      inner.attachEvent 'on' + eventName, ->
        handler.call(inner)
  if filter?
    forEach el.querySelectorAll(filter), (node) ->
      make(node, eventName, handler)    
  else
    make(el, eventName, handler)

forEachElement = (selector, fn) ->
  forEach document.querySelectorAll(selector), (node) -> fn(node)

addClass = (el, className) ->
  if (el.classList) then el.classList.add(className) else el.className += ' ' + className

removeClass = (el, className) ->
  make = (inner, className) ->
    if (inner.classList)
      inner.classList.remove(className)
    else if inner.className
      inner.className = inner.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
  if el.length
    forEach el, (item) -> make(item, className)
  else
    make(el, className)

hasClass = (el, className) ->
  if (el.classList)
    el.classList.contains(className)
  else
    new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className)

closest = (el, selector) ->
  while(el)
    el = el.parentNode
    if (el.matches || el.matchesSelector || el.msMatchesSelector || el.mozMatchesSelector || el.webkitMatchesSelector || el.oMatchesSelector).call(el, selector)
      break
  el

#
# Implementation
#

buildDiv = ->
  div = document.createElement('div')
  div.className = 'custom-dropdown-area'
  div

buildPilot = ->
  pilot = document.createElement('a')
  pilot.className = 'custom-dropdown-button'
  pilot.href = '#'
  pilot

setPilot = (dropdown) ->
  pilot = dropdown.previousSibling
  if (pilot.textContent != undefined)
    pilot.textContent = calculatePrompt(dropdown)
  else
    pilot.innerText = calculatePrompt(dropdown)
  pilot

buildDropdownItem = (option) ->
  li = document.createElement('li')
  li.className = 'option-item'
  li.dataset.value = option.value
  span = document.createElement('span')
  span.className = 'option-title'
  span.innerHTML = option.innerHTML
  li.appendChild(span)
  if option.getAttribute('selected') then addClass(li, 'selected') else removeClass(li, 'selected')
  li

buildDropdown = (select) ->
  type = if select.getAttribute('multiple') then 'multiple' else 'single'
  ul = document.createElement('ul')
  ul.className = 'f-dropdown custom-dropdown-options'
  ul.dataset.prompt = select.dataset.prompt
  ul.dataset.type = type
  ul.dataset.target = '#' + select.getAttribute('id')
  forEach select.querySelectorAll('option'), (option) -> ul.appendChild(buildDropdownItem(option))
  ul

calculatePrompt = (ul) ->
  defaultPrompt = if ul.dataset.prompt == 'undefined' then "Choose..." else ul.dataset.prompt
  selectedItems = ul.querySelectorAll('li.selected').length || 0
  return switch selectedItems
    when 0 then defaultPrompt
    when 1
      temp = ul.querySelector('li.selected')
      (temp.textContent || temp.innerText)
    else selectedItems.toString() + ' items'

findTag = (target, value) ->
  selector = "[data-reftarget='" + target + "'][data-refvalue='" + value + "']"
  document.getElementById('tags').querySelector(selector)

addTag = (elem) ->
  addClass(elem, 'selected')
  target = elem.parentNode.dataset.target
  value =  elem.dataset.value
  if findTag(target, value) == null
    tag = document.createElement('a')
    tag.className = 'dropdown-tag'
    tag.dataset.reftarget = target
    tag.dataset.refvalue = value
    tag.innerHTML = value
    document.getElementById('tags').appendChild(tag)

removeTag = (elem) ->
  removeClass(elem, 'selected')
  target = elem.parentNode.dataset.target
  value =  elem.dataset.value
  tag = findTag(target, value)
  tag.parentNode.removeChild(tag)

toggleTag = (elem) ->
  if hasClass(elem, 'selected') then removeTag(elem) else addTag(elem)

initTags = (dropdown) ->
  forEach dropdown.querySelectorAll('li.selected'), (li) -> addTag(li)

#
# On DOM loaded
#

ready ->
  forEachElement 'form.custom select', (select) ->
    select.style.display = 'none'
    div = buildDiv()
    dropdown = buildDropdown(select)
    div.appendChild(buildPilot())
    div.appendChild(dropdown)
    setPilot(dropdown)
    initTags(dropdown)
    select.parentNode.appendChild(div)

  addEventListener document, 'click', '.custom-dropdown-button', (e) ->
    e.preventDefault()
    e.stopPropagation()
    dropdown = @.nextSibling
    if hasClass(dropdown, 'open')
      removeClass(dropdown, 'open')
    else
      # close others, act like menu
      others = closest(dropdown, 'form.custom').querySelectorAll('.custom-dropdown-options.open')
      removeClass(others, 'open')
      addClass(dropdown, 'open')

  addEventListener document, 'click', 'ul.custom-dropdown-options > li', (e) ->
    e.preventDefault()
    e.stopPropagation()
    dropdown = @.parentNode
    if dropdown.dataset.type == 'single'
      previous = dropdown.querySelector('li.selected')
      removeTag(previous) if previous && previous != @
    toggleTag(@)
    setPilot(dropdown)

  addEventListener document, 'click', null, (e) ->
    if hasClass(e.target, 'dropdown-tag')
      e.preventDefault()
      tag = e.target
      dropdown = document.querySelector("[data-target='" + tag.dataset.reftarget + "']")
      li =  dropdown.querySelector("[data-value='" + tag.dataset.refvalue + "']")
      removeTag(li)
      setPilot(dropdown)

  addEventListener document, 'click', null, ->
    dropdowns = document.querySelectorAll('.custom-dropdown-options.open')
    removeClass(dropdowns, 'open')
