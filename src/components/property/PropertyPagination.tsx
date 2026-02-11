type Props = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export default function PropertyPagination({ page, totalPages, onChange }: Props) {
  return (
    <div className="flex justify-center gap-2 mt-6">
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          className={`px-3 py-1 rounded ${
            page === i + 1 ? "bg-blue-600 text-white" : "border"
          }`}
          onClick={() => onChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}

