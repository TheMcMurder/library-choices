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
 *   - To change which cities
 *     start checked:            Find the city and change
 *                               "defaultChecked: true" to
 *                               "defaultChecked: false" (no quotes
 *                               around true/false).
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
      id: "1fte",
      label: "1 Full-Time Librarian",
      annualCost: 150000, // PLACEHOLDER
      description:
        "Basic reference service and public hours, 40 hours per week on a standard holiday schedule.",
      source: "Cache County HR salary schedule FY2025",
    },
    {
      id: "1fte-1pte",
      label: "1 Full-Time + 1 Part-Time",
      annualCost: 190000, // PLACEHOLDER
      description:
        "Extended evening and weekend hours with one additional part-time staff member.",
      source: "Cache County HR salary schedule FY2025",
    },
    {
      id: "1fte-2pte",
      label: "1 Full-Time + 2 Part-Time",
      annualCost: 230000, // PLACEHOLDER
      description:
        "Full-week coverage including Saturdays with two part-time staff members.",
      source: "Cache County HR salary schedule FY2025",
    },
  ],

  collections: {
    description:
      "New books, periodicals, and digital media added to the collection each year.",
    source: "Cache County Library Services budget proposal FY2025",
    options: [
      { value: 10000, isDefault: false }, // PLACEHOLDER — update with real minimum
      { value: 20000, isDefault: false },
      { value: 30000, isDefault: true }, // current budget
      { value: 40000, isDefault: false },
      { value: 50000, isDefault: false },
      { value: 60000, isDefault: false },
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
