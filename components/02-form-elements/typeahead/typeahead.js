import { orderBy } from 'lodash';
import domready from '../../../assets/js/domready';
import triggerChangeEvent from '../../../assets/js/trigger-change-event';
import Typeahead from './typeahead-core';
import { sanitiseTypeaheadText } from './typeahead-helpers';
const dice = require('dice-coefficient');

const classTypeahead = 'js-typeahead';
const classTypeaheadSelect = 'js-typeahead-select';

const fuzzyMinDistance = 0.65;
const noExactMatchIndex = 99999;

class SelectTypeahead {
  constructor(context) {
    // Elements
    this.context = context;
    this.select = context.querySelector(`.${classTypeaheadSelect}`);

    // State
    this.resultLimit = context.hasAttribute('data-result-limit') ? parseInt(context.getAttribute('data-result-limit')) : null;
    this.options = [].slice.call(this.select.getElementsByTagName('OPTION'))
      .map(option => {
        const mappedOption = {
          text: option.innerText,
          value: option.hasAttribute('value') ? option.getAttribute('value') : option.innerText,
          alternatives: (option.getAttribute('data-alternatives') || '').split(',')
        }

        mappedOption.sanitisedText = sanitiseTypeaheadText(mappedOption.text)
        mappedOption.sanitisedAlternatives = mappedOption.alternatives.map(alternative => sanitiseTypeaheadText(alternative));

        return mappedOption;
      })
      .filter(option => option.value);

    if (this.context.getAttribute('data-prevent-fuzzy') !== 'true') {
      this.fuzzyMatch = true;
      this.longestOption = this.options.map(option => option.text.length).sort((a, b) => b - a)[0];
    }

    // Initialise typeahead
    this.typeahead = new Typeahead({
      context,
      suggestionFunction: this.getSuggestions.bind(this),
      onSelect: this.selectResult.bind(this),
      onUnsetResult: this.unsetResult.bind(this),
      resultLimit: this.resultLimit
    });
  }

  getSuggestions(query) {
    return new Promise(resolve => {
      let results;
      let resultsFromAlternatives;

      // Filter results
      if (this.fuzzyMatch) {
        results = this.options.filter(option => {
          option.dice = dice(option.sanitisedText, query);
          return option.dice >= fuzzyMinDistance || option.sanitisedText.includes(query);
        });

        resultsFromAlternatives = this.options.filter(option => {
          if (results.includes(option)) {
            return false;
          }

          let score;
          const match = option.sanitisedAlternatives.find(alternative => {
            score = dice(alternative, query);
            return score >= fuzzyMinDistance;
          }) || option.sanitisedAlternatives.find(alternative => alternative.includes(query));

          if (match) {
            option.dice = score;
            return true;
          }

          return false;
        });
      } else {
        results = this.options
          .filter(option => option.sanitisedText.includes(query));

        resultsFromAlternatives = this.options.filter(option =>
          !results.includes(option) &&
          !!option.sanitisedAlternatives.find(alternative => alternative.includes(query))
        );
      }

      // Assign query indexes
      results.forEach(result => {
        const queryIndex = result.sanitisedText.indexOf(query);

        if (queryIndex < 0) {
          result.queryIndex = noExactMatchIndex;
        } else {
          result.queryIndex = queryIndex;
        }
      });

      resultsFromAlternatives.forEach(result => {
        const matchedAlternative = result.sanitisedAlternatives.find(alternative => alternative.includes(query));

        if (matchedAlternative) {
          const queryIndex = matchedAlternative.indexOf(query);

          if (queryIndex < 0) {
            result.queryIndex = noExactMatchIndex;
          } else {
            result.queryIndex = queryIndex;
          }
        } else {
          result.queryIndex = noExactMatchIndex;
        }
      });

      // Sort arrays
      if (this.fuzzyMatch) {
        results = orderBy(results, ['queryIndex', 'dice'], ['asc', 'desc']);
        resultsFromAlternatives = orderBy(resultsFromAlternatives, ['queryIndex', 'dice'], ['asc', 'desc']);
      } else {
        results = orderBy(results, ['queryIndex'], ['asc']);
        resultsFromAlternatives = orderBy(resultsFromAlternatives, ['queryIndex'], ['asc']);
      }

      results.forEach(result => { delete result.dice; delete result.queryIndex });
      // Combine arrays and remove duplicates
      results = Array.from(new Set([...results, ...resultsFromAlternatives]));

      resolve(results);
    });
  }

  unsetResult() {
    this.select.value = '';
    triggerChangeEvent(this.select);
  }

  selectResult(result) {
    return new Promise(resolve => {
      this.select.value = result.value;
      triggerChangeEvent(this.select);
      resolve();
    });
  }
}

export default function typeahead() {
  const typeaheads = [].slice.call(document.getElementsByClassName(classTypeahead));

  typeaheads.forEach(typeahead => new SelectTypeahead(typeahead));
}

domready(typeahead);
