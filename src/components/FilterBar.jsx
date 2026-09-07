import { PREFERENCE_OPTIONS, TIME_OPTIONS } from '../data/pantryData.js';
import { SORT_OPTIONS, SORT_BY_ID } from '../utils/mealMatching.js';

/**
 * Section component: the filter and sort controls above the meal list.
 */
export default function FilterBar({ filters, onChange, readyCount }) {
  const { timeId, preferenceId, sortId, sortDir, readyOnly } = filters;

  const sort = SORT_BY_ID[sortId] || SORT_BY_ID.recommended;
  const isAsc = sortDir === 'asc';
  const nextDir = isAsc ? 'desc' : 'asc';

  return (
    <section className="card filter-card" aria-label="Filter and sort meals">
      <div className="filter-block">
        <span className="filter-label">Cooking time</span>
        <div className="pill-row">
          {TIME_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`pill ${timeId === option.id ? 'pill-on' : ''}`}
              aria-pressed={timeId === option.id}
              onClick={() => onChange({ timeId: option.id })}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-block">
        <span className="filter-label">Meal preference</span>
        <div className="pill-row">
          {PREFERENCE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`pill ${preferenceId === option.id ? 'pill-on' : ''}`}
              aria-pressed={preferenceId === option.id}
              onClick={() => onChange({ preferenceId: option.id })}
            >
              <span aria-hidden="true">{option.emoji}</span> {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-block">
        <label className="filter-label" htmlFor="sort-select">
          Sort by
        </label>
        <div className="sort-row">
          <select
            id="sort-select"
            className="select"
            value={sortId}
            onChange={(event) => onChange({ sortId: event.target.value })}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Only the sorts where reversing is a real question get the control.
              The button states the order you are in; tapping gives the other. */}
          {sort.directional && (
            <button
              type="button"
              className="sort-dir"
              onClick={() => onChange({ sortDir: nextDir })}
              aria-label={`Sorted ${isAsc ? sort.ascLabel : sort.descLabel}. Switch to ${
                isAsc ? sort.descLabel : sort.ascLabel
              }.`}
            >
              <span className="sort-dir-arrow" aria-hidden="true">
                {isAsc ? '↑' : '↓'}
              </span>
              <span className="sort-dir-text">{isAsc ? sort.ascLabel : sort.descLabel}</span>
            </button>
          )}
        </div>
      </div>

      <button
        type="button"
        className={`toggle-row ${readyOnly ? 'toggle-on' : ''}`}
        aria-pressed={readyOnly}
        onClick={() => onChange({ readyOnly: !readyOnly })}
      >
        <span className="toggle-track" aria-hidden="true">
          <span className="toggle-knob" />
        </span>
        <span className="toggle-text">
          <span className="toggle-title">Only meals I can cook now</span>
          <span className="toggle-hint">
            Nothing extra to buy &middot; {readyCount} available
          </span>
        </span>
      </button>
    </section>
  );
}
