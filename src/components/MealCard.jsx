import { PREFERENCE_BY_ID } from '../data/pantryData.js';
import {
  formatMinutes,
  ingredientNames,
  isStrongPreferenceFit,
} from '../utils/mealMatching.js';

function matchTone(percent) {
  if (percent === 100) return 'match-full';
  if (percent >= 60) return 'match-good';
  if (percent >= 30) return 'match-some';
  return 'match-low';
}

/**
 * Section component: one meal summary card on the recommendations screen.
 */
export default function MealCard({ meal, servings, preferenceId, onOpen }) {
  const missing = ingredientNames(meal.missingIngredients);
  const strongFit = isStrongPreferenceFit(meal, preferenceId);
  const preference = PREFERENCE_BY_ID[preferenceId];

  return (
    <button type="button" className="meal-card" onClick={() => onOpen(meal.id)}>
      <div className="meal-card-top">
        <span className="meal-emoji" aria-hidden="true">
          {meal.emoji}
        </span>
        <div className="meal-card-headings">
          <h3 className="meal-name">{meal.name}</h3>
          <p className="meal-tagline">{meal.tagline}</p>
        </div>
      </div>

      <div className={`match-bar ${matchTone(meal.matchPercent)}`}>
        <div className="match-fill" style={{ width: `${meal.matchPercent}%` }} />
        <span className="match-text">
          {meal.matchPercent}% match &middot; you have {meal.haveCount} of{' '}
          {meal.totalIngredientCount}
        </span>
      </div>

      <dl className="stat-row">
        <div className="stat">
          <dt>Time</dt>
          <dd>{formatMinutes(meal.totalMinutes)}</dd>
        </div>
        <div className="stat">
          <dt>Serves</dt>
          <dd>{servings}</dd>
        </div>
        <div className="stat">
          <dt>Per person</dt>
          <dd>{meal.caloriesPerServing} kcal</dd>
        </div>
        <div className="stat">
          <dt>Difficulty</dt>
          <dd>{meal.difficulty}</dd>
        </div>
      </dl>

      <div className="tag-row">
        <span className="tag tag-category">{meal.category}</span>
        {strongFit && preference && (
          <span className="tag tag-fit">
            <span aria-hidden="true">{preference.emoji}</span> Great for {preference.label}
          </span>
        )}
        {meal.isReadyToCook && <span className="tag tag-ready">Nothing missing</span>}
      </div>

      {missing.length > 0 && (
        <p className="missing-line">
          <span className="missing-label">Still need</span> {missing.join(', ')}
        </p>
      )}
    </button>
  );
}
