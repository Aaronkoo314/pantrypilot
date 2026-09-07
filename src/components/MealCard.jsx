import { CUISINE_BY_ID, WEIGHT_BAND_BY_ID } from '../data/pantryData.js';
import { formatMinutes, formatPrice, ingredientNames } from '../utils/mealMatching.js';

/**
 * Section component: one meal summary card on the recommendations screen.
 *
 * Four figures, and they are the four the sorts offer: time, calories per
 * person, price per person, and the ingredient match printed above them. v1
 * showed "Serves" on every card, which was the same number on all of them,
 * and difficulty, which was Easy on most - both have moved to the tag row
 * where they cost no vertical space.
 */
export default function MealCard({ meal, onOpen }) {
  const missing = ingredientNames(meal.missingIngredients);
  const cuisine = CUISINE_BY_ID[meal.cuisine];
  const band = WEIGHT_BAND_BY_ID[meal.weightBand];

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

      <p className="match-line">
        <span>{meal.matchPercent}% match</span>
        <span className="match-count">
          you have {meal.haveCount} of {meal.totalIngredientCount}
        </span>
      </p>
      {/* The line above states the figure; the meter only echoes it, so it is
          hidden from assistive technology rather than repeated. */}
      <div
        className={`meter ${meal.isReadyToCook ? 'meter-ready' : ''}`}
        aria-hidden="true"
      >
        <div className="meter-fill" style={{ width: `${meal.matchPercent}%` }} />
      </div>

      <dl className="stat-row">
        <div className="stat">
          <dt>Time</dt>
          <dd>{formatMinutes(meal.totalMinutes)}</dd>
        </div>
        <div className="stat">
          <dt>Per person</dt>
          <dd>{meal.caloriesPerServing} kcal</dd>
        </div>
        <div className="stat">
          <dt>Price each</dt>
          <dd>{formatPrice(meal.pricePerServing)}</dd>
        </div>
        <div className="stat">
          <dt>Serves</dt>
          <dd>{meal.baseServings}</dd>
        </div>
      </dl>

      <div className="tag-row">
        {cuisine && (
          <span className="tag tag-cuisine">
            <span aria-hidden="true">{cuisine.emoji}</span> {cuisine.label}
          </span>
        )}
        <span className="tag tag-category">{meal.category}</span>
        {band && <span className={`tag tag-band tag-band-${meal.weightBand}`}>{band.label}</span>}
        <span className="tag">{meal.difficulty}</span>
        {meal.vegetarian && <span className="tag tag-veg">Vegetarian</span>}
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
