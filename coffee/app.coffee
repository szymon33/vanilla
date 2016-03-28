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

addEventListener = (el, eventName, handler) ->
  if (el.addEventListener)
    el.addEventListener(eventName, handler, false)
  else
    el.attachEvent 'on' + eventName, ->
      handler.call(el)

addClass = (el, className) ->
  if (el.classList)
    el.classList.add(className)
  else
    el.className += ' ' + className

removeClass = (el, className) ->
  make = (inner, className) ->
    if (inner.classList)
      inner.classList.remove(className)
    else if inner.className
      inner.className = inner.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ')
    return
  if el.length
    forEach el, (item) -> make(item, className)
  else
    make(el, className)

hasClass = (el, className) ->
  if (el.classList)
    el.classList.contains(className)
  else
    new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className)
  return

#
# App Class (act like dropdown menu)
#

App = () ->
  @selected = null

  forEach document.querySelectorAll('form.custom select'), (select) =>
    select.style.display = 'none'
    new Dropdown(@, select)

  addEventListener document, 'click', =>
    if !!@selected
      removeClass(@selected, 'open')
      @selected = null
    return

App.prototype.select = ($dropdown) ->
  if $dropdown == @selected
    removeClass($dropdown, 'open')
    @selected = null
  else
    removeClass(@selected, 'open') if !!@selected
    addClass($dropdown, 'open')
    @selected = $dropdown
  return

#
# Tag Class Implementation
#

Tag = (maker, subject) ->
  @maker = maker
  @$subject = subject
  addClass(@$subject, 'selected')
  @$container = document.getElementById('tags')
  @$el = @el()
  @$container.appendChild(@$el)
  @

Tag.prototype.el = ->
  el = document.createElement('a')
  el.className = 'dropdown-tag'
  el.innerHTML = @$subject.innerHTML
  el.href = '#'
  addEventListener el, 'click', (e) =>
    e.preventDefault()
    @destroy()
  el

Tag.prototype.destroy = ->
  removeClass(@$subject, 'selected')
  @$container.removeChild(@$el)
  @maker.removeFromTags(@)

#
# Dropdown Class Implementation
#

Dropdown = (collection, select) ->
  @collection = collection
  @tags = []
  @type = select.getAttribute('multiple') || 'single'
  @defaultPrompt = select.dataset.prompt || "Choose..."
  @$el = @el()
  @$dropdown = @dropdown()
  @$pilot = @pilot()
  forEach select.querySelectorAll('option'), (option) =>
    @$dropdown.appendChild(@buildItem(option))
  @$el.appendChild(@$pilot)
  @$el.appendChild(@$dropdown)
  select.parentNode.appendChild(@$el)
  @setPilot()
  @

Dropdown.prototype.el = ->
  el = document.createElement('div')
  el.className = 'custom-dropdown-area'
  el

Dropdown.prototype.dropdown = ->
  ul = document.createElement('ul')
  ul.className = 'f-dropdown custom-dropdown-options'
  ul

Dropdown.prototype.pilot = ->
  pilot = document.createElement('a')
  pilot.className = 'custom-dropdown-button'
  pilot.href = '#'
  addEventListener pilot, 'click', (e) =>
    e.preventDefault()
    e.stopPropagation()
    @collection.select(@$dropdown)
  pilot

Dropdown.prototype.setPilot = ->
  if @$pilot.textContent != undefined
    @$pilot.textContent = @calculatePrompt()
  else
    @$pilot.innerText = @calculatePrompt()
  return

Dropdown.prototype.calculatePrompt = ->
  counter = @tags.length
  switch counter
    when 0 then @defaultPrompt
    when 1
      temp = @tags[0].$el
      (temp.textContent || temp.innerText)
    else counter.toString() + ' items'

Dropdown.prototype.buildItem = (option) ->
  li = document.createElement('li')
  li.className = 'option-item'
  li.innerHTML = option.innerHTML
  if option.getAttribute('selected') then @addToTags(new Tag(@, li))
  addEventListener li, 'click', (e) =>
    e.preventDefault()
    e.stopPropagation()
    if @type == 'single'
      previous = @tags[0]
      previous.destroy() if previous && previous.$subject != e.target
    @toggleTag(e.target)
  li

Dropdown.prototype.findTag = (search) ->
  for tag in @tags
    return tag if tag.$subject == search
  null

Dropdown.prototype.addToTags = (tag) ->
  @tags.push(tag)
  @setPilot()

Dropdown.prototype.removeFromTags = (tag) ->
  index = @tags.indexOf(tag)
  @tags.splice(index, 1) if (index > -1)
  @setPilot()

Dropdown.prototype.toggleTag = (li) ->
  tag = @findTag(li)
  if !!tag then tag.destroy() else @addToTags(new Tag(@, li))

#
# On DOM loaded
#

ready ->
  new App()
