import { throttle } from 'lodash';

import { sanitiseTypeaheadText } from './typeahead-helpers';
import { emboldenMatch } from '../../../assets/js/embolden-match';

const classTypeaheadCombobox = 'js-typeahead-combobox';
const classTypeaheadLabel = 'js-typeahead-label';
const classTypeaheadInput = 'js-typeahead-input';
const classTypeaheadPreview = 'js-typeahead-preview';
const classTypeaheadListbox = 'js-typeahead-listbox';
const classTypeaheadAriaStatus = 'js-typeahead-aria-status';

const classTypeaheadOption = 'typeahead__option';
const classTypeaheadOptionFocused = `${classTypeaheadOption}--focused`;
const classTypeaheadOptionNoResults = `${classTypeaheadOption}--no-results`;
const classTypeaheadOptionMoreResults = `${classTypeaheadOption}--more-results`;
const classTypeaheadComboboxFocused = 'typeahead__combobox--focused';
const classTypeaheadHasResults = 'typeahead--has-results';

const KEYCODE = {
  BACK_SPACE: 8,
  RETURN: 13,
  ENTER: 14,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  DELETE: 46
}

export default class Typeahead {
  constructor({ context, suggestionFunction, onSelect, onUnsetResult, minChars, resultLimit, sanitisedQueryReplaceChars }) {
    // DOM Elements
    this.context = context;
    this.combobox = context.querySelector(`.${classTypeaheadCombobox}`);
    this.label = context.querySelector(`.${classTypeaheadLabel}`);
    this.input = context.querySelector(`.${classTypeaheadInput}`);
    this.preview = context.querySelector(`.${classTypeaheadPreview}`);
    this.listbox = context.querySelector(`.${classTypeaheadListbox}`);
    this.ariaStatus = context.querySelector(`.${classTypeaheadAriaStatus}`);

    // Callbacks
    this.suggestionFunction = suggestionFunction;
    this.onSelect = onSelect;
    this.onUnsetResult = onUnsetResult;

    // Settings
    this.content = JSON.parse(context.getAttribute('data-content'));
    this.listboxId = this.listbox.getAttribute('id');
    this.minChars = minChars || 2;
    this.resultLimit = resultLimit || null;
    this.sanitisedQueryReplaceChars = sanitisedQueryReplaceChars || [];

    // State
    this.ctrlKey = false;
    this.deleting = false;
    this.query = '';
    this.sanitisedQuery = '';
    this.previousQuery = '';
    this.results = [];
    this.resultOptions = [];
    this.foundResults = 0;
    this.numberOfResults = 0;
    this.highlightedResultIndex = 0;
    this.settingResult = false;
    this.resultSelected = false;
    this.blurring = false;
    this.blurTimeout = null;

    // Modify DOM
    this.label.setAttribute('for', this.input.getAttribute('id'));
    this.context.classList.add('typeahead--initialised');
    this.bindEventListeners();

    // Debounced functions
    this.throttledGetSuggestions = throttle(this.getSuggestions.bind(this), 300);
  }

  bindEventListeners() {
    this.input.addEventListener('keydown', this.handleKeydown.bind(this));
    this.input.addEventListener('keyup', this.handleKeyup.bind(this));
    this.input.addEventListener('input', this.handleChange.bind(this));
    this.input.addEventListener('focus', this.handleFocus.bind(this));
    this.input.addEventListener('blur', this.handleBlur.bind(this));

    this.listbox.addEventListener('mouseover', this.handleMouseover.bind(this));
    this.listbox.addEventListener('mouseout', this.handleMouseout.bind(this));
  }

  handleKeydown(event) {
    if ((event.ctrlKey || event.metaKey) && event.keyCode !== KEYCODE.V) {
      this.ctrlKey = true;
    } else {
      this.ctrlKey = false;
    }

    switch (event.keyCode) {
      case KEYCODE.UP: {
        event.preventDefault();
        this.navigateResults(-1);
        break;
      }
      case KEYCODE.DOWN: {
        event.preventDefault();
        this.navigateResults(1);
        break;
      }
      case KEYCODE.ENTER:
      case KEYCODE.RETURN: {
        event.preventDefault();
        break;
      }
    }
  }

  handleKeyup(event) {
    switch (event.keyCode) {
      case KEYCODE.UP:
      case KEYCODE.DOWN: {
        event.preventDefault();
        break;
      }
      case KEYCODE.ENTER:
      case KEYCODE.RETURN: {
        this.selectResult();
        break;
      }
      case KEYCODE.LEFT:
      case KEYCODE.RIGHT: {
        break;
      }
    }

    this.ctrlKey = false;
  }

  handleChange() {
    this.clearPreview();
    if (!this.blurring) {
      this.throttledGetSuggestions();
    }
  }

  handleFocus() {
    clearTimeout(this.blurTimeout);
    this.combobox.classList.add(classTypeaheadComboboxFocused);
    this.throttledGetSuggestions();
  }

  handleBlur() {
    clearTimeout(this.blurTimeout);
    this.blurring = true;

    const exactMatchIndex = this.results.map(result => result.sanitisedText).indexOf(this.sanitisedQuery);

    if (exactMatchIndex !== -1) {
      this.selectResult(exactMatchIndex);
    }

    this.blurTimeout = setTimeout(() => {
      this.clearPreview();
      this.combobox.classList.remove(classTypeaheadComboboxFocused);
      this.blurring = false;
    }, 300);
  }

  handleMouseover() {
    const focusedItem = this.resultOptions[this.highlightedResultIndex];

    if (focusedItem) {
      focusedItem.classList.remove(classTypeaheadOptionFocused);
    }
  }

  handleMouseout() {
    const focusedItem = this.resultOptions[this.highlightedResultIndex];

    if (focusedItem) {
      focusedItem.classList.add(classTypeaheadOptionFocused);
    }
  }

  navigateResults(direction) {
    let index = 0;

    if (this.highlightedResultIndex !== null) {
      index = this.highlightedResultIndex + direction;
    }

    if (index < this.numberOfResults) {
      if (index < 0) {
        index = null;
      }

      this.setHighlightedResult(index);
    }
  }

  getSuggestions() {
    if (!this.settingResult) {
      const query = this.input.value;

      if (query !== this.query || !this.resultSelected) {
        this.unsetResults();
        this.setAriaStatus();

        this.query = query;
        this.sanitisedQuery = sanitiseTypeaheadText(query, this.sanitisedQueryReplaceChars);

        if (query.length >= this.minChars) {
          this.suggestionFunction(this.sanitisedQuery).then(results => {
            this.foundResults = results.length;

            if (this.resultLimit) {
              this.results = results.slice(0, this.resultLimit);
            } else {
              this.results = results;
            }

            this.results.forEach(result => {
              if (!result.sanitisedText) {
                result.sanitisedText = sanitiseTypeaheadText(result.text, this.sanitisedQueryReplaceChars);
              }

              if (result.alternatives && !result.sanitisedAlternatives) {
                result.sanitisedAlternatives = result.alternatives.map(alternative => sanitiseTypeaheadText(alternative, this.sanitisedQueryReplaceChars));
              }
            });

            this.numberOfResults = Math.max(this.results.length, 0);
            this.handleResults(this.results);
          });
        } else {
          this.clearListbox();
          this.clearPreview();
        }
      }
    }
  }

  unsetResults() {
    this.results = [];
    this.resultOptions = [];
    this.resultSelected = false;

    this.onUnsetResult();
    this.clearPreview();
  }

  clearListbox(preventAriaStatusUpdate) {
    this.listbox.innerHTML = '';
    this.context.classList.remove(classTypeaheadHasResults);
    this.input.removeAttribute('aria-activedescendant');
    this.combobox.removeAttribute('aria-expanded');

    if (!preventAriaStatusUpdate) {
      this.setAriaStatus();
    }
  }

  handleResults() {
    if (!this.deleting || (this.numberOfResults && this.deleting)) {
      if (this.numberOfResults.length === 1 && this.results[0].sanitisedText === this.sanitisedQuery) {
        this.clearListbox(true);
        this.selectResult(0);
      } else {
        this.listbox.innerHTML = '';
        this.resultOptions = this.results.map((result, index) => {
          let innerHTML = emboldenMatch(result.text, this.query);
          let ariaLabel = result.text;

          if (Array.isArray(result.sanitisedAlternatives)) {
            const alternativeMatch = result.sanitisedAlternatives.find(alternative => alternative !== result.sanitisedText && alternative.includes(this.sanitisedQuery));

            if (alternativeMatch) {
              const alternativeText = result.alternatives[result.sanitisedAlternatives.indexOf(alternativeMatch)];
              innerHTML += ` <small>(${emboldenMatch(alternativeText, this.query)})</small>`;
              ariaLabel += `, (${alternativeText})`;
            }
          }

          const listElement = document.createElement('li');
          listElement.className = classTypeaheadOption;
          listElement.setAttribute('id', `${this.listboxId}__option--${index}`);
          listElement.setAttribute('role', 'option');
          listElement.setAttribute('tabindex', '-1');
          listElement.setAttribute('aria-label', ariaLabel);
          listElement.innerHTML = innerHTML;

          listElement.addEventListener('click', () => {
            this.selectResult(index);
          });

          this.listbox.appendChild(listElement);

          return listElement;
        });

        if (this.numberOfResults < this.foundResults) {
          const listElement = document.createElement('li');
          listElement.className = `${classTypeaheadOption} ${classTypeaheadOptionMoreResults} pluto`;
          listElement.setAttribute('tabindex', '-1');
          listElement.setAttribute('aria-hidden', 'true');
          listElement.innerHTML = this.content.more_results;
          this.listbox.appendChild(listElement);
        }

        this.setHighlightedResult(null);
        this.combobox.setAttribute('aria-expanded', true);
        this.context.classList.add(classTypeaheadHasResults);
      }
    }

    if (this.numberOfResults === 0) {
      this.listbox.innerHTML = `<li class="${classTypeaheadOption} ${classTypeaheadOptionNoResults}">${this.content.no_results}</li>`;
      this.combobox.setAttribute('aria-expanded', true);
      this.context.classList.add(classTypeaheadHasResults);
    }
  }

  setHighlightedResult(index) {
    this.highlightedResultIndex = index;

    if (this.setHighlightedResult === null) {
      this.input.removeAttribute('aria-activedescendant');
    } else if (this.numberOfResults) {
      this.resultOptions.forEach((option, optionIndex) => {
        if (optionIndex === index) {
          option.classList.add(classTypeaheadOptionFocused);
          option.setAttribute('aria-selected', true);
          this.input.setAttribute('aria-activedescendant', option.getAttribute('id'));
        } else {
          option.classList.remove(classTypeaheadOptionFocused);
          option.removeAttribute('aria-selected');
        }
      });

      this.setPreview(index);
      this.setAriaStatus();
    }
  }

  setPreview(index) {
    const result = this.results[index || 0];
    const queryIndex = result.text.toLowerCase().indexOf(this.query.toLowerCase());

    if (queryIndex === 0 && this.query.length !== result.text.length) {
      this.preview.value = `${this.query}${result.text.slice(this.query.length)}`;
    } else {
      this.clearPreview();
    }
  }

  setAriaStatus(content) {
    if (!content) {
      const queryTooShort = this.sanitisedQuery.length < this.minChars;
      const noResults = this.numberOfResults === 0;

      if (queryTooShort) {
        content = this.content.aria_min_chars;
      } else if (noResults) {
        content = `${this.content.aria_no_results}: "${this.query}"`;
      } else if (this.numberOfResults === 1) {
        content = this.content.aria_one_result;
      } else {
        content = this.content.aria_n_results.replace('{n}', this.numberOfResults);

        if (this.resultLimit && this.foundResults > this.resultLimit) {
          content += ` ${this.content.aria_limited_results}`;
        }
      }
    }

    this.ariaStatus.innerHTML = content;
  }

  clearPreview() {
    this.preview.value = '';
  }

  selectResult(index) {
    if (this.results.length) {
      this.settingResult = true;

      const result = this.results[index || this.highlightedResultIndex || 0];

      this.input.value = result.text;
      this.query = result.text;
      this.resultSelected = true;

      this.onSelect(result).then(() => {
        this.settingResult = false;
        // this.input.setAttribute('autocomplete', 'false');
      });

      let ariaAlternativeMessage = '';

      if (!result.sanitisedText.includes(this.sanitisedQuery)) {
        const alternativeMatch = result.sanitisedAlternatives.find(alternative => alternative.includes(this.sanitisedQuery));

        if (alternativeMatch) {
          ariaAlternativeMessage = `, ${this.content.aria_found_by_alternative_name}: ${alternativeMatch}`
        }
      }

      const ariaMessage = `${this.content.aria_you_have_selected}: ${result.text}${ariaAlternativeMessage}.`;

      this.clearListbox();
      this.clearPreview();
      this.setAriaStatus(ariaMessage);
    }
  }
}
