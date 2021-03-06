// Tabs component JS

// The tab js is based on the GDS tabs component(https://design-system.service.gov.uk/components/tabs/) 
// https://github.com/alphagov/govuk-frontend/blob/master/src/components/tabs/tabs.js

import domready from '../../assets/js/domready';
import {get} from "../../assets/js/api/_sdcModules";

export const classTabs = 'tabs'
export const classTab = 'tab'
export const classTabList = 'tabs__list'
export const classTabListItems = 'tab__list-item'
export const classTabsPanel = 'tabs__panel'

const utilsModule = get('utils');

class Tabs {
    constructor(component) {
      this.keys = { left: 37, right: 39, spacebar: 32 }
      this.boundTabClick = this.onTabClick.bind(this)  
      this.boundTabKeydown = this.onTabKeydown.bind(this)

      this.component = component
      this.tabs = [...component.getElementsByClassName(classTab)]
      this.tabList = component.getElementsByClassName(classTabList)
      this.tabListItems = [...component.getElementsByClassName(classTabListItems)]
      this.tabPanels = [...component.getElementsByClassName(classTabsPanel)]
      
      this.jsHiddenClass = 'tabs__panel--hidden'
      this.jsTabListAsListClass = 'tabs__list--list'
      this.jsTabItemAsListClass = 'tab__list-item--list'
      this.jsTabAsListClass = 'tab--list'

      if (utilsModule.matchMedia.hasMatchMedia()) {
          this.setupViewportChecks()
      } else {
          this.makeTabs()
      }
    }

    // Set up checks for responsive functionality
    // The tabs will display as tabs for >40rem viewports
    // Tabs will display as a TOC list and show full content for <40rem viewports 
    // Aria tags are added only for >40rem viewports
    setupViewportChecks() {
        console.log(utilsModule)
        this.viewport = utilsModule.matchMedia('(min-width: 40rem)')
        this.viewport.addListener(this.checkViewport.bind(this))
        this.checkViewport()
    }

    checkViewport () {
        if (this.viewport.matches) {
            this.makeTabs()
        } else {
            this.makeList()
        }
    }

    makeTabs() {
        if (!this.tabs || !this.tabList || !this.tabListItems) {
            return
        }

        this.tabList[0].setAttribute('role', 'tablist')
        this.tabList[0].classList.remove(this.jsTabListAsListClass)

        this.tabPanels.forEach(panel => {
            panel.setAttribute('tabindex', '0') 
        })      

        this.tabListItems.forEach(item => {
            item.setAttribute('role', 'presentation') 
            item.classList.remove(this.jsTabItemAsListClass)
        })      

        this.tabs.forEach(tab => {
            this.setAttributes(tab)
            tab.classList.remove(this.jsTabAsListClass)
    
            tab.addEventListener('click', this.boundTabClick, true)
            tab.addEventListener('keydown', this.boundTabKeydown, true)
            this.hideTab(tab)
        })

        const activeTab = this.getTab(window.location.hash) || this.tabs[0]
        this.showTab(activeTab)

        this.component.boundOnHashChange = this.onHashChange.bind(this)
        window.addEventListener('hashchange', this.component.boundOnHashChange, true)
    }

    makeList() {
        if (!this.tabs || !this.tabList || !this.tabListItems) {
            return
        }

        this.tabList[0].removeAttribute('role')
        this.tabList[0].classList.add(this.jsTabListAsListClass)

        this.tabPanels.forEach(panel => {
            panel.removeAttribute('tabindex', '0') 
        })   

        this.tabListItems.forEach(item => {
            item.removeAttribute('role', 'presentation') 
            item.classList.add(this.jsTabItemAsListClass)
        })      

        this.tabs.forEach(tab => {  
            tab.removeEventListener('click', this.boundTabClick, true)
            tab.removeEventListener('keydown', this.boundTabKeydown, true)
            tab.classList.add(this.jsTabAsListClass)
            this.unsetAttributes(tab)
        })

        window.removeEventListener('hashchange', this.component.boundOnHashChange, true)
    }

    // Handle haschange so that the browser can cycle through the tab history
    onHashChange() {
        const hash = window.location.hash
        const tabWithHash = this.getTab(hash)
        if (!tabWithHash) {
            return
        }

        if (this.changingHash) {
            this.changingHash = false
            return
        }

        var previousTab = this.getCurrentTab()

        this.hideTab(previousTab)
        this.showTab(tabWithHash)
        tabWithHash.focus()
    }

    hideTab(tab) {
        this.unhighlightTab(tab)
        this.hidePanel(tab)
    }

    showTab(tab) {
        this.highlightTab(tab)
        this.showPanel(tab)
    }

    getTab(hash) {
        return this.component.querySelector('.tab[href="' + hash + '"]')
    }

    // Set aria tags
    setAttributes(tab) {
        const panelId = this.getHref(tab).slice(1)
        tab.setAttribute('id', 'tab_' + panelId)
        tab.setAttribute('role', 'tab')
        tab.setAttribute('aria-controls', panelId)
        tab.setAttribute('tabindex', '-1')

        const panel = this.getPanel(tab)
        panel.setAttribute('role', 'tabpanel')
        panel.setAttribute('aria-labelledby', tab.id)
        panel.classList.add(this.jsHiddenClass)
    }

    // Remove aria tags for TOC view
    unsetAttributes(tab) {
        tab.removeAttribute('id')
        tab.removeAttribute('role')
        tab.removeAttribute('aria-controls')
        tab.removeAttribute('tabindex')
        tab.removeAttribute('aria-selected')

        const panel = this.getPanel(tab)
        panel.removeAttribute('role')
        panel.removeAttribute('aria-labelledby')
        panel.classList.remove(this.jsHiddenClass)
    }

    onTabClick(e) {
        e.preventDefault()
        const newTab = e.target
        const currentTab = this.getCurrentTab()
        this.hideTab(currentTab)
        this.showTab(newTab)
        this.createHash(newTab)
    }

    createHash(tab) {
        const panel = this.getPanel(tab)
        var id = panel.id
        panel.id = ''
        this.changingHash = true
        window.location.hash = this.getHref(tab).slice(1)
        panel.id = id
    }

    onTabKeydown(e) {
        switch (e.keyCode) {
            case this.keys.left:
                this.focusPreviousTab()
                e.preventDefault()
            break
            case this.keys.right:
                this.focusNextTab()
                e.preventDefault()
            break
            case this.keys.spacebar:
                this.onTabClick(e)
            break
        }
    }

    focusNextTab() {
        const focusedTab = this.getFocusedTab()
        const nextTabListItem = focusedTab.parentNode.nextElementSibling
        if (nextTabListItem) {
            nextTabListItem.firstElementChild.focus()
        }
    }

    focusPreviousTab() {
        const focusedTab = this.getFocusedTab()
        const previousTabListItem = focusedTab.parentNode.previousElementSibling
        if (previousTabListItem) {
            previousTabListItem.firstElementChild.focus()

        }
    }

    getPanel(tab) {
        const panel = this.component.querySelector(this.getHref(tab))
        return panel
    }

    showPanel(tab) {
        const panel = this.getPanel(tab)
        panel.classList.remove(this.jsHiddenClass)
    }

    hidePanel(tab) {
        const panel = this.getPanel(tab)
        panel.classList.add(this.jsHiddenClass)
    }

    unhighlightTab(tab) {
        tab.setAttribute('aria-selected', 'false')
        tab.classList.remove('tab--selected')
        tab.setAttribute('tabindex', '-1')
    }

    highlightTab(tab) {
        tab.setAttribute('aria-selected', 'true')
        tab.classList.add('tab--selected')
        tab.setAttribute('tabindex', '0')
    }

    getFocusedTab() {
        return document.activeElement
    }

    getCurrentTab() {
        return this.component.querySelector('.tab--selected')
    }

    getHref(tab) {
        const href = tab.getAttribute('href')
        const hash = href.slice(href.indexOf('#'), href.length)
        return hash
    }
}

export default function tabs() {
    const tabsComponent = [...document.getElementsByClassName(classTabs)]
    tabsComponent.forEach(component => new Tabs(component))
}

domready(tabs)
