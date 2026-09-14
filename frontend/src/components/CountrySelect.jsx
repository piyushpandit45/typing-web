import { useMemo, useState } from "react";
import { COUNTRIES } from "../utils/countries";

export default function CountrySelect({ value, onChange }) {
  const [query, setQuery] = useState(value?.name || "");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return COUNTRIES.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 12);
  }, [query]);

  return (
    <div className="country-wrap">
      <input
        aria-label="Search country"
        placeholder="Search country"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />
      {open && (
        <div className="country-list" role="listbox">
          {filtered.map((c) => (
            <button
              type="button"
              key={c.code}
              onClick={() => {
                onChange(c);
                setQuery(`${c.flag} ${c.name}`);
                setOpen(false);
              }}
            >
              {c.flag} {c.name}
            </button>
          ))}
          {!filtered.length && <div className="empty">No countries found.</div>}
        </div>
      )}
    </div>
  );
}
