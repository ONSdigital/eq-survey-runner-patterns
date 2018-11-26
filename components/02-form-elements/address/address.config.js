module.exports = {
  title: 'Address',
  name: 'address-typeahead',
  status: 'prototype',
  context: {
    typeahead: {
      listbox_id: 'address-listbox',
      instructions_id: 'address-typeahead-instructions',
      instructions: 'Use up and down keys to navigate country results once you\'ve typed more than two characters. Use the enter key to select a result. Touch device users, explore by touch or with swipe gestures.',
      content: {
        no_results: 'No results found',
        aria_no_results: 'No results found for the query',
        aria_you_have_selected: 'You have selected',
        aria_found_by_alternative_name: 'found by alternative name',
        aria_min_chars: 'Type in 5 or more characters for results.',
        aria_one_result: 'There is one result available.',
        aria_n_results: 'There are {n} results available.',
        aria_limited_results: 'Results have been limited to 10 results. Type more characters to refine your search.',
        more_results: 'Continue typing to refine results'
      }
    }
  }
}
