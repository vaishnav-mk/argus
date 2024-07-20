// components/PaginationComponent.tsx
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
  const [pageNumbers, setPageNumbers] = useState<number[]>([1]);

  useEffect(() => {
    if (nextPageState && pageNumbers.length < 3) {
      setPageNumbers((prev) => [...prev, prev.length + 1]);
    }
  }, [nextPageState, pageNumbers.length]);

  const handlePageChange = (pageState: string | null) => {
    if (pageState !== currentPageState) {
      onPageChange(pageState);
    }
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => handlePageChange(null)}
            disabled={!currentPageState}
          />
        </PaginationItem>
        {pageNumbers.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              href="#"
              onClick={() => handlePageChange(currentPageState)}
              isActive={pageNumber === pageNumbers[pageNumbers.length - 1]}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}
        {nextPageState && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(nextPageState)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
