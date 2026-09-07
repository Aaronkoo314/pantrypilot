import FilterBar from './FilterBar.jsx';
import MealCard from './MealCard.jsx';
import { CUISINE_BY_ID, TIME_OPTIONS } from '../data/pantryData.js';

/**
 * Screen 2: the list of meals that fit the user's kitchen and constraints.
 */
export default function MealRecommendations({
  meals,
  counts,
  setup,
  filters,
  onFilterChange,
  onOpenMeal,
  onEditSetup,
}) {
  const timeLabel = (TIME_OPTIONS.find((item) => item.id === filters.timeId) || {}).label;
  const cuisineLabel =
    setup.cuisineIds.length === 0
      ? 'any cuisine'
      : setup.cuisineIds.map((id) => (CUISINE_BY_ID[id] || {}).label).join(' / ');

  // The empty state offers the undo for whatever is actually binding, rather
  // than sending the user to another screen to guess.
  const relaxations = [
    filters.readyOnly && {
      label: 'Show meals with missing items too',
      patch: { readyOnly: false },
    },
    filters.vegetarianOnly && {
      label: 'Include non-vegetarian meals',
      patch: { vegetarianOnly: false },
    },
    filters.weightBands.length > 0 && {
      label: 'Allow any weight',
      patch: { weightBands: [] },
    },
    filters.cuisineIds.length > 0 && {
      label: 'Allow any cuisine',
      patch: { cuisineIds: [] },
    },
    filters.timeId !== '60plus' && {
      label: 'Allow 60+ minutes',
      patch: { timeId: '60plus' },
    },
  ].filter(Boolean);

  return (
    <div className="screen">
      <header className="app-header compact">
        <button type="button" className="back-button" onClick={onEditSetup}>
          &larr; Change my kitchen
        </button>
        <h1 className="app-title">Meals for tonight</h1>
        <p className="summary-line">
          {setup.ingredientIds.length} ingredients &middot; {setup.people}{' '}
          {setup.people === 1 ? 'person' : 'people'} &middot; {timeLabel} &middot; {cuisineLabel}
        </p>
      </header>

      <FilterBar filters={filters} onChange={onFilterChange} counts={counts} />

      <p className="result-count" aria-live="polite">
        {meals.length} {meals.length === 1 ? 'meal' : 'meals'} found
      </p>

      {meals.length === 0 ? (
        <div className="card empty-card">
          <p className="empty-title">Nothing fits those settings.</p>
          <p className="empty-body">
            Loosen one of these, or add a few more ingredients to your kitchen.
          </p>
          {relaxations.map((item) => (
            <button
              key={item.label}
              type="button"
              className="secondary-button"
              onClick={() => onFilterChange(item.patch)}
            >
              {item.label}
            </button>
          ))}
          <button type="button" className="secondary-button" onClick={onEditSetup}>
            Edit my kitchen
          </button>
        </div>
      ) : (
        <div className="meal-list">
          {meals.map((meal) => (
            <MealCard key={meal.id} meal={meal} onOpen={onOpenMeal} />
          ))}
        </div>
      )}

      <p className="disclaimer">
        Nutrition figures and prices are invented sample data for this prototype. They are not
        health or medical advice, and they are not real shop prices.
      </p>
    </div>
  );
}
