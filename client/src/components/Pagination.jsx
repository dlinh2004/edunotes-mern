import React from "react";

export default function Pagination({ page = 1, pages = 1, onChange }) {
  if (pages <= 1) return null;
  const prev = () => { if (page > 1) onChange(page - 1); };
  const next = () => { if (page < pages) onChange(page + 1); };

  return (
    <div className="flex items-center justify-between mt-4">
      <button onClick={prev} disabled={page === 1} className="px-3 py-1 rounded border">Prev</button>
      <div className="text-sm">Page {page} of {pages}</div>
      <button onClick={next} disabled={page === pages} className="px-3 py-1 rounded border">Next</button>
    </div>
  );
}
