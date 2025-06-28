import { useState, useMemo } from 'react';

interface UsePaginationProps<T> {
  data: T[];
  itemsPerPage: number;
  initialPage?: number;
}

interface UsePaginationReturn<T> {
  currentData: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  showingStart: number;
  showingEnd: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function usePagination<T>({
  data,
  itemsPerPage,
  initialPage = 1
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Ensure current page is within valid range
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages || 1));

  const currentData = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, validCurrentPage, itemsPerPage]);

  const showingStart = totalItems === 0 ? 0 : (validCurrentPage - 1) * itemsPerPage + 1;
  const showingEnd = Math.min(validCurrentPage * itemsPerPage, totalItems);

  const goToPage = (page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  };

  const nextPage = () => {
    if (validCurrentPage < totalPages) {
      setCurrentPage(validCurrentPage + 1);
    }
  };

  const previousPage = () => {
    if (validCurrentPage > 1) {
      setCurrentPage(validCurrentPage - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  const hasNextPage = validCurrentPage < totalPages;
  const hasPreviousPage = validCurrentPage > 1;

  return {
    currentData,
    currentPage: validCurrentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    showingStart,
    showingEnd,
    goToPage,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
    hasNextPage,
    hasPreviousPage,
  };
} 