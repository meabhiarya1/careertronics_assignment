const MAX_PAGE_BUTTONS = 5;

// Returns up to 5 page numbers around the current page.
// Example: page 7 of 20 -> [5, 6, 7, 8, 9]
export function getPageNumbers(currentPage, totalPages) {
  let start = Math.max(1, currentPage - Math.floor(MAX_PAGE_BUTTONS / 2));
  const end = Math.min(totalPages, start + MAX_PAGE_BUTTONS - 1);
  start = Math.max(1, end - MAX_PAGE_BUTTONS + 1);

  const pages = [];
  for (let pageNumber = start; pageNumber <= end; pageNumber++) {
    pages.push(pageNumber);
  }
  return pages;
}
