/* global WebImporter */
export default function parse(element, { document }) {
  // Header row, must match exactly the block name/variant
  const headerRow = ['Columns (columns13)'];

  // Find the multi-column-container > .row
  const container = element.querySelector('.multi-column-container');
  if (!container) return;
  const row = container.querySelector('.row');
  if (!row) return;

  // Get ONLY the content columns (should be exactly 2)
  // The columns have 'col-' in their class (e.g. col-sm-6, col-xs-12, column-1, column-2)
  const columns = Array.from(row.children).filter(col =>
    col.className && /column-\d/.test(col.className)
  );

  // Protect against missing columns
  if (columns.length === 0) return;

  // Prepare content for each true column
  const colContent = columns.map(col => {
    // Use a document fragment to gather all direct children
    const frag = document.createDocumentFragment();
    Array.from(col.childNodes).forEach(node => {
      frag.appendChild(node);
    });
    return frag;
  });

  // Build the cells array
  const cells = [headerRow, colContent];

  // Create the block table and replace the original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
