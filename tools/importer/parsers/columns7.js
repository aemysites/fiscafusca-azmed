/* global WebImporter */
export default function parse(element, { document }) {
  // Find the multi-column container and the row of columns
  const multiCol = element.querySelector('.multi-column-container');
  if (!multiCol) return;
  const row = multiCol.querySelector('.row');
  if (!row) return;

  // Get all column divs (more flexible selection)
  const cols = Array.from(row.querySelectorAll(':scope > div'));
  // Filter out columns with no meaningful content
  const validCols = cols.filter(col => col.querySelector('.newImage, .dynamicText, img, p, a'));

  // Extract all content from each column
  const cellContents = validCols.map(col => {
    const content = [];
    // Add all .newImage blocks
    Array.from(col.querySelectorAll('.newImage')).forEach(img => content.push(img));
    // Add all .dynamicText blocks
    Array.from(col.querySelectorAll('.dynamicText')).forEach(txt => content.push(txt));
    // If nothing found, add all children
    if (content.length === 0) Array.from(col.children).forEach(child => content.push(child));
    return content.length === 1 ? content[0] : content;
  });

  // Create table manually to ensure header row is a single column with correct colspan
  const table = document.createElement('table');

  // Header row (single <th> with colspan)
  const headerTr = document.createElement('tr');
  const headerTh = document.createElement('th');
  headerTh.textContent = 'Columns (columns7)';
  headerTh.setAttribute('colspan', cellContents.length);
  headerTr.appendChild(headerTh);
  table.appendChild(headerTr);

  // Content row: each column's content in a cell
  const contentTr = document.createElement('tr');
  cellContents.forEach(cell => {
    const td = document.createElement('td');
    if (Array.isArray(cell)) {
      cell.forEach(item => td.append(item));
    } else {
      td.append(cell);
    }
    contentTr.appendChild(td);
  });
  table.appendChild(contentTr);

  element.replaceWith(table);
}
