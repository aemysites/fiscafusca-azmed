/* global WebImporter */
export default function parse(element, { document }) {
  // The block name for the header row
  const headerRow = ['Columns (columns10)'];

  // Find the columns container
  const multiCol = element.querySelector('.multi-column-container');
  if (!multiCol) return;

  // Find the row inside the columns container
  const row = multiCol.querySelector('.row');
  if (!row) return;

  // Get all immediate children column divs (left and right columns)
  const columns = Array.from(row.children).filter(col => col.classList.contains('col-sm-6'));

  // Edge case: if no columns found, exit
  if (columns.length === 0) return;

  // For each column, find its main content node: .rte-node inside .text, else fallback to column itself
  const contentCells = columns.map(col => {
    const textSection = col.querySelector('.text');
    if (textSection) {
      const rteNode = textSection.querySelector('.rte-node');
      if (rteNode) return rteNode;
      return textSection;
    }
    return col;
  });

  // Build the table cells array
  const cells = [
    headerRow,
    contentCells
  ];

  // Create and replace with the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
