import { orderBy } from 'lodash';
import { occupations } from './occupations';
import { ethnicities } from './ethnicities';

const territoriesJSON = {
  'en-GB': require('cldr-localenames-modern/main/en-GB/territories.json'),
  cy: require('cldr-localenames-modern/main/cy/territories.json')
}

const gbAlternatives = {
  'en-GB': [
    'Wales',
    'England',
    'Scotland',
    'Northern Ireland'
  ],
  cy: [
    'Cymru',
    'Lloeger',
    'Yr Alban',
    'Gogledd Iwerddon'
  ]
}

function buildCountryOptions(primaryLanguageCode, secondaryLanguageCode) {
  const primaryLanguageTerritories = territoriesJSON[primaryLanguageCode].main[primaryLanguageCode].localeDisplayNames.territories;
  let options = [];

  for (const key in primaryLanguageTerritories) {
    if (primaryLanguageTerritories.hasOwnProperty(key) && isNaN(parseInt(key)) && !key.includes('-alt-')) {
      const option = {
        option_text: primaryLanguageTerritories[key],
        option_value: key,
        option_alternatives: []
      }

      if (secondaryLanguageCode) {
        option.option_alternatives = [territoriesJSON[secondaryLanguageCode].main[secondaryLanguageCode].localeDisplayNames.territories[key]];
      }

      if (key === 'GB') {
        option.option_alternatives = [
          ...option.option_alternatives,
          ...gbAlternatives[primaryLanguageCode]
        ];

        if (secondaryLanguageCode) {
          option.option_alternatives = [
            ...option.option_alternatives,
            ...gbAlternatives[secondaryLanguageCode]
          ];
        }
      }

      options.push(option);
    }
  }

  for (const key in primaryLanguageTerritories) {
    if (primaryLanguageTerritories.hasOwnProperty(key) && isNaN(parseInt(key)) && key.includes('-alt-')) {
      const nonAltKey = key.split('-alt-')[0];
      const option = options.find(option => option.option_value === nonAltKey);

      if (option) {
        option.option_alternatives.push(primaryLanguageTerritories[key]);

        if (secondaryLanguageCode) {
          option.option_alternatives = [...option.option_alternatives, ...territoriesJSON[secondaryLanguageCode].main[secondaryLanguageCode].localeDisplayNames.territories[key]];
        }
      }
    }
  }

  options = orderBy(options, ['option_text'], ['desc']);
  options.push({
    option_text: 'Select an option',
    option_value: '',
    selected: 'selected',
    disabled: 'disabled'
  });

  options = options.reverse();

  const gbIndex = options.findIndex(option => option.option_value === 'GB');
  options.splice(1, 0, options.splice(gbIndex, 1)[0]);

  return options;
}

function buildOptionsFromList(list) {
  const options = [];

  options.push({
    option_text: 'Select an option',
    option_value: '',
    selected: 'selected',
    disabled: 'disabled'
  });

  list.forEach(item => {
    options.push({
      option_text: item
    })
  });

  return options;
}

module.exports = {
  title: 'Typeahead',
  default: 'country-typeahead',
  status: 'prototype',
  collated: false,
  variants: [
    {
      name: 'country-typeahead',
      label: 'Country Typeahead',
      context: {
        label: 'Country Typeahead',
        label_text: 'Select a country',
        label_class: 'js-typeahead-label',
        label_for: 'typeahead-country-en-GB',
        instructions_id: 'typeahead-instructions-country-en-GB',
        instructions: 'Use up and down keys to navigate country results once you\'ve typed more than two characters. Use the enter key to select a result. Touch device users, explore by touch or with swipe gestures.',
        input_id: 'typeahead-input-country-en-GB',
        listbox_id: 'typeahead-listbox-country-en-GB',
        options: buildCountryOptions('en-GB'),
        content: {
          no_results: 'No results found',
          aria_no_results: 'No results found for the query',
          aria_you_have_selected: 'You have selected',
          aria_found_by_alternative_name: 'found by alternative name',
          aria_min_chars: 'Type in 2 or more characters for results.',
          aria_one_result: 'There is one result available.',
          aria_n_results: 'There are {n} results available.'
        }
      }
    },
    {
      name: 'country-typeahead-cy',
      label: 'Country Typeahead (Welsh)',
      context: {
        label: 'Country Typeahead (Welsh)',
        label_text: 'Dewisiwch gwald',
        label_class: 'js-typeahead-label',
        label_for: 'typeahead-country-cy',
        instructions_id: 'typeahead-instructions-country-cy',
        instructions: 'Use up and down keys to navigate country results once you\'ve typed more than two characters. Use the enter key to select a result. Touch device users, explore by touch or with swipe gestures.',
        input_id: 'typeahead-input-country-cy',
        listbox_id: 'typeahead-listbox-country-cy',
        options: buildCountryOptions('cy', 'en-GB'),
        content: {
          no_results: 'Ni chanfuwyd canlyniadau',
          aria_no_results: 'No results found for the query',
          aria_you_have_selected: 'You have selected',
          aria_found_by_alternative_name: 'found by alternative name',
          aria_min_chars: 'Type in 2 or more characters for results.',
          aria_one_result: 'There is one result available.',
          aria_n_results: 'There are {n} results available.'
        }
      }
    },
    {
      name: 'occupation-typeahead',
      label: 'Occupation Typeahead',
      context: {
        label: 'Occupation Typeahead',
        label_text: 'Type and select your job title',
        label_class: 'js-typeahead-label',
        label_for: 'occupation-typeahead',
        instructions_id: 'typeahead-instructions-occupation',
        instructions: 'Use up and down keys to navigate results once you\'ve typed more than two characters. Use the enter key to select a result. Touch device users, explore by touch or with swipe gestures.',
        input_id: 'typeahead-input-occupation',
        listbox_id: 'typeahead-listbox-occupation',
        result_limit: 10,
        options: buildOptionsFromList(occupations),
        content: {
          no_results: 'No results found',
          aria_no_results: 'No results found for the query',
          aria_you_have_selected: 'You have selected',
          aria_found_by_alternative_name: 'found by alternative name',
          aria_min_chars: 'Type in 2 or more characters for results.',
          aria_one_result: 'There is one result available.',
          aria_n_results: 'There are {n} results available.',
          aria_limited_results: 'Results have been limited to 10 results. Type more characters to refine your search.',
          more_results: 'Continue typing to refine results'
        }
      }
    },
    {
      name: 'ethnicity-typeahead',
      label: 'Ethnicity Typeahead',
      context: {
        label: 'Ethnicity Typeahead',
        label_text: 'Type and select your ethnicity',
        label_class: 'js-typeahead-label',
        label_for: 'ethnicity-typeahead',
        instructions_id: 'typeahead-instructions-ethnicity',
        instructions: 'Use up and down keys to navigate results once you\'ve typed more than two characters. Use the enter key to select a result. Touch device users, explore by touch or with swipe gestures.',
        input_id: 'typeahead-input-ethnicity',
        listbox_id: 'typeahead-listbox-ethnicity',
        result_limit: 10,
        options: buildOptionsFromList(ethnicities),
        content: {
          no_results: 'No results found',
          aria_no_results: 'No results found for the query',
          aria_you_have_selected: 'You have selected',
          aria_found_by_alternative_name: 'found by alternative name',
          aria_min_chars: 'Type in 2 or more characters for results.',
          aria_one_result: 'There is one result available.',
          aria_n_results: 'There are {n} results available.',
          aria_limited_results: 'Results have been limited to 10 results. Type more characters to refine your search.',
          more_results: 'Continue typing to refine results'
        }
      }
    }
  ]
}
