import { useMemo, useState } from 'react';
import { INGREDIENTS, INGREDIENT_CATEGORIES } from '../data/pantryData.js';

/**
 * Section component: the tappable list of ingredients the user currently has.
 * Grouped by category, with a search box so the list stays usable on a phone.
 */
export default function IngredientPicker({ selectedIds, onToggle, onClear }) {
  const [query, setQuery] = useState('');

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const visible = needle
      ? INGREDIENTS.filter((item) => item.name.toLowerCase().includes(needle))
      : INGREDIENTS;

    return INGREDIENT_CATEGORIES.map((category) => ({
      category,
      items: visible.filter((item) => item.category === category),
    })).filter((group) => group.items.length > 0);
  }, [query]);

  return (
    <section className="card" aria-labelledby="ingredients-heading">
      <div className="section-head">
        <div>
          <h2 id="ingredients-heading" className="section-title">
            What do you have?
          </h2>
          <p className="section-hint">Tap everything in your kitchen right now.</p>
        </div>
        <span className="count-pill" aria-live="polite">
          {selectedIds.length}
        </span>
      </div>

      <div className="search-row">
        <input
          className="search-input"
          type="search"
          value={query}
          placeholder="Search ingredients"
          aria-label="Search ingredients"
          onChange={(event) => setQuery(event.target.value)}
        />
        {selectedIds.length > 0 && (
          <button type="button" className="text-button" onClick={onClear}>
            Clear all
          </button>
        )}
      </div>

      {groups.length === 0 && (
        <p className="empty-note">No ingredient matches &ldquo;{query}&rdquo;.</p>
      )}

      {groups.map((group) => (
        <div className="ingredient-group" key={group.category}>
          <h3 className="group-title">{group.category}</h3>
          <div className="chip-grid">
            {group.items.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`chip ${isSelected ? 'chip-on' : ''}`}
                  aria-label={item.name}
                  aria-pressed={isSelected}
                  onClick={() => onToggle(item.id)}
                >
                  <span className="chip-emoji" aria-hidden="true">
                    {item.emoji}
                  </span>
                  <span className="chip-label">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
