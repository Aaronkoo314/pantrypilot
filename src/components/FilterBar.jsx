import { PREFERENCE_OPTIONS, TIME_OPTIONS } from '../data/pantryData.js';
import { SORT_OPTIONS } from '../utils/mealMatching.js';

/**
 * Section component: the filter and sort controls above the meal list.
 */
export default function FilterBar({ filters, onChange, readyCount }) {
  const { timeId, preferenceId, sortId, readyOnly } = filters;

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
