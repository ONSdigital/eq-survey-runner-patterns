module.exports = {
  title: "Table",
  collated: false, // Pulls all variants into one summary
  preview: "@preview__full-width",
  status: "wip",
  variants: [
    {
      name: "default",
      label: "Basic",
      context: {
        table_block: [
          {
            caption: "A basic table with a caption",
            th: [
              { 
                value: "Column A"
              },
              { 
                value: "Column B"
              },
              { 
                value: "Column C"
              } 
            ],
            tr: [
              {
                td: [
                  {
                    value: "Cell A1"
                  },
                  {
                    value: "Cell B1"
                  },
                  {
                    value: "Cell C1"
                  },
                ]
              },
              {
                td: [
                  {
                    value: "Cell A2"
                  },
                  {
                    value: "Cell B2"
                  },
                  {
                    value: "Cell C2"
                  },
                ]
              }
            ]
          },
          {
            table_class: " table--dense",
            caption: "A basic table that compacts if more columns are required",
            th: [
              { 
                value: "Column A"
              },
              { 
                value: "Column B"
              },
              { 
                value: "Column C"
              },
              { 
                value: "Column D"
              },
              { 
                value: "Column E"
              }  
            ],
            tr: [
              {
                td: [
                  {
                    value: "Cell A1"
                  },
                  {
                    value: "Cell B1"
                  },
                  {
                    value: "Cell C1"
                  },
                  {
                    value: "Cell D1"
                  },
                  {
                    value: "Cell E1"
                  },
                ]
              },
              {
                td: [
                  {
                    value: "Cell A2"
                  },
                  {
                    value: "Cell B2"
                  },
                  {
                    value: "Cell C2"
                  },
                  {
                    value: "Cell D2"
                  },
                  {
                    value: "Cell E2"
                  },
                ]
              }
            ]
          },
          {
            caption: "A basic table with numeric values",
            th: [
              { 
                value: "Column A",
                class: " table__header--numeric"
              },
              { 
                value: "Column B",
                class: " table__header--numeric"
              },
              { 
                value: "Column C",
                class: " table__header--numeric"
              } 
            ],
            tr: [
              {
                td: [
                  {
                    value: "200",
                    class: " table__cell--numeric"
                  },
                  {
                    value: "365",
                    class: " table__cell--numeric"
                  },
                  {
                    value: "90",
                    class: " table__cell--numeric"
                  },
                ]
              },
              {
                td: [
                  {
                    value: "65",
                    class: " table__cell--numeric"
                  },
                  {
                    value: "445",
                    class: " table__cell--numeric"
                  },
                  {
                    value: "325",
                    class: " table__cell--numeric"
                  },
                ]
              }
            ]
          },          
          {
            caption: "A basic table with a footer",
            th: [
              { 
                value: "Column A"
              },
              { 
                value: "Column B"
              },
              { 
                value: "Column C"
              } 
            ],
            tr: [
              {
                td: [
                  {
                    value: "Cell A1"
                  },
                  {
                    value: "Cell B1"
                  },
                  {
                    value: "Cell C1"
                  },
                ]
              },
              {
                td: [
                  {
                    value: "Cell A2"
                  },
                  {
                    value: "Cell B2"
                  },
                  {
                    value: "Cell C2"
                  },
                ]
              }
            ],
            tfoot: [
              { 
                value: "Column summary"
              },
              { 
                value: "Column summary"
              },
              { 
                value: "Column summary"
              } 
            ],
          },
        ],
      }
    },
    {
      name: "responsive",
      label: "Responsive",
      context: {
        table_block: [
          {
            table_class: " table--responsive",
            caption: "Responsive table with stacked rows for small viewports",
            th: [
              { 
                value: "Column A"
              },
              { 
                value: "Column B"
              },
              { 
                value: "Column C"
              } 
            ],
            tr: [
              {
                td: [
                  {
                    value: "Cell A1",
                    data: "Column A"
                  },
                  {
                    value: "Cell B1",
                    data: "Column B"
                  },
                  {
                    value: "Cell C1",
                    data: "Column C"
                  },
                ]
              },
              {
                td: [
                  {
                    value: "Cell A2",
                    data: "Column A"
                  },
                  {
                    value: "Cell B2",
                    data: "Column B"
                  },
                  {
                    value: "Cell C2",
                    data: "Column C"
                  },
                ]
              }
            ]
          },
          {
            table_class: " table--responsive",
            caption: "Responsive table example with sample data",
            th: [
              { 
                value: "ID"
              },
              { 
                value: "Title"
              },
              { 
                value: "Abbreviation"
              },
              { 
                value: "Legal basis"
              },
              { 
                value: "Frequency"
              }
            ],
            tr: [
              {
                td: [
                  {
                    value: "023",
                    data: "ID"
                  },
                  {
                    value: "Monthly Business Survey - Retail Sales Index",
                    data: "Title"
                  },
                  {
                    value: "RSI",
                    data: "Abbreviation"
                  },
                  {
                    value: "Statistics of Trade Act 1947",
                    data: "Legal basis"
                  },
                  {
                    value: "Monthly",
                    data: "Frequency"
                  }
                ]
              },
              {
                td: [
                  {
                    value: "062",
                    data: "ID"
                  },
                  {
                    value: "Annual Inward Foreign Direct Investment Survey",
                    data: "Title"
                  },
                  {
                    value: "AIFDI",
                    data: "Abbreviation"
                  },
                  {
                    value: "Statistics of Trade Act 1947",
                    data: "Legal basis"
                  },
                  {
                    value: "Annually",
                    data: "Frequency"
                  },
                ]
              }
            ]
          }
        ]
      }
    },
    {
      name: "scrollable",
      label: "Scrollable",
      context: {
        table_block: [
          {
            scrollable: true,
            caption: "A scrollable table",
            th: [
              { 
                value: "ID"
              },
              { 
                value: "Title"
              },
              { 
                value: "Abbreviation"
              },
              { 
                value: "Legal basis"
              },
              { 
                value: "Frequency"
              },
              { 
                value: "Date"
              },
              { 
                value: "Status"
              }
            ],
            tr: [
              {
                td: [
                  {
                    value: "023"
                  },
                  {
                    value: "Monthly Business Survey - Retail Sales Index"
                  },
                  {
                    value: "RSI"
                  },
                  {
                    value: "Statistics of Trade Act 1947"
                  },
                  {
                    value: "Monthly"
                  },
                  {
                    value: "20 Jan 2018"
                  },
                  {
                    value: `<span class="status status--success">Ready</span>`
                  }
                ]
              },
              {
                td: [
                  {
                    value: "112"
                  },
                  {
                    value: "Annual Inward Foreign Direct Investment Survey",
                    data: "Title"
                  },
                  {
                    value: "AIFDI"
                  },
                  {
                    value: "Statistics of Trade Act 1947"
                  },
                  {
                    value: "Annually"
                  },
                  {
                    value: "26 Feb 2018"
                  },
                  {
                    value: `<span class="status status--warning">Not ready</span>`
                  }
                ]
              },
              {
                td: [
                  {
                    value: "332"
                  },
                  {
                    value: "Business Register and Employment Survey"
                  },
                  {
                    value: "BRES"
                  },
                  {
                    value: "Statistics of Trade Act 1947"
                  },
                  {
                    value: "Annually"
                  },
                  {
                    value: "23 Jan 2013"
                  },
                  {
                    value: `<span class="status status--info">In progress</span>`
                  }
                ]
              },
              {
                td: [
                  {
                    value: "654"
                  },
                  {
                    value: "Quartely Survey of Building Materials Sand and Gravel"
                  },
                  {
                    value: "QBMS"
                  },
                  {
                    value: "Statistics of Trade Act 1947 - BEIS"
                  },
                  {
                    value: "Quartely"
                  },
                  {
                    value: "24 Jan 2015"
                  },
                  {
                    value: `<span class="status status--error">Issue</span>`
                  }
                ]
              },
              {
                td: [
                  {
                    value: "765"
                  },
                  {
                    value: "Monthly Survey of Building Materials Concrete Building Blocks"
                  },
                  {
                    value: "MSBB"
                  },
                  {
                    value: "Voluntary"
                  },
                  {
                    value: "Monthly"
                  },
                  {
                    value: "25 Jan 2014"
                  },
                  {
                    value: `<span class="status status--success">Ready</span>`
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    {
      name: "sortable",
      label: "Sortable",
      context: {
        table_block: [
          {
            sortable: true,
            table_class: " table--sortable",
            caption: "Javascript enhanced sortable table",
            th: [
              { 
                value: "ID",
                aria_sort: "none"
              },
              { 
                value: "Title",
                aria_sort: "none"
              },
              { 
                value: "Abbreviation",
                aria_sort: "none"
              },
              { 
                value: "Legal basis",
                aria_sort: "none"
              },
              { 
                value: "Frequency",
                aria_sort: "none"
              },
              { 
                value: "Date",
                aria_sort: "none"
              },
              { 
                value: "Status",
                aria_sort: "none"
              }
            ],
            tr: [
              {
                td: [
                  {
                    value: "023"
                  },
                  {
                    value: "Monthly Business Survey - Retail Sales Index"
                  },
                  {
                    value: "RSI"
                  },
                  {
                    value: "Statistics of Trade Act 1947"
                  },
                  {
                    value: "Monthly",
                    data_sort: "1"
                  },
                  {
                    value: "20 Jan 2018",
                    data_sort: "2018-01-20"
                  },
                  {
                    value: `<span class="status status--success">Ready</span>`,
                    data_sort: "0"
                  }
                ]
              },
              {
                td: [
                  {
                    value: "112"
                  },
                  {
                    value: "Annual Inward Foreign Direct Investment Survey",
                    data: "Title"
                  },
                  {
                    value: "AIFDI"
                  },
                  {
                    value: "Statistics of Trade Act 1947"
                  },
                  {
                    value: "Annually",
                    data_sort: "12"
                  },
                  {
                    value: "26 Feb 2018",
                    data_sort: "2018-02-26"
                  },
                  {
                    value: `<span class="status status--warning">Not ready</span>`,
                    data_sort: "1"
                  }
                ]
              },
              {
                td: [
                  {
                    value: "332"
                  },
                  {
                    value: "Business Register and Employment Survey"
                  },
                  {
                    value: "BRES"
                  },
                  {
                    value: "Statistics of Trade Act 1947"
                  },
                  {
                    value: "Annually",
                    data_sort: "12"
                  },
                  {
                    value: "23 Jan 2013",
                    data_sort: "2013-01-23"
                  },
                  {
                    value: `<span class="status status--info">In progress</span>`,
                    data_sort: "2"
                  }
                ]
              },
              {
                td: [
                  {
                    value: "654"
                  },
                  {
                    value: "Quartely Survey of Building Materials Sand and Gravel"
                  },
                  {
                    value: "QBMS"
                  },
                  {
                    value: "Statistics of Trade Act 1947 - BEIS"
                  },
                  {
                    value: "Quartely",
                    data_sort: "3"
                  },
                  {
                    value: "24 Jan 2015",
                    data_sort: "2015-01-24"
                  },
                  {
                    value: `<span class="status status--error">Issue</span>`,
                    data_sort: "3"
                  }
                ]
              },
              {
                td: [
                  {
                    value: "765"
                  },
                  {
                    value: "Monthly Survey of Building Materials Concrete Building Blocks"
                  },
                  {
                    value: "MSBB"
                  },
                  {
                    value: "Voluntary"
                  },
                  {
                    value: "Monthly",
                    data_sort: "1"
                  },
                  {
                    value: "25 Jan 2014",
                    data_sort: "2014-01-25"
                  },
                  {
                    value: `<span class="status status--success">Ready</span>`,
                    data_sort: "0"
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  ]
}
