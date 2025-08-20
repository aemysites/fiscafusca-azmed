/* global WebImporter */
export default function parse(element, { document }) {
  // Get left column
  const leftCol = element.querySelector('.col-sm-4');
  // Find the two right columns inside .multi-column-container
  let midCol = null;
  let rightCol = null;
  const multiColContainer = element.querySelector('.multi-column-container');
  if (multiColContainer) {
    const cols = multiColContainer.querySelectorAll('.row > div');
    if (cols.length > 0) midCol = cols[0];
    if (cols.length > 1) rightCol = cols[1];
  }
  // Construct the columns array (all non-null columns)
  const columns = [];
  if (leftCol) columns.push(leftCol);
  if (midCol) columns.push(midCol);
  if (rightCol) columns.push(rightCol);
  // The header must be a single cell!
  const cells = [
    ['Columns (columns2)'], // exactly one cell in header row
    columns                 // one row, N columns
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
