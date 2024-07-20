import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";

interface PaginationComponentProps {
  currentPageState: string | null;
  nextPageState: string | null;
  onPageChange: (pageState: string | null) => void;
}

export function PaginationComponent({
  currentPageState,
  nextPageState,
  onPageChange,
}: PaginationComponentProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handlePageChange = (pageState: string | null, pageNumber: number) => {
    if (pageState !== currentPageState) {
      setCurrentPage(pageNumber);
      onPageChange(pageState);
    }
  };

  const renderPageNumbers = () => {
    let pages = [];
    for (let i = 0; i < 3; i++) {
      pages.push(
        <PaginationItem key={currentPage + i - 1}>
          <PaginationLink
            onClick={() => handlePageChange(`page_${currentPage + i - 1}`, currentPage + i - 1)}
            isActive={currentPage === currentPage + i - 1}
          >
            {currentPage + i - 1}
          </PaginationLink>
        </PaginationItem>
      );
    }
    return pages;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(null, currentPage - 1)}
            disabled={currentPage === 1}
          />
        </PaginationItem>
        {renderPageNumbers()}
        {nextPageState && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(nextPageState, currentPage + 1)}
            disabled={!nextPageState}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
