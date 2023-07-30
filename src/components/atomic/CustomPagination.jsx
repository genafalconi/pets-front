import React from "react";
import { Pagination } from "react-bootstrap";

export default function CustomPagination({ currentPage, totalPages, handlePageClick }) {
  const isLeftArrowVisible = currentPage > 1;
  const isRightArrowVisible = currentPage < totalPages;
  const isLastRightArrowVisible = currentPage !== totalPages;


  const showPaginationItems = (pageNumber) => {
    return (
      pageNumber === 1 ||
      pageNumber === totalPages ||
      (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
    );
  };

  return (
    <Pagination>
      {isLeftArrowVisible && <Pagination.First onClick={() => handlePageClick(1)} />}
      {isLeftArrowVisible && (
        <Pagination.Prev onClick={() => handlePageClick(currentPage - 1)} />
      )}
      {[...Array(totalPages)].map((_, i) => {
        const pageNumber = i + 1;
        return showPaginationItems(pageNumber) ? (
          <Pagination.Item
            key={i}
            active={currentPage === pageNumber}
            onClick={() => handlePageClick(pageNumber)}
          >
            {pageNumber}
          </Pagination.Item>
        ) : null;
      })}
      {isRightArrowVisible && (
        <Pagination.Next onClick={() => handlePageClick(currentPage + 1)} />
      )}
      {isLastRightArrowVisible && (
        <Pagination.Last onClick={() => handlePageClick(totalPages)} />
      )}
    </Pagination>
  );
};