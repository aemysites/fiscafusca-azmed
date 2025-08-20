/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main block container
  const section = element.querySelector('.component-section.full-width.no-style.fourth');
  if (!section) return;

  // Header row exactly as in the example
  const headerRow = ['Hero (hero9)'];

  // No background image in the provided HTML, so leave background row empty
  const backgroundRow = [''];

  // Find content container
  const inner = section.querySelector('.page-section-inner.container');
  if (!inner) return;

  // Gather all content fragments in order
  const contentFragments = [];

  // Title: The first .text.parbase.section > .rte-node > p element (heading)
  const textSections = inner.querySelectorAll('.text.parbase.section');
  if (textSections.length > 0) {
    const firstText = textSections[0].querySelector('.rte-node > p');
    if (firstText) contentFragments.push(firstText);
  }

  // Subheading/Description: Second .text.parbase.section > .rte-node > p element (paragraph)
  if (textSections.length > 1) {
    const secondText = textSections[1].querySelector('.rte-node > p');
    if (secondText) contentFragments.push(secondText);
  }

  // Call-to-action link: Third .text.parbase.section > .rte-node > .download > a
  if (textSections.length > 2) {
    const downloadLink = textSections[2].querySelector('.download > a');
    if (downloadLink) contentFragments.push(downloadLink);
  }

  // Compose block table as per example (1 column, 3 rows: header, background, content)
  const cells = [
    headerRow,
    backgroundRow,
    [contentFragments]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
