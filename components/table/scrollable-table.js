
import domready from '../../assets/js/domready';

export const classTableScrollable = 'table-scrollable'
export const classTableScrollableContent = 'table-scrollable__content'
export const classTable = 'table'

class TableScroll {
    constructor(table) {
        this.table = table
        this.tableScroll = this.table.getElementsByClassName(classTableScrollableContent)
        this.tableEl = this.tableScroll[0].getElementsByClassName(classTable)

        this.activeTable = false

        this.tableSizeCheck()
        this.viewportCheck()
    }

    tableSizeCheck(){
        this.tableWidth = this.tableEl[0].offsetWidth
        this.tableContainerWidth = this.tableScroll[0].offsetWidth

        if (this.tableWidth > this.tableContainerWidth && this.activeTable === false) {
            this.activeTable = true,
            this.insertShadows(),
            this.registerScroll()

        } else if (this.tableWidth <= this.tableContainerWidth && this.activeTable === true) {
            this.removeShadows(),
            this.activeTable = false
        }
    }

    viewportCheck(){
        window.addEventListener('resize', () => this.tableSizeCheck(), true)
    }

    registerScroll() {     
        this.tableScroll[0].addEventListener('scroll', this.toggleShadows.bind(this))
    }

    insertShadows() {
        const rightShadowEl = document.createElement('div')
        const leftShadowEl = document.createElement('div')

        rightShadowEl.className = 'right-shadow visible'
        leftShadowEl.className = 'left-shadow'

        this.tableScroll[0].append(rightShadowEl),
        this.tableScroll[0].prepend(leftShadowEl)
    }

    removeShadows() {
        const rightShadow = this.tableScroll[0].getElementsByClassName('right-shadow')
        const leftShadow = this.tableScroll[0].getElementsByClassName('left-shadow')

        this.tableScroll[0].removeChild(rightShadow[0]),
        this.tableScroll[0].removeChild(leftShadow[0])
    }

    toggleShadows() {
        const rightShadow = this.tableScroll[0].getElementsByClassName('right-shadow')
        const leftShadow = this.tableScroll[0].getElementsByClassName('left-shadow')
        const tableScrollPos = this.getOffset(this.tableScroll[0]).left
        const tablePos = this.getOffset(this.tableEl[0]).left

        this.tableWidth = this.tableEl[0].offsetWidth
        this.tableContainerWidth = this.tableScroll[0].offsetWidth

        tablePos === tableScrollPos ? leftShadow[0].classList.remove('visible') : leftShadow[0].classList.add('visible');

        -tableScrollPos === this.tableContainerWidth - this.tableWidth - tablePos ? rightShadow[0].classList.remove('visible') : rightShadow[0].classList.add('visible');

        setTimeout(function() {
            return leftShadow[0].classList.add('with-transition'),
                   rightShadow[0].classList.add('with-transition')
        }, 200)
    }
    
    getOffset(el) {
        const rect = el.getBoundingClientRect();
        return {
            left: rect.left + window.scrollX
        }
    }
}

export default function tableScroller() {
  const tableComponent = [...document.getElementsByClassName(classTableScrollable)]
  tableComponent.forEach(table => new TableScroll(table))
}
domready(tableScroller)
