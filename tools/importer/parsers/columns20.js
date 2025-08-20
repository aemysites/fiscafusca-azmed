/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row
  const header = ['Columns (columns20)'];

  // Prepare columns: 3 columns expected in the main row
  const columns = [];

  // 1st column: left logo/name/legal col
  const colLeft = element.querySelector('.col-sm-4');
  if (colLeft) columns.push(colLeft);

  // 2nd+3rd columns are inside multi-column-container -> row -> .col-sm-6
  const multiCol = element.querySelector('.multi-column-container > .row');
  if (multiCol) {
    const subCols = multiCol.querySelectorAll(':scope > .col-sm-6');
    // Always push exactly two subcolumns if present, even if empty
    subCols.forEach((sc) => columns.push(sc));
    // If only one subcolumn, still maintain 3 total columns
    if (subCols.length < 2) {
      for (let i = 0; i < 2 - subCols.length; i += 1) {
        columns.push(document.createElement('div'));
      }
    }
  } else {
    // Defensive: if missing, fill out up to 3 columns
    while (columns.length < 3) {
      columns.push(document.createElement('div'));
    }
  }

  // Ensure exactly 3 columns in the row for correct structure
  if (columns.length > 3) {
    columns.length = 3;
  }

  const cells = [header, columns];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
