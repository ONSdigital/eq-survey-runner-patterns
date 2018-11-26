import {forEach} from 'lodash'
import domready from '../../assets/js/domready';

export const classHasJs = 'has-js'
export const classCollapsible = 'js-collapsible'
export const classCollapsibleSimple = 'js-collapsible-simple'
export const classCollapsibleContent = 'js-collapsible-content'
export const classCollapsibleTitle = 'js-collapsible-title'
export const classCollapsibleBody = 'js-collapsible-body'
export const classExpanded = 'is-expanded'
export const classToggle = 'js-collapsible-toggle'
export const classCollapsibleToggleAll = 'js-collapsible-toggle-all'
export const classClose = 'js-collapsible-close'

export const attrHidden = 'aria-hidden'
export const attrExpanded = 'aria-expanded'
export const attrMultiselectable = 'aria-multiselectable'
export const attrControls = 'aria-controls'
export const attrSelected = 'aria-selected'

export const ga = 'data-ga'
export const gaCategory = 'data-ga-category'
export const gaAction = 'data-ga-action'
export const gaLabel = 'data-ga-label'

class Collapsible {
  constructor() {
    this.openItems = 0
  }

  registerDom(rootEl) {
    rootEl.classList.add(classHasJs)
    const content = rootEl.getElementsByClassName(classCollapsibleContent)[0]

    rootEl.classList.contains(classCollapsibleSimple) ? this.multi = false : this.multi = true

    this.titles = forEach(
      rootEl.getElementsByClassName(classCollapsibleTitle),
      (el, index) => { this.registerTitle(el, index) }
    )

    this.bodys = forEach(
      rootEl.getElementsByClassName(classCollapsibleBody),
      (el, index) => { this.registerBody(el, index) }
    )

    this.toggleAllTrigger = forEach(
      rootEl.getElementsByClassName(classCollapsibleToggleAll),
      el => { this.registerToggleAll(el) }
    )

    this.closeTrigger = forEach(
      rootEl.getElementsByClassName(classClose),
      el => { this.registerClose(el) }
    )

    if (!this.multi) {
      forEach(this.titles, el => { el.setAttribute('tabindex', '0') })
    } else {
      content.setAttribute(attrMultiselectable, 'true')
      content.setAttribute('role', 'tablist')
    }
  }

  registerTitle(element, index) {
    // Better screen reader interaction
    element.setAttribute('id', 'collapsible-title-' + index)
    element.setAttribute(attrControls, 'collapsible-body-' + index)
    element.setAttribute(attrExpanded, 'false')
    element.setAttribute(attrSelected, 'false')

    const category = element.getAttribute(gaCategory)
    const action = element.getAttribute(gaAction)
    const label = element.getAttribute(gaLabel)

    if (element.classList.contains(classExpanded)) {
      element.setAttribute(attrExpanded, 'true')
      this.openItems += 1
    }

    if (this.multi) {
      element.setAttribute('role', 'tab')
      // Add the title GA attributes to the child span
      element.firstElementChild.setAttribute(ga,'click')
      element.firstElementChild.setAttribute(gaCategory,category)
      element.firstElementChild.setAttribute(gaAction,action)
      element.firstElementChild.setAttribute(gaLabel,label)
    }

    element.addEventListener('click', e => {
      e.preventDefault()
      this.toggle(element)
    })

    element.addEventListener('keydown', e => {
      this.keyboardInteraction(element, e)
    })
  }

  registerBody(element, index) {
    // Better screen reader interaction
    element.setAttribute('id', 'collapsible-body-' + index)
    element.setAttribute('aria-labelledby', 'collapsible-title-' + index)
    element.setAttribute(attrHidden, 'true')

    if (this.multi) {
      element.setAttribute('role', 'tabpanel')
    }
  }

  registerToggleAll(toggleAllEl) {
    toggleAllEl.addEventListener('click', e => {
      e.preventDefault()
      if (toggleAllEl.getAttribute(attrHidden) === 'true'){
        forEach(this.titles, el => { this.open(el) })
        toggleAllEl.setAttribute(attrHidden, 'false')
      } else {
        forEach(this.titles, el => { this.close(el) })
        toggleAllEl.setAttribute(attrHidden, 'true')
      }
      if (this.multi) {
        this.updateOpenCloseTriggerDisplay()
      }
    })
  }

  registerClose(element) {
    element.addEventListener('click', e => {
      e.preventDefault()
      this.close(this.titles[0])
    })
  }

  updateOpenCloseTriggerDisplay() {
    if (this.openItems / this.titles.length < 1) {
      forEach(this.toggleAllTrigger, trigger => this.hide(trigger))
    } else {
      forEach(this.toggleAllTrigger, trigger => this.show(trigger))
    }
  }

  toggle(element) {
    if (element.getAttribute(attrExpanded) === 'true') {
      this.close(element)
    } else {
      this.open(element)
    }

    this.updateOpenCloseTriggerDisplay()
  }

  open(titleEl) {
    if (titleEl.getAttribute(attrExpanded) === 'true') return
    let action = 'Open panel'
    titleEl.setAttribute(gaAction, action)

    if (this.multi) {
      const toggleBtn = titleEl.getElementsByClassName(classToggle)[0]
      const closeLabel = toggleBtn.getAttribute('data-close-label')
      toggleBtn.innerHTML = closeLabel
      toggleBtn.setAttribute(gaAction, action)
    }

    const bodyEl = titleEl.nextElementSibling
    titleEl.classList.add(classExpanded)
    titleEl.setAttribute(attrExpanded, true)
    titleEl.setAttribute(attrSelected, true)

    bodyEl.classList.add(classExpanded)
    bodyEl.setAttribute(attrHidden, false)

    this.openItems += 1
  }

  close(titleEl) {
    if (titleEl.getAttribute(attrExpanded) === 'false') return
    let action = 'Close panel'
    titleEl.setAttribute(gaAction, action)

    if (this.multi) {
      const toggleBtn = titleEl.getElementsByClassName(classToggle)[0]
      const openLabel = toggleBtn.getAttribute('data-open-label')

      toggleBtn.innerHTML = openLabel
      toggleBtn.setAttribute(gaAction, action)
    }

    const bodyEl = titleEl.nextElementSibling

    titleEl.classList.remove(classExpanded)
    titleEl.setAttribute(attrExpanded, false)
    titleEl.setAttribute(attrSelected, false)

    bodyEl.classList.remove(classExpanded)
    bodyEl.setAttribute(attrHidden, true)

    this.openItems -= 1
  }

  hide(element) {
    const openAllLabel = element.getAttribute('data-open-all-label')
    element.innerHTML = openAllLabel
    element.setAttribute('data-ga-label', 'Close all')
  }

  show(element) {
    const closeAllLabel = element.getAttribute('data-close-all-label')
    element.innerHTML = closeAllLabel
    element.setAttribute('data-ga-label', 'Open all')
  }

  keyboardInteraction(elem, e) {
    const keyCode = e.which
    switch (keyCode) {
      // Enter/Space
      case 13:
      case 32:
        e.preventDefault()
        e.stopPropagation()

        // Show answer content
        this.toggle(elem)
        break
    }
  }
}

export default function collapsible() {
  const elCollapsible = document.getElementsByClassName(classCollapsible)

  forEach(elCollapsible, element => new Collapsible().registerDom(element))
}

domready(collapsible)
