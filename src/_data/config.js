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
 *   - To change a collections
 *     description:              Find the option in "collections"
 *                               and change the text next to
 *                               "description". Keep the quotes.
 *                               Use a plain dash — not special
 *                               characters.
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
 *                               encoding (pi/tau/phi) based on
 *                               array position. If you reorder
 *                               or insert items in the middle of
 *                               staffingLevels, collections options,
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
      id: "1fte",  // URL-IMMUTABLE — do not rename
      label: "Basic",
      annualCost: 150000, // PLACEHOLDER
      schedule: [
        { days: "1-5", open: "11am", close: "4pm" },
      ],
      description:
        "One full-time staff member. Basic reference service and public hours, 40 hours per week on a standard holiday schedule.",
      source: "Cache County HR salary schedule FY2025",
    },
    {
      id: "1fte-1pte",  // URL-IMMUTABLE — do not rename
      label: "Extended",
      annualCost: 190000, // PLACEHOLDER
      schedule: [
        { days: "1-5", open: "10am", close: "5pm" },
      ],
      description:
        "Extended evening and weekend hours with one additional part-time staff member.",
      source: "Cache County HR salary schedule FY2025",
    },
    {
      id: "1fte-2pte",  // URL-IMMUTABLE — do not rename
      label: "Current",
      annualCost: 230000, // PLACEHOLDER
      schedule: [
        { days: "1-5", open: "10am", close: "6pm" },
        { days: "6",   open: "10am", close: "2pm" },
      ],
      description:
        "Full-week coverage including Saturdays with one full-time staff and up to three part-time staff members.",
      source: "Cache County HR salary schedule FY2025",
    },
  ],

  collections: {
    description:
      "New books, periodicals, and digital media added to the collection each year.",
    source: "Cache County Library Services budget proposal FY2025",
    options: [
      { value: 10000, isDefault: false, description: "Digital-only access via Beehive and Libby \u2014 no physical print collection" },
      { value: 20000, isDefault: false, description: "Small rotating print collection + digital" },
      { value: 30000, isDefault: true,  description: "Print collection + digital" },
      { value: 40000, isDefault: false, description: "Expanded print + digital + periodicals" },
      { value: 50000, isDefault: false, description: "Full print + digital + periodicals + AV materials" },
      { value: 60000, isDefault: false, description: "Full collection + digital + periodicals + AV + special programs" },
    ],
  },

  cities: [
    {
      id: "providence",
      label: "Providence",
      households: 2100, // PLACEHOLDER
      defaultChecked: true,
      source: "Cache County Assessor 2024",
    },
    {
      id: "nibley",
      label: "Nibley",
      households: 1800, // PLACEHOLDER
      defaultChecked: true,
      source: "Cache County Assessor 2024",
    },
    {
      id: "millville",
      label: "Millville",
      households: 950, // PLACEHOLDER
      defaultChecked: true,
      source: "Cache County Assessor 2024",
    },
    {
      id: "river-heights",
      label: "River Heights",
      households: 620, // PLACEHOLDER
      defaultChecked: true,
      source: "Cache County Assessor 2024",
    },
  ],
};
