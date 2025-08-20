/* global WebImporter */
export default function parse(element, { document }) {
  // Find the multi-column container with columns
  const columnsContainer = element.querySelector('.multi-column-container');
  if (!columnsContainer) return;
  const row = columnsContainer.querySelector('.row');
  if (!row) return;

  // Get both columns
  const columnEls = [];
  // Typically columns are in order: col-1 (text), col-2 (image). But selectors should be robust.
  const col1 = row.querySelector('.column-1');
  const col2 = row.querySelector('.column-2');
  if (col1) columnEls.push(col1);
  if (col2) columnEls.push(col2);
  // If not found, fallback to any .col-sm-6.col-xs-12 in row
  if (columnEls.length === 0) {
    columnEls.push(...Array.from(row.querySelectorAll('.col-sm-6.col-xs-12')));
  }
  // Defensive: only use up to two columns as example is 2-col layout
  const columns = columnEls.slice(0, 2).map((col) => {
    // If text column, use the first .rte-node (rich text area)
    const rte = col.querySelector('.rte-node');
    if (rte) return rte;
    // If image column, use the first <img> (prefer desktop version)
    const img = col.querySelector('img');
    if (img) return img;
    // If neither, return the column itself for any fallback content
    return col;
  });

  // Pad columns to 2 if missing (to preserve structure)
  while (columns.length < 2) columns.push(document.createElement('div'));

  // Compose table
  const tableData = [
    ['Columns (columns22)'],
    columns
  ];
  const table = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(table);
}
