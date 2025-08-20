/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main multi-column container
  const multiColumn = element.querySelector('.multi-column-container');
  if (!multiColumn) return;

  // Get immediate .row child
  const row = multiColumn.querySelector(':scope > .row');
  if (!row) return;

  // Find immediate columns (should be two cols)
  const cols = row.querySelectorAll(':scope > div.col-sm-6');
  if (cols.length < 2) return;

  // Left column: often contains .dynamicText > .rte-node > .first-text
  let leftContent = cols[0].querySelector('.dynamicText .rte-node .first-text');
  if (!leftContent) {
    leftContent = cols[0]; // fallback, in case of structural variation
  }

  // Right column: contains image (prefer desktop image, fallback to any img)
  let rightContent = null;
  // Try .newImage .new-image-desktop
  rightContent = cols[1].querySelector('.newImage img.new-image-desktop');
  if (!rightContent) {
    rightContent = cols[1].querySelector('img');
  }

  // Compose header and row as shown in the example
  const headerRow = ['Columns (columns23)'];
  const contentRow = [leftContent, rightContent];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace in DOM
  element.replaceWith(table);
}
