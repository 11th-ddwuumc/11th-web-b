interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const buttonClass =
    "flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-md border border-[#e0e2e6] bg-white disabled:cursor-default disabled:opacity-40";

  return (
    <nav
      className="mt-10 flex items-center justify-center gap-3.5"
      aria-label="페이지 이동"
    >
      <button
        className={buttonClass}
        type="button"
        disabled={currentPage === 1}
        onClick={() =>
          onPageChange(currentPage - 1)
        }
      >
        <img
          className="h-4 w-4"
          src="/icons/chevron-left.svg"
          alt="이전 페이지"
        />
      </button>

      <span className="text-xs text-[#666b73]">
        {currentPage} / {totalPages}
      </span>

      <button
        className={buttonClass}
        type="button"
        disabled={currentPage === totalPages}
        onClick={() =>
          onPageChange(currentPage + 1)
        }
      >
        <img
          className="h-4 w-4"
          src="/icons/chevron-right.svg"
          alt="다음 페이지"
        />
      </button>
    </nav>
  );
}