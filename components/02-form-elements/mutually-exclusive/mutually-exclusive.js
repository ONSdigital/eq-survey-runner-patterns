import domready from '../../../assets/js/domready';
import updateAvailableChars from '../textarea/character-limit';
export const exclusiveWrapperClass = 'field--exclusive'
export const exclusiveGroupClass = 'js-exclusive-group';
export const checkboxClass = 'js-exclusive-checkbox';
export const voiceOverAlertClass = 'js-exclusive-alert';
export const attrCharLimitRef = 'data-char-limit-ref'

export default function mutuallyExclusiveInputs() {
  const exclusiveWrapperElements = document.getElementsByClassName(exclusiveWrapperClass);
  for (let exclusiveWrapperElement of exclusiveWrapperElements) {
    const exclusiveGroupElements = exclusiveWrapperElement.getElementsByClassName(exclusiveGroupClass);
    const checkboxElement = exclusiveWrapperElement.getElementsByClassName(checkboxClass)[0];
    const voiceOverAlertElement = exclusiveWrapperElement.getElementsByClassName(voiceOverAlertClass)[0];
    for (let exclusiveGroupElement of exclusiveGroupElements) {
      const elementType = exclusiveGroupElement.type;
      let event = elementType === 'checkbox' ? event = 'change' : event = 'input';
      exclusiveGroupElement.addEventListener(event, function() {
        voiceOverAlertElement.innerHTML = '';
        inputToggle(checkboxElement, voiceOverAlertElement, 'checkbox');
      });
    }

    checkboxElement.addEventListener('click', function() {
      for (let exclusiveGroupElement of exclusiveGroupElements) {
        const elementType = exclusiveGroupElement.type;
        inputToggle(exclusiveGroupElement, voiceOverAlertElement, elementType);
      }
    });
  }
}

export const inputToggle = function(inputEl, voiceOverAlertEl, elType) {
  let attr = inputEl.getAttribute('value')

  if (elType === 'checkbox' && inputEl.checked === true) {
    inputEl.checked = false;
  } else if (elType === 'select-one') {
    inputEl.selectedIndex = 0;
    attr = inputEl.getAttribute('data-value')
  } else {
    const charRef = document.querySelector(`#${inputEl.getAttribute(attrCharLimitRef)}`)
    attr = inputEl.getAttribute('data-value');

    if (elType !== 'checkbox') {
      inputEl.value = '';
    }

    if (charRef) {
      updateAvailableChars(inputEl, charRef);
    }
  }

  voiceOverAlertEl.append(attr + ' ' + voiceOverAlertEl.getAttribute('data-adjective') + '. ');
}

domready(mutuallyExclusiveInputs);
