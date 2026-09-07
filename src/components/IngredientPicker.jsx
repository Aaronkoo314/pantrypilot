import { useMemo, useState } from 'react';
import { INGREDIENTS, INGREDIENT_BY_ID, INGREDIENT_CATEGORIES } from '../data/pantryData.js';

/**
 * Section component: the ingredient list for "what do you have?".
 *
 * 93 ingredients, so the card is an index rather than a wall. Three things
 * carry it:
 *
 *   1. Search first. Someone at an open fridge knows what they are looking
 *      for; three letters beats opening five categories.
 *   2. What you have stays visible, at the top, where you can undo it.
 *   3. Categories collapse, and the two that need it have a second level -
 *      Meat & Seafood opens into Pork, Chicken, Beef, Lamb, Fish & Seafood and
 *      Plant Protein; Pantry & Flavour opens into Western, Chinese and Thai.
 *      Every header carries item and selected counts, so a closed card reads
 *      as an index rather than an empty one, and nobody has to scroll past
 *      twenty-six pantry items to reach the beef.
 */
export default function IngredientPicker({ selectedIds, onToggle, onClear }) {
  const [query, setQuery] = useState('');
  const [openCategories, setOpenCategories] = useState([]);
  const [openGroups, setOpenGroups] = useState([]);

  const searching = query.trim().length > 0;

  const tree = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matches = (item) => !needle || item.name.toLowerCase().includes(needle);

    return INGREDIENT_CATEGORIES.map((category) => {
      const all = INGREDIENTS.filter((item) => item.category === category);
      const hits = all.filter(matches);

      // A category is grouped when its items declare a group.
      const groupNames = [...new Set(all.map((item) => item.group).filter(Boolean))];
      const groups = groupNames
        .map((name) => {
          const groupAll = all.filter((item) => item.group === name);
          return {
            name,
            items: groupAll.filter(matches),
            total: groupAll.length,
            selected: groupAll.filter((item) => selectedIds.includes(item.id)).length,
          };
        })
        .filter((group) => group.items.length > 0);

      return {
        category,
        grouped: groupNames.length > 0,
        groups,
        items: groupNames.length > 0 ? [] : hits,
        total: all.length,
        hitCount: hits.length,
        selected: all.filter((item) => selectedIds.includes(item.id)).length,
      };
    }).filter((entry) => entry.hitCount > 0);
  }, [query, selectedIds]);

  const selectedItems = selectedIds.map((id) => INGREDIENT_BY_ID[id]).filter(Boolean);

  function toggleIn(setter, value) {
    setter((current) =>
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
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

  function renderHeader({ label, open, count, selected, onClick, sub }) {
    return (
      <button
        type="button"
        className={`group-header ${open ? 'group-open' : ''} ${sub ? 'group-header-sub' : ''}`}
        aria-expanded={open}
        onClick={onClick}
        disabled={searching}
      >
        <span className="group-caret" aria-hidden="true">
          {open ? '−' : '+'}
        </span>
        <span className="group-name">{label}</span>
        <span className="group-count">
          {count}
          {selected > 0 && <span className="group-selected"> &middot; {selected} selected</span>}
        </span>
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

      {tree.length === 0 && <p className="empty-note">Nothing matches &ldquo;{query}&rdquo;.</p>}

      {tree.map((entry) => {
        // A search opens whatever it found; browsing remembers what you opened.
        const catOpen = searching || openCategories.includes(entry.category);
        return (
          <div className="ingredient-group" key={entry.category}>
            {renderHeader({
              label: entry.category,
              open: catOpen,
              count: searching ? `${entry.hitCount} of ${entry.total}` : `${entry.total} items`,
              selected: entry.selected,
              onClick: () => toggleIn(setOpenCategories, entry.category),
              sub: false,
            })}

            {catOpen && !entry.grouped && (
              <div className="chip-grid">{entry.items.map(renderChip)}</div>
            )}

            {catOpen &&
              entry.grouped &&
              entry.groups.map((group) => {
                const key = `${entry.category}::${group.name}`;
                const groupOpen = searching || openGroups.includes(key);
                return (
                  <div className="ingredient-subgroup" key={key}>
                    {renderHeader({
                      label: group.name,
                      open: groupOpen,
                      count: searching
                        ? `${group.items.length} of ${group.total}`
                        : `${group.total} items`,
                      selected: group.selected,
                      onClick: () => toggleIn(setOpenGroups, key),
                      sub: true,
                    })}
                    {groupOpen && <div className="chip-grid">{group.items.map(renderChip)}</div>}
                  </div>
                );
              })}
          </div>
        );
      })}
    </section>
  );
}
