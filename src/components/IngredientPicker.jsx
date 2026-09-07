import { useMemo, useState } from 'react';
import { INGREDIENTS, INGREDIENT_BY_ID, INGREDIENT_CATEGORIES } from '../data/pantryData.js';

/**
 * Section component: the ingredient list for "what do you have?".
 *
 * Rewritten for a dataset several times the size of the original thirty. Laying
 * every chip out at once worked at 30 and does not at 60: the card was already
 * 1,386px tall and 55% of the setup screen, which pushed the other three
 * questions below two viewport heights.
 *
 * So the card is an index rather than a wall. Three things carry it:
 *
 *   1. Search first. Someone standing at an open fridge knows what they are
 *      looking for; typing three letters beats scrolling five categories.
 *   2. What you have stays visible. Picks are echoed at the top, so you can
 *      see and undo them without scrolling back through the groups.
 *   3. Groups collapse, and their headers carry counts. Five labelled rows
 *      reading "Proteins · 18 items · 3 selected" are scannable at a glance in
 *      a way that sixty chips are not, and the counts stop a collapsed card
 *      from reading as an empty one.
 */
export default function IngredientPicker({ selectedIds, onToggle, onClear }) {
  const [query, setQuery] = useState('');
  const [openGroups, setOpenGroups] = useState([]);

  const searching = query.trim().length > 0;

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return INGREDIENT_CATEGORIES.map((category) => {
      const all = INGREDIENTS.filter((item) => item.category === category);
      const matches = needle
        ? all.filter((item) => item.name.toLowerCase().includes(needle))
        : all;
      return {
        category,
        items: matches,
        total: all.length,
        selected: all.filter((item) => selectedIds.includes(item.id)).length,
      };
    }).filter((group) => group.items.length > 0);
  }, [query, selectedIds]);

  const selectedItems = selectedIds
    .map((id) => INGREDIENT_BY_ID[id])
    .filter(Boolean);

  function toggleGroup(category) {
    setOpenGroups((current) =>
      current.includes(category)
        ? current.filter((name) => name !== category)
        : [...current, category]
    );
  }

  function renderChip(item) {
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
  }

  return (
    <section className="card" aria-labelledby="ingredients-heading">
      <div className="section-head">
        <div>
          <h2 id="ingredients-heading" className="section-title">
            What do you have?
          </h2>
          <p className="section-hint">Search, or open a group to browse.</p>
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
          placeholder={`Search ${INGREDIENTS.length} ingredients`}
          aria-label="Search ingredients"
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {/* Your picks, echoed. Tapping one here removes it. */}
      {selectedItems.length > 0 && (
        <div className="picked">
          <div className="picked-head">
            <span className="picked-label">In your kitchen</span>
            <button type="button" className="text-button" onClick={onClear}>
              Clear all
            </button>
          </div>
          <div className="chip-grid picked-grid">{selectedItems.map(renderChip)}</div>
        </div>
      )}

      {groups.length === 0 && (
        <p className="empty-note">Nothing matches &ldquo;{query}&rdquo;.</p>
      )}

      {groups.map((group) => {
        // A search opens whatever it found; browsing remembers what you opened.
        const isOpen = searching || openGroups.includes(group.category);
        const panelId = `group-${group.category.replace(/\W+/g, '-').toLowerCase()}`;
        return (
          <div className="ingredient-group" key={group.category}>
            <button
              type="button"
              className={`group-header ${isOpen ? 'group-open' : ''}`}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggleGroup(group.category)}
              disabled={searching}
            >
              <span className="group-caret" aria-hidden="true">
                {isOpen ? '−' : '+'}
              </span>
              <span className="group-name">{group.category}</span>
              <span className="group-count">
                {searching
                  ? `${group.items.length} of ${group.total}`
                  : `${group.total} items`}
                {group.selected > 0 && (
                  <span className="group-selected"> &middot; {group.selected} selected</span>
                )}
              </span>
            </button>

            <div id={panelId} className="chip-grid" hidden={!isOpen}>
              {group.items.map(renderChip)}
            </div>
          </div>
        );
      })}
    </section>
  );
}
