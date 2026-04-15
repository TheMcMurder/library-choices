/*
 * ============================================================
 * NON-DEVELOPER EDIT GUIDE
 * ============================================================
 * You can safely update the numbers in this file without
 * knowing JavaScript. Here is what to do:
 *
 *   - To change a cost:       Find the number next to
 *                             "annualCost" and replace it.
 *                             Use whole numbers only — no
 *                             dollar signs, commas, or decimals.
 *
 *   - To change a city name:  Find the city in the "cities"
 *                             array and change the text next to
 *                             "label". Keep the quotes.
 *
 *   - To change household
 *     counts:                 Find the city and change the
 *                             number next to "households".
 *
 *   - To add a new city:      Copy one city object (from
 *                             the opening { to the closing })
 *                             and add it to the cities array
 *                             with a comma. Update "id",
 *                             "label", and "households".
 *                             No other file changes needed.
 *
 *   - To remove the DRAFT
 *     watermark:              Change "draft: true" to
 *                             "draft: false" (no quotes around
 *                             true/false).
 *
 *   - To change a digital
 *     collections description:    Find the option in "collectionsDigital"
 *                                 and change the text next to
 *                                 "description". Keep the quotes.
 *                                 Use a plain dash — not special
 *                                 characters.
 *
 *   - To change a physical
 *     collections description:    Find the option in "collectionsPhysical"
 *                                 and change the text next to
 *                                 "description". Keep the quotes.
 *                                 Use a plain dash — not special
 *                                 characters.
 *
 *   - To change which cities
 *     start checked:            Find the city and change
 *                               "defaultChecked: true" to
 *                               "defaultChecked: false" (no quotes
 *                               around true/false).
 *
 *   - To change open/close
 *     hours:                  Find the staffing level and change
 *                             the text next to "open" or "close".
 *                             Use 12-hour format with no space:
 *                             "9am", "4pm", "12pm". Keep the quotes.
 *
 *   - To add a schedule row
 *     (e.g., Saturday hours): Copy this example and add it after
 *                             the last } in the schedule array:
 *
 *                               { days: "6", open: "9am", close: "5pm" },
 *
 *                             Day numbers: 1=Monday, 2=Tuesday,
 *                             3=Wednesday, 4=Thursday, 5=Friday,
 *                             6=Saturday, 7=Sunday.
 *                             Use "1-5" for Monday through Friday.
 *
 *   - To remove a schedule
 *     row:                    Delete the entire { days: ... }, line.
 *                             Keep at least one row per staffing level.
 *
 *   - Copy-pasteable two-row schedule example:
 *
 *       schedule: [
 *         { days: "1-5", open: "9am", close: "8pm" },
 *         { days: "6",   open: "9am", close: "5pm" },
 *       ],
 *
 *   - IMPORTANT — compact URLs
 *     and array order:          Shared links use compact URL
 *                               encoding (pi/tau/delta/phi) based on
 *                               array position. If you reorder
 *                               or insert items in the middle of
 *                               staffingLevels, collectionsDigital options,
 *                               collectionsPhysical options,
 *                               or cities arrays, existing shared
 *                               links will point to wrong items.
 *                               Always ADD new items at the END
 *                               of an array — never insert at the
 *                               beginning or middle.
 *
 * IMPORTANT: Do NOT change property names (the words before
 * the colons) or remove any curly braces { }.
 * ============================================================
 */

export default {
  siteName: "Cache County Library Service Choices",

  draft: true, // Set to false when real numbers are finalized

  footerLinks: [
    {
      label: "County-wide ballot initiative",
      url: "https://example.com/ballot" // Site owner will supply real URL
    },
    {
      label: "Friends of the Library",
      url: "https://example.com/friends" // Site owner will supply real URL
    }
  ],
  staffingLevels: [
    {
      id: "35hr-pt",  // URL: compact uses array index; verbose id changed from v1
      label: "Essential",
      annualCost: 56160,
      schedule: [
        { days: "1-5", open: "11am", close: "5pm" },
        { days: "6",   open: "10am", close: "3pm" },
      ],
      description:
        "Part-time director and two part-time clerks, 35 hours per week. Two staff working at a time for safety. Some Saturday hours but no evening access.",
    },
    {
      id: "44hr-pt",  // URL: compact uses array index; verbose id changed from v1
      label: "Standard",
      annualCost: 76440,
      schedule: [
        { days: "1-5", open: "10am", close: "6pm" },
        { days: "6",   open: "10am", close: "2pm" },
      ],
      description:
        "Part-time director and three part-time clerks, 44 hours per week. Two staff working at a time. Evening and Saturday hours for working citizens — the current operation level.",
    },
    {
      id: "44hr-fte",  // URL: compact uses array index; verbose id changed from v1
      label: "Full Service",
      annualCost: 160000,
      schedule: [
        { days: "1-5", open: "10am", close: "6pm" },
        { days: "6",   open: "10am", close: "2pm" },
      ],
      description:
        "Full-time director plus three part-time staff, 44 hours per week. Two or three staff at a time. The director would have the education and time to implement more programs, improve library practices, and perform outreach.",
      isCurrentServiceLevel: true,
    },
  ],

  collectionsDigital: {
    description: "Digital materials added to the collection each year.",
    options: [
      { value: 5000,  isDefault: false, description: "Beehive only \u2014 substantially longer wait times for digital titles, shared with the entire state library system" },
      { value: 15000, isDefault: false, description: "Beehive + our own digital titles \u2014 longer wait times for most titles with a few select accelerated titles that we purchase" },
      { value: 30000, isDefault: false, description: "Beehive + expanded \u2014 longer wait times for most titles with some titles reduced via purchases" },
      { value: 55000, isDefault: true,  description: "Current service level (own Libby: $6k software + ~$28k new content + ~$20k repurchases annually)",
        isCurrentServiceLevel: true,
      },
      { value: 65000, isDefault: false, description: "Beehive + expanded \u2014 shorter wait times for most popular books" },
    ],
  },

  collectionsPhysical: {
    description: "Physical print and media materials added each year.",
    options: [
      { value: 0,     isDefault: false, description: "No physical print collection \u2014 digital only" },
      { value: 5000,  isDefault: false, description: "Small rotating print collection" },
      { value: 10000, isDefault: false, description: "Current collection \u2014 books, DVDs, exploration kits, and equipment (telescopes, audiobook players) - limited specialty items",
        isCurrentServiceLevel: true,
      },
      { value: 15000, isDefault: true,  description: "Everything + additional limited collection items"},
    ],
  },

  /*
   * Programming costs (from librarian notes — not yet modeled as a slider):
   *   Summer reading: ~$1,000-$1,500/year
   *   Storytime: ~$300/year
   *   Other programs: ~$1,000-$2,000/year
   *   Total estimate: ~$2,300-$4,800/year
   */

  cities: [
    {
      id: "providence",
      label: "Providence",
      households: 2823,
      defaultChecked: true,
      source: "Census.gov",
      sourceLink: "https://www.census.gov/quickfacts/fact/table/nibleycityutah,providencecityutah/HSD410224"
    },
    {
      id: "nibley",
      label: "Nibley",
      households: 2193,
      defaultChecked: true,
      source: "Census.gov[1]",
      sourceLink: "https://www.census.gov/quickfacts/fact/table/nibleycityutah,providencecityutah/HSD410224"
    },
    {
      id: "millville",
      label: "Millville",
      households: 606,
      defaultChecked: true,
      source: "Census Reporter",
      sourceLink: "https://censusreporter.org/profiles/16000US4950370-millville-ut/"
    },
    {
      id: "river-heights",
      label: "River Heights",
      households: 692,
      defaultChecked: true,
      source: "Census Reporter",
      sourceLink: "https://censusreporter.org/profiles/16000US4964120-river-heights-ut/"
    },
  ],
};
