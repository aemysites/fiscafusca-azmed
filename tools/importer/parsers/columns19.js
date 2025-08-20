/* global WebImporter */
export default function parse(element, { document }) {
  // Find the multi-column container
  const multiCol = element.querySelector('.multi-column-container');
  if (!multiCol) return;
  const row = multiCol.querySelector('.row');
  if (!row) return;

  // Find all direct children cols (should be two for a two-column layout)
  const cols = Array.from(row.children).filter(col => col.classList.contains('col-sm-6'));

  let leftContent = [];
  let rightContent = [];

  if (cols[0]) {
    // Get the image block if present
    const imageBlock = cols[0].querySelector('.newImage');
    if (imageBlock) {
      leftContent.push(imageBlock);
    }
    // Get non-empty dynamicText (if any)
    const dynText = cols[0].querySelector('.dynamicText');
    if (dynText && dynText.textContent.replace(/\u00A0|\s+/g, '').length > 0) {
      leftContent.push(dynText);
    }
  }
  if (leftContent.length === 0) leftContent = [''];

  if (cols[1]) {
    const medicineList = cols[1].querySelector('.medicineList');
    if (medicineList) {
      rightContent.push(medicineList);
    }
  }
  if (rightContent.length === 0) rightContent = [''];

  // Ensure header row has the same number of columns as the content row
  const headerRow = ['Columns (columns19)', ''];
  const cells = [
    headerRow,
    [leftContent, rightContent],
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
