export const ELLIPSIS_START = 'ellipsis-start';
export const ELLIPSIS_END = 'ellipsis-end';

const range = (start, end) => Array.from({ length: end - start + 1 }, (_, index) => start + index);

/**
 * Page buttons to render, collapsing long ranges with ellipses while keeping
 * the total count constant so the control doesn't jump around.
 *
 * getPageItems(6, 12) -> [1, 'ellipsis-start', 5, 6, 7, 'ellipsis-end', 12]
 */
export function getPageItems(currentPage, totalPages, siblingCount = 1) {
  // first + last + current + siblings on both sides + two ellipses
  const maxItems = siblingCount * 2 + 5;
  if (totalPages <= maxItems) return range(1, totalPages);

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);
  const showStartEllipsis = leftSibling > 2;
  const showEndEllipsis = rightSibling < totalPages - 1;
  const edgeItemCount = 3 + siblingCount * 2;

  if (!showStartEllipsis) {
    return [...range(1, edgeItemCount), ELLIPSIS_END, totalPages];
  }
  if (!showEndEllipsis) {
    return [1, ELLIPSIS_START, ...range(totalPages - edgeItemCount + 1, totalPages)];
  }
  return [1, ELLIPSIS_START, ...range(leftSibling, rightSibling), ELLIPSIS_END, totalPages];
}

/** "Showing X–Y of Z" bounds for the current page (0s when the page is empty). */
export function getVisibleRange({ page, limit }, itemCount) {
  if (itemCount === 0) return { from: 0, to: 0 };
  const from = (page - 1) * limit + 1;
  return { from, to: from + itemCount - 1 };
}
