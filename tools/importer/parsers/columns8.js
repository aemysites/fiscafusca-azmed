/* global WebImporter */
export default function parse(element, { document }) {
  // Find the multi-column container
  const multiColumn = element.querySelector('.multi-column-container');
  if (!multiColumn) return;

  // Find the row containing the columns
  const row = multiColumn.querySelector('.row');
  if (!row) return;

  // Get the column elements (typically two)
  let columns = Array.from(row.children).filter(col => col.classList.contains('col-sm-6'));
  if (columns.length === 0) columns = Array.from(row.children);

  // Prepare each column's content
  const colContents = columns.map(col => {
    const dynamicText = col.querySelector('.dynamicText');
    if (dynamicText) return dynamicText;
    const newImage = col.querySelector('.newImage');
    if (newImage) return newImage;
    return col;
  });

  // Header row must have the same number of cells as content row: first cell is header, rest are blank
  const headerRow = ['Columns (columns8)', ...Array(colContents.length - 1).fill('')];

  // Compose table
  const tableRows = [headerRow, colContents];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
