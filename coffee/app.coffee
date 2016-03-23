jQuery ->
  buildDiv = ->
    div = $("<div class='custom-dropdown-area'></div>")

  buildPilot = (promptTxt) ->
    pilot = $("<a href='#' class='custom-dropdown-button'>" + promptTxt + "</a>")

  buildDropdown = (select) ->
    type = if select.prop('multiple') then 'multiple' else 'single'
    ul = $("<ul class='f-dropdown custom-dropdown-options' data-prompt='" +
      select.data('prompt') + 
      "' data-type='" + type +
      "' data-target='#" + select.prop('id') +
      "'></ul>")
    select.find('option').each ->
      li = $("<li class='option-item' data-value='" +
        $(@).val() +
        "'><span class='option-title'>" +
        $(@).html() +
        "</span></li>")
      if $(@).attr('selected') then $(li).addClass('selected') else $(li).removeClass('selected')
      ul.append(li)
    ul

  calculatePrompt = (ul) ->
    defaultPrompt = if ul.data('prompt') == 'undefined' then "Choose..." else ul.data('prompt')
    selectedItems = ul.find('li.selected').length || 0
    return switch selectedItems
      when 0 then defaultPrompt
      when 1 then ul.find('li.selected').text()
      else selectedItems.toString() + ' items'

  findTag = (target, value) ->
    $('#tags').find("[data-ref-target='" + target + "'][data-ref-value='" + value + "']")

  addTag = (elem) ->
    $(elem).addClass('selected')
    target = $(elem).parent().data('target')
    value =  $(elem).data('value')
    if findTag(target, value).length == 0
      tag = $("<a href='#' data-ref-target='" + 
        target + 
        "' data-ref-value='" +
        value +
        "' class='dropdown-tag'><span>" +
        value +
        "</span></a>")
      $('#tags').append(tag)

  removeTag = (elem) ->
    $(elem).removeClass('selected')
    target = $(elem).parent().data('target')
    value =  $(elem).data('value')
    tag = findTag(target, value)
    $(tag).remove()

  toggleTag = (elem) ->
    if $(elem).hasClass('selected')
      removeTag(elem)
    else
      addTag(elem)

  initTags = (dropdown) ->
    $(dropdown).find('li.selected').each ->
      addTag(@)

  $('form.custom select').each ->
    $(@).hide()
    select = $(@)
    selectId = select.attr('id')
    div = buildDiv()
    dropdown = buildDropdown(select)
    initTags(dropdown)
    promptTxt = calculatePrompt(dropdown)
    pilot = buildPilot(promptTxt)
    div.append(pilot)
    div.append(dropdown)
    select.after(div)

  $(document).on 'click', 'ul.custom-dropdown-options > li', ->
    dropdown = $(@).parent()
    pilot = dropdown.prev('.custom-dropdown-button')
    if dropdown.data('type') == 'single'
      previous = dropdown.find('li.selected')
      removeTag(previous) unless previous[0] == @
    toggleTag(@)
    promptTxt = calculatePrompt(dropdown)
    pilot.text(promptTxt)

  $(document).on 'click', '.custom-dropdown-button', ->
    dropdown = $(@).next('.custom-dropdown-options')
    if dropdown.hasClass('open')
      dropdown.removeClass('open')
    else
      dropdown.closest('form.custom').find('.custom-dropdown-options.open').removeClass('open')
      dropdown.addClass('open')

  $(document).on 'click', '.dropdown-tag', ->
    dropdown = $(document).find("[data-target='" + $(@).data('ref-target') + "']")
    li =  $(dropdown).find("[data-value='" + $(@).data('ref-value') + "']")
    removeTag(li)
