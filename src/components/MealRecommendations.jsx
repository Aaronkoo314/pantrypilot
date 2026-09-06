import FilterBar from './FilterBar.jsx';
import MealCard from './MealCard.jsx';
import { PREFERENCE_BY_ID, TIME_OPTIONS } from '../data/pantryData.js';

/**
 * Screen 2: the ranked list of meals that fit the user's kitchen and constraints.
 */
export default function MealRecommendations({
  meals,
  readyCount,
  setup,
  filters,
  onFilterChange,
  onOpenMeal,
  onEditSetup,
}) {
  const timeLabel = (TIME_OPTIONS.find((item) => item.id === filters.timeId) || {}).label;
  const preferenceLabel = (PREFERENCE_BY_ID[filters.preferenceId] || {}).label;

  return (
    <div className="screen">
      <header className="app-header compact">
        <button type="button" className="back-button" onClick={onEditSetup}>
          &larr; Change my kitchen
        </button>
        <h1 className="app-title">Meals for tonight</h1>
        <p className="summary-line">
          {setup.ingredientIds.length} ingredients &middot; {setup.people}{' '}
          {setup.people === 1 ? 'person' : 'people'} &middot; {timeLabel} &middot;{' '}
          {preferenceLabel}
        </p>
      </header>

      <FilterBar filters={filters} onChange={onFilterChange} readyCount={readyCount} />

      <p className="result-count" aria-live="polite">
        {meals.length} {meals.length === 1 ? 'meal' : 'meals'} found
      </p>

      {meals.length === 0 ? (
        <div className="card empty-card">
          <p className="empty-title">Nothing fits those settings yet.</p>
          <p className="empty-body">
            Try a longer cooking time, turn off &ldquo;only meals I can cook now&rdquo;, or add a
            few more ingredients to your kitchen.
          </p>
          <button type="button" className="secondary-button" onClick={onEditSetup}>
            Edit my kitchen
          </button>
        </div>
      ) : (
        <div className="meal-list">
          {meals.map((meal) => (
            <MealCard
              key={meal.id}
              meal={meal}
              servings={setup.people}
              preferenceId={filters.preferenceId}
              onOpen={onOpenMeal}
            />
          ))}
        </div>
      )}

      <p className="disclaimer">
        Nutrition figures are invented sample data for this prototype and are not health or
        medical advice.
      </p>
    </div>
  );
}
