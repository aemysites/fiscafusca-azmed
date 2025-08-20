/* global WebImporter */
export default function parse(element, { document }) {
  // Find the multi-column container
  const multiColumn = element.querySelector('.multi-column-container');
  if (!multiColumn) return;

  // Find the row inside the multi-column container
  const row = multiColumn.querySelector('.row');
  if (!row) return;

  // Get all immediate columns inside the row
  const cols = Array.from(row.querySelectorAll(':scope > div'));

  // For each column, collect all direct children as a fragment (preserving document references)
  const columnCells = cols.map((col) => {
    // Collect all meaningful children, including text nodes with non-whitespace
    const frag = document.createDocumentFragment();
    Array.from(col.childNodes).forEach((child) => {
      if (
        child.nodeType === Node.ELEMENT_NODE ||
        (child.nodeType === Node.TEXT_NODE && child.textContent.trim())
      ) {
        frag.appendChild(child);
      }
    });
    // If the column is empty, fallback to an empty string
    return frag.childNodes.length ? frag : '';
  });

  // Table header exactly as the example
  const headerRow = ['Columns (columns24)'];
  // Table content row: one cell per column
  const tableCells = [headerRow, columnCells];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element in the DOM
  element.replaceWith(block);
}
