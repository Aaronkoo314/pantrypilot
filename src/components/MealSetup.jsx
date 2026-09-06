import IngredientPicker from './IngredientPicker.jsx';
import { PREFERENCE_OPTIONS, TIME_OPTIONS } from '../data/pantryData.js';

const MIN_PEOPLE = 1;
const MAX_PEOPLE = 12;

/**
 * Screen 1: the user tells PantryPilot what they have and what they need.
 */
export default function MealSetup({ setup, onChange, onFindMeals, resultCount }) {
  const { ingredientIds, people, timeId, preferenceId } = setup;

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

  return (
    <div className="screen">
      <header className="app-header">
        <p className="brand">
          <span aria-hidden="true">&#127813;</span> PantryPilot
        </p>
        <h1 className="app-title">Cook what you already have</h1>
        <p className="app-subtitle">
          Four quick answers and you will know what is for dinner.
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

      <section className="card" aria-labelledby="preference-heading">
        <h2 id="preference-heading" className="section-title">
          What kind of meal?
        </h2>
        <p className="section-hint">This changes the order we suggest things in.</p>
        <div className="option-grid">
          {PREFERENCE_OPTIONS.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`option-tile ${preferenceId === option.id ? 'option-on' : ''}`}
              aria-pressed={preferenceId === option.id}
              onClick={() => onChange({ preferenceId: option.id })}
            >
              <span className="option-emoji" aria-hidden="true">
                {option.emoji}
              </span>
              <span className="option-label">{option.label}</span>
              <span className="option-helper">{option.helper}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="sticky-bar">
        <button type="button" className="primary-button" onClick={onFindMeals}>
          Find Meals
          <span className="button-note">
            {resultCount} {resultCount === 1 ? 'meal' : 'meals'} fit right now
          </span>
        </button>
      </div>
    </div>
  );
}
