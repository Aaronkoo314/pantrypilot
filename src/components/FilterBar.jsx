import { useState } from 'react';
import { CUISINE_OPTIONS, TIME_OPTIONS, WEIGHT_BANDS } from '../data/pantryData.js';
import { SORT_BY_ID, SORT_OPTIONS } from '../utils/mealMatching.js';

/**
 * Section component: the filter and sort controls above the meal list.
 *
 * Time, cuisine and weight were all answered two taps ago on the setup screen,
 * so repeating them here would put three rows of pills between the user and
 * the results they just asked for. They live behind one disclosure that names
 * what is currently active. Sort and the two toggles stay out, because those
 * are the controls people actually reach for while scanning a list.
 */
export default function FilterBar({ filters, onChange, counts }) {
  const [open, setOpen] = useState(false);

  const { timeId, cuisineIds, weightBands, sortId, sortDir, readyOnly, vegetarianOnly } = filters;

  const sort = SORT_BY_ID[sortId] || SORT_BY_ID.match;
  const isAsc = sortDir === 'asc';
  const nextDir = isAsc ? 'desc' : 'asc';

  const timeLabel = (TIME_OPTIONS.find((item) => item.id === timeId) || {}).label;
  const activeBits = [
    timeLabel,
    cuisineIds.length ? `${cuisineIds.length} cuisine${cuisineIds.length > 1 ? 's' : ''}` : null,
    weightBands.length ? weightBands.map((id) => id).join(' + ') : null,
  ].filter(Boolean);

  function toggleIn(key, id) {
    const current = filters[key];
    onChange({
      [key]: current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    });
  }

  function pillRow(key, options, selected) {
    return (
      <div className="pill-row">
        {options.map((option) => {
          const isOn = selected.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              className={`pill ${isOn ? 'pill-on' : ''}`}
              aria-pressed={isOn}
              onClick={() => toggleIn(key, option.id)}
            >
              {option.emoji && <span aria-hidden="true">{option.emoji} </span>}
              {option.label}
            </button>
          );
        })}
      </div>
    );
  }

  function toggle({ on, onClick, title, hint }) {
    return (
      <button type="button" className={`toggle-row ${on ? 'toggle-on' : ''}`} aria-pressed={on} onClick={onClick}>
        <span className="toggle-track" aria-hidden="true">
          <span className="toggle-knob" />
        </span>
        <span className="toggle-text">
          <span className="toggle-title">{title}</span>
          <span className="toggle-hint">{hint}</span>
        </span>
      </button>
    );
  }

  return (
    <section className="card filter-card" aria-label="Filter and sort meals">
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

      {toggle({
        on: readyOnly,
        onClick: () => onChange({ readyOnly: !readyOnly }),
        title: 'Only meals I can cook now',
        hint: `Nothing extra to buy · ${counts.ready} available`,
      })}

      {toggle({
        on: vegetarianOnly,
        onClick: () => onChange({ vegetarianOnly: !vegetarianOnly }),
        title: 'Vegetarian only',
        hint: `${counts.vegetarian} available · no meat, fish or fish-based sauces`,
      })}

      <button
        type="button"
        className="disclosure"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="group-caret" aria-hidden="true">
          {open ? '−' : '+'}
        </span>
        <span className="group-name">Time, cuisine and weight</span>
        <span className="group-count">{activeBits.join(' · ')}</span>
      </button>

      <div hidden={!open}>
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
          <span className="filter-label">
            Cuisine {cuisineIds.length === 0 && <span className="filter-any">any</span>}
          </span>
          {pillRow('cuisineIds', CUISINE_OPTIONS, cuisineIds)}
        </div>

        <div className="filter-block">
          <span className="filter-label">
            How heavy {weightBands.length === 0 && <span className="filter-any">any</span>}
          </span>
          {pillRow('weightBands', WEIGHT_BANDS, weightBands)}
        </div>
      </div>
    </section>
  );
}
