const classTypeaheadCombobox = 'js-typeahead-combobox';
const classTypeaheadInput = 'js-typeahead-input';
const classTypeaheadPreview = 'js-typeahead-preview';
const classTypeaheadListbox = 'js-typeahead-listbox';
const classTypeaheadAriaStatus = 'js-typeahead-aria-status';

const classTypeaheadOption = 'typeahead__option';
const classTypeaheadOptionFocused = `${classTypeaheadOption}--focused`;
const classTypeaheadOptionNoResults = `${classTypeaheadOption}--no-results`;
const classTypeaheadInputFocused = 'input--focused';

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
  constructor({ context, suggestionFunction, onSelect, onUnsetResult, minChars, resultLimit }) {
    // DOM Elements
    this.context = context;
    this.combobox = context.querySelector(`.${classTypeaheadCombobox}`);
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
    this.inputInitialAutocompleteSetting = this.input.getAttribute('autocomplete') || 'false';
    this.minChars = minChars || 2;
    this.resultLimit = resultLimit || null;

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
    this.context.classList.add('typeahead--initialised');
    this.bindEventListeners();
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
      case KEYCODE.BACK_SPACE:
      case KEYCODE.DELETE: {
        this.deleting = true;
        this.getSuggestions();
        break;
      }
      default: {
        if (!this.ctrlKey) {
          this.getSuggestions();
        }
      }
    }

    this.ctrlKey = false;
  }

  handleChange() {
    setTimeout(() => {
      if (!this.blurring) {
        this.getSuggestions();
      }
    }, 10);
  }

  handleFocus() {
    clearTimeout(this.blurTimeout);
    this.input.classList.add(classTypeaheadInputFocused);
    this.input.setAttribute('autocomplete', false);
    this.getSuggestions();
  }

  handleBlur() {
    clearTimeout(this.blurTimeout);
    this.blurring = true;

    const exactMatchIndex = this.results.indexOf(result => result.sanitisedText === this.sanitisedQuery);

    if (exactMatchIndex !== -1) {
      this.selectResult(exactMatchIndex);
    }

    this.blurTimeout = setTimeout(() => {
      this.clearPreview();
      this.clearListbox(true);
      this.input.classList.remove(classTypeaheadInputFocused);
      this.input.setAttribute('autocomplete', this.inputInitialAutocompleteSetting);
      this.blurring = false;
    }, 100);
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

    if (index <= this.numberOfResults) {
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
        this.query = query;
        this.sanitisedQuery = query.toLowerCase().replace(/\s\s+/g, ' ');

        this.unsetResults();
        this.setAriaStatus();

        if (query.length >= this.minChars) {
          this.suggestionFunction(query).then(results => {
            this.foundResults = results.length;

            if (this.resultLimit) {
              this.results = results.slice(0, this.resultLimit);
            } else {
              this.results = results;
            }

            this.numberOfResults = Math.max(this.results.length - 1, 0);

            this.handleResults(this.results);
          });
        } else {
          this.clearListbox();
          this.clearPreview();
        }
      } else {
        this.setAriaStatus();
      }
    }
  }

  unsetResults() {
    this.results = [];
    this.resultOptions = [];
    this.resultSelected = false;

    this.onUnsetResult();
    this.clearListbox();
    this.clearPreview();
  }

  clearListbox(preventAriaStatusUpdate) {
    this.listbox.innerHTML = '';
    this.input.removeAttribute('aria-activedescendant');
    this.combobox.removeAttribute('aria-expanded');

    if (!preventAriaStatusUpdate) {
      this.setAriaStatus();
    }
  }

  handleResults() {
    if (!this.deleting || (this.numberOfResults && this.deleting)) {
      if (this.numberOfResults.length === 1 && this.results[0].sanitisedText === this.sanitisedQuery) {
        this.selectResult(0);
      } else {
        this.resultOptions = this.results.map((result, index) => {
          let innerHTML = result.text;
          let ariaLabel = `${result.text}.`;

          const alternativeMatch = result.sanitisedAlternatives.find(alternative => alternative !== result.sanitisedText && alternative.includes(this.sanitisedQuery));

          if (alternativeMatch) {
            const alternativeText = result.alternatives[result.sanitisedAlternatives.indexOf(alternativeMatch)];
            innerHTML += ` <small>(${alternativeText})</small>`;
            ariaLabel += ` (${alternativeText}).`;
          }

          ariaLabel += ` (${index + 1} ${this.content.x_of_x} ${this.results.length})`;

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

        this.setHighlightedResult(null);
        this.combobox.setAttribute('aria-expanded', true);
      }
    }

    if (this.numberOfResults === 0) {
      this.listbox.innerHTML = `<li class="${classTypeaheadOption} ${classTypeaheadOptionNoResults}">${this.content.no_results}</li>`;
      this.combobox.setAttribute('aria-expanded', true);
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
    const queryIndex = result.text.toLowerCase().indexOf(this.sanitisedQuery);

    if (queryIndex === 0 && this.sanitisedQuery.length !== result.text.length) {
      this.preview.value = `${this.query}${result.text.slice(this.query.length)}`;
    } else {
      this.clearPreview();
    }
  }

  setAriaStatus(content) {
    if (!content) {
      const numberOfResults = this.results.length;
      const queryTooShort = this.sanitisedQuery.length < this.minChars;
      const noResults = numberOfResults === 0;

      if (queryTooShort) {
        content = this.content.aria_min_chars;
      } else if (noResults) {
        content = `${this.content.aria_no_results}: "${this.query}"`;
      } else if (numberOfResults === 1) {
        content = this.content.aria_one_result;
      } else {
        content = this.content.aria_n_results.replace('{n}', numberOfResults);

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

      this.onSelect(result);

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

      setTimeout(() => {
        this.settingResult = false;
        this.input.setAttribute('autocomplete', 'false');
      }, 300);
    }
  }
}