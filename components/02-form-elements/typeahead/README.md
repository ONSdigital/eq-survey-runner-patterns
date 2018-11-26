### Typeahead
A component that allows the user to search and select an option from a long list of options, with the ability to navigate suggested results using the keyboard.

Falls back to a standard select when JavaScript is unavailable.

Allows alternative search values for bilingual usage (e.g. A user with language set to Welsh can still search _United Kingdom_ for _Y Deyrnas Unedig_ when looking for countries, or a user can type _Scotland_ to select _United Kingdom_).

related: [GDS Prototype](https://govuk-location-picker-demo.herokuapp.com/country-of-birth)

### Usage
The component enhances a select dropdown. It will ignore any options where the value is empty (i.e. Please select an option).

When the JavaScript loads it will hide the select and show a text input. It will also change the for attribute on the label to match the id of the text input. When the user selects a value it will update the value of the select and fire an onchange event on the select. If the user types an exact match for a value (case insensitive) it will automatically select this value.

Alternatives can by added as a comma separated list. When a user selects an option via an alternative the matched alternative will be shown in brackets next to the suggestion, however the main text and value will still be used (i.e. User searches _Wales_ - Suggestion will be _United Kingdom (Wales)_ - Selection will change input value to _United Kingdom_ and select value to _GB_).

### Limiting Displayed Results
For some use cases it might be a better experience to limit the number of suggested results. This can be done by adding a `data-result-limit` attribute with a numeric value to the component.

#### Content
Some of the messaging and content is dynamic and can be provided as a JSON/JS object in a `data-content` attribute on the component. This means content can be changed if the site is being used in another language.

| Key                              | Description                                                                                                          | Example                    |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| `no_results`                     | Message for when no results are found.                                                                               | `Ni chanfuwyd canlyniadau` |
| `aria_no_results`                | The aria message that will be read by VoiceOver when no results are found, followed by the query the user inputted.  | `No results for the query` |
| `aria_you_have_selected`         | The aria message that will be read by VoiceOver when the user selects a result, followed by the value they selected. | `You have selected`        |
| `aria_found_by_alternative_name` | If the user selects a value from an alternative value then this text will be added to the end of the `aria_you_have_selected` message to notify them what alternative value it was selected by. | `found by alternative name` |
| `aria_min_chars`                 | The aria message that will be read by VoiceOver when the user has not typed more than two characters yet.            | `Type in 2 or more characters for results.` |
| `aria_one_result`                | The aria message that will be read by VoiceOver when there is only one result found.                                 | `There is one result available.` |
| `aria_n_results`                 | The aria message that will be read by VoiceOver when there are multiple results. `{n}` is replaced with the number of results. | `There are {n} results available.` |
| `aria_limited_results`           | If displayed results are limited and the number of found results are greater than than the limit, this message will be added to the end of the `aria_n_results` message | `Results have been limited to 10 results. Type more characters to refine your search.` |

### Accessibility
The typeahead is made accessible by using aria labels.


The typeahead input and suggestions are wrapped in an element with these attributes:
* `role="combobox"` - lets the user know this is an edit control with an associated listbox.
* `aria-haspopup="listbox"` - lets the user know that the listbox will popup.


The typeahead **preview** is hidden from screen readers with `aria-hidden="true"`.


The typeahead **input** is has:
* `aria-autocomplete="list"` - to let the user know a list of choices appears from which the user can choose, but the edit box retains focus.
* `aria-controls="{{listbox_id}}"` - to let the user know that this input controls the listbox.
* `aria-describedby="{{instructions_id}}"` - to give the user some instructions on how to use the typeahead when the input is focused.


The typeahead also has a div with `role="status"` for relaying messages to the user. It uses `aria-live="polite"` and the screen reader will speak changes whenever the user is idle.

### Notes
* Originally the part of the word that matched the query was wrapped in `em` tags, however this will make VoiceOver read it as a separate word. This has been removed.
* The `autocomplete` tag on the input is set to `false` when it is focused to prevent the browser's suggestions from covering the typeahead suggestions. It is put back to its original value once the user leaves the field. This should allow for the field to be auto completed as part of a full form (untested).
