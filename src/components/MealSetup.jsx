import IngredientPicker from './IngredientPicker.jsx';
import { CUISINE_OPTIONS, TIME_OPTIONS, WEIGHT_BANDS } from '../data/pantryData.js';

const MIN_PEOPLE = 1;
const MAX_PEOPLE = 12;

/**
 * Screen 1: the user tells PantryPilot what they have and what they need.
 *
 * v1's four meal preferences are gone. Cuisine and how heavy the meal should
 * be replace them, and both are multi-select, because "Chinese or Thai, either
 * is fine" is a normal state of mind and a single-select would force a lie.
 * Selecting none means no restriction, which the helper line says out loud
 * rather than leaving the user to infer from an empty row.
 */
export default function MealSetup({ setup, onChange, onFindMeals, resultCount, readyCount }) {
  const { ingredientIds, people, timeId, cuisineIds, weightBands } = setup;

  const mealWord = resultCount === 1 ? 'meal' : 'meals';
  // Before any ingredients are picked there is nothing to say about shopping,
  // so the note reports what the other filters allow instead of a count stuck
  // at zero.
  const buttonNote =
    ingredientIds.length === 0
      ? `${resultCount} ${mealWord} fit your filters`
      : `${resultCount} ${mealWord} · ${readyCount} ${
          readyCount === 1 ? 'needs' : 'need'
        } no shopping`;

  function toggleIngredient(id) {
    onChange((current) => ({
      ingredientIds: current.ingredientIds.includes(id)
        ? current.ingredientIds.filter((item) => item !== id)
        : [...current.ingredientIds, id],
    }));
  }

  function stepPeople(delta) {
    onChange((current) => ({
      people: Math.min(MAX_PEOPLE, Math.max(MIN_PEOPLE, current.people + delta)),
    }));
  }

  function toggleIn(key, id) {
    onChange((current) => ({
      [key]: current[key].includes(id)
        ? current[key].filter((item) => item !== id)
        : [...current[key], id],
    }));
  }

  function renderMultiSelect(key, options, selected) {
    return (
      <div className="option-row">
        {options.map((option) => {
          const isOn = selected.includes(option.id);
          return (
            <button
              key={option.id}
              type="button"
              className={`option-tile ${isOn ? 'option-on' : ''}`}
              aria-pressed={isOn}
              onClick={() => toggleIn(key, option.id)}
            >
              {option.emoji && (
                <span className="option-emoji" aria-hidden="true">
                  {option.emoji}
                </span>
              )}
              <span className="option-label">{option.label}</span>
              {option.helper && <span className="option-helper">{option.helper}</span>}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="screen">
      <header className="app-header">
        <p className="brand">
          <span aria-hidden="true">&#127813;</span> PantryPilot
        </p>
        <h1 className="app-title">Cook what you already have</h1>
        <p className="app-subtitle">
          Five quick answers and you will know what is for dinner.
        </p>
      </header>

      <IngredientPicker
        selectedIds={ingredientIds}
        onToggle={toggleIngredient}
        onClear={() => onChange({ ingredientIds: [] })}
      />

      <section className="card" aria-labelledby="people-heading">
        <h2 id="people-heading" className="section-title">
          How many people?
        </h2>
        <p className="section-hint">We scale every recipe to this number.</p>
        <div className="stepper">
          <button
            type="button"
            className="stepper-button"
            onClick={() => stepPeople(-1)}
            disabled={people <= MIN_PEOPLE}
            aria-label="One fewer person"
          >
            &minus;
          </button>
          <div className="stepper-value">
            <span className="stepper-number">{people}</span>
            <span className="stepper-unit">{people === 1 ? 'person' : 'people'}</span>
          </div>
          <button
            type="button"
            className="stepper-button"
            onClick={() => stepPeople(1)}
            disabled={people >= MAX_PEOPLE}
            aria-label="One more person"
          >
            +
          </button>
        </div>
      </section>

      <section className="card" aria-labelledby="time-heading">
        <h2 id="time-heading" className="section-title">
          How much time?
        </h2>
        <p className="section-hint">Prep and cooking time together.</p>
        <div className="option-row">
          {TIME_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`option-tile ${timeId === option.id ? 'option-on' : ''}`}
              aria-pressed={timeId === option.id}
              onClick={() => onChange({ timeId: option.id })}
            >
              <span className="option-label">{option.label}</span>
              <span className="option-helper">{option.helper}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="card" aria-labelledby="cuisine-heading">
        <h2 id="cuisine-heading" className="section-title">
          What are you in the mood for?
        </h2>
        <p className="section-hint">
          {cuisineIds.length === 0
            ? 'Pick any, or leave them all off for everything.'
            : `Showing ${cuisineIds.length} of ${CUISINE_OPTIONS.length} cuisines.`}
        </p>
        {renderMultiSelect('cuisineIds', CUISINE_OPTIONS, cuisineIds)}
      </section>

      <section className="card" aria-labelledby="weight-heading">
        <h2 id="weight-heading" className="section-title">
          How heavy?
        </h2>
        <p className="section-hint">
          {weightBands.length === 0
            ? 'By calories per person. Leave them all off for everything.'
            : 'By calories per person.'}
        </p>
        {renderMultiSelect('weightBands', WEIGHT_BANDS, weightBands)}
      </section>

      <div className="sticky-bar">
        <button type="button" className="primary-button" onClick={onFindMeals}>
          Find Meals
          <span className="button-note">{buttonNote}</span>
        </button>
      </div>
    </div>
  );
}
