import domready from '../../assets/js/domready';
import {delay} from 'lodash'

const attrExpanded = 'aria-expanded'
const classOpen = 'has-nav-open'

domready(() => {
  const btn = document.querySelector('.js-menu-btn')
  const nav = document.querySelector('.js-nav')

  if (!btn || !nav) return false

  const openLabel = btn.innerHTML
  const closeLabel = btn.getAttribute('data-close-label')

  const navList = document.querySelector('.js-nav-list')

  const addOpenListeners = () => {
    btn.addEventListener('click', open)
  }

  const addCloseListeners = () => {
    document.body.addEventListener('click', close)
    document.body.addEventListener('touchend', close)
  }

  const close = (e) => {
    let dontClose = false
    if (e) {
      let selectedNode = e.target
      while (!dontClose && selectedNode.parentNode) {
        selectedNode = selectedNode.parentNode
        dontClose = selectedNode === navList
      }
    }

    if (dontClose) return false

    document.body.classList.remove(classOpen)
    document.body.removeEventListener('click', close)
    document.body.removeEventListener('touchend', close)

    btn.innerHTML = openLabel
    btn.setAttribute(attrExpanded, 'false')
    if (e && e.target === btn) {
      e.preventDefault()
    }
    addOpenListeners()
  }

  const open = (e) => {
    e.preventDefault()
    document.body.classList.add(classOpen)
    btn.removeEventListener('click', open)
    btn.setAttribute(attrExpanded, 'true')
    btn.innerHTML = closeLabel
    delay(addCloseListeners, 10)
  }

  close()
})
