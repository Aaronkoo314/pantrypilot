import { useMemo, useState } from 'react';
import { formatMinutes, scaleMeal } from '../utils/mealMatching.js';

const MIN_SERVINGS = 1;
const MAX_SERVINGS = 12;

/**
 * Screen 3: everything the user needs to actually cook the meal,
 * including a serving-size control that rescales quantities and totals.
 */
export default function MealDetail({ meal, ownedIds, initialServings, onBack }) {
  const [servings, setServings] = useState(
    Math.min(MAX_SERVINGS, Math.max(MIN_SERVINGS, initialServings))
  );

  const owned = useMemo(() => new Set(ownedIds), [ownedIds]);
  const scaled = useMemo(() => scaleMeal(meal, servings), [meal, servings]);

  const haveLines = scaled.ingredients.filter((line) => owned.has(line.id));
  const needLines = scaled.ingredients.filter((line) => !owned.has(line.id));

  function stepServings(delta) {
    setServings((current) =>
      Math.min(MAX_SERVINGS, Math.max(MIN_SERVINGS, current + delta))
    );
  }

  return (
    <div className="screen">
      <header className="app-header compact">
        <button type="button" className="back-button" onClick={onBack}>
          &larr; Back to meals
        </button>
        <div className="detail-title-row">
          <span className="detail-emoji" aria-hidden="true">
            {meal.emoji}
          </span>
          <div>
            <h1 className="app-title">{meal.name}</h1>
            <p className="app-subtitle">{meal.tagline}</p>
          </div>
        </div>
        <div className="tag-row">
          <span className="tag tag-category">{meal.category}</span>
          <span className="tag">{meal.difficulty}</span>
          <span className="tag">{meal.matchPercent}% match</span>
          {meal.isReadyToCook && <span className="tag tag-ready">Nothing missing</span>}
        </div>
      </header>

      <section className="card" aria-labelledby="servings-heading">
        <h2 id="servings-heading" className="section-title">
          Serving size
        </h2>
        <p className="section-hint">
          Quantities and totals rescale. Calories per person stay the same.
        </p>
        <div className="stepper">
          <button
            type="button"
            className="stepper-button"
            onClick={() => stepServings(-1)}
            disabled={servings <= MIN_SERVINGS}
            aria-label="One fewer serving"
          >
            &minus;
          </button>
          <div className="stepper-value">
            <span className="stepper-number">{servings}</span>
            <span className="stepper-unit">{servings === 1 ? 'serving' : 'servings'}</span>
          </div>
          <button
            type="button"
            className="stepper-button"
            onClick={() => stepServings(1)}
            disabled={servings >= MAX_SERVINGS}
            aria-label="One more serving"
          >
            +
          </button>
        </div>
        <p className="base-note">Recipe was written for {meal.baseServings} servings.</p>
      </section>

      <section className="card" aria-labelledby="time-heading-detail">
        <h2 id="time-heading-detail" className="section-title">
          Time
        </h2>
        <dl className="stat-row three">
          <div className="stat">
            <dt>Prep</dt>
            <dd>{formatMinutes(meal.prepMinutes)}</dd>
          </div>
          <div className="stat">
            <dt>Cook</dt>
            <dd>{formatMinutes(meal.cookMinutes)}</dd>
          </div>
          <div className="stat stat-strong">
            <dt>Total</dt>
            <dd>{formatMinutes(meal.totalMinutes)}</dd>
          </div>
        </dl>
      </section>

      <section className="card" aria-labelledby="ingredients-heading-detail">
        <h2 id="ingredients-heading-detail" className="section-title">
          Ingredients for {servings} {servings === 1 ? 'serving' : 'servings'}
        </h2>

        <h3 className="group-title group-have">
          You have ({haveLines.length})
        </h3>
        {haveLines.length === 0 ? (
          <p className="empty-note">Nothing from this recipe is in your kitchen yet.</p>
        ) : (
          <ul className="ingredient-list">
            {haveLines.map((line) => (
              <li className="ingredient-row row-have" key={line.id}>
                <span className="row-mark" aria-hidden="true">
                  &#10003;
                </span>
                <span className="row-emoji" aria-hidden="true">
                  {line.ingredient.emoji}
                </span>
                <span className="row-name">{line.ingredient.name}</span>
                <span className="row-qty">{line.display}</span>
              </li>
            ))}
          </ul>
        )}

        <h3 className="group-title group-need">
          You still need ({needLines.length})
        </h3>
        {needLines.length === 0 ? (
          <p className="ready-note">
            You have everything. Start cooking whenever you are ready.
          </p>
        ) : (
          <ul className="ingredient-list">
            {needLines.map((line) => (
              <li className="ingredient-row row-need" key={line.id}>
                <span className="row-mark" aria-hidden="true">
                  +
                </span>
                <span className="row-emoji" aria-hidden="true">
                  {line.ingredient.emoji}
                </span>
                <span className="row-name">{line.ingredient.name}</span>
                <span className="row-qty">{line.display}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card" aria-labelledby="nutrition-heading">
        <h2 id="nutrition-heading" className="section-title">
          Nutrition
        </h2>

        <div className="calorie-split">
          <div className="calorie-box">
            <span className="calorie-value">{scaled.caloriesPerServing}</span>
            <span className="calorie-label">kcal per person</span>
          </div>
          <div className="calorie-box calorie-box-muted">
            <span className="calorie-value">{scaled.totalCalories}</span>
            <span className="calorie-label">kcal total ({servings} servings)</span>
          </div>
        </div>

        <h3 className="group-title">Per serving</h3>
        <dl className="stat-row three">
          <div className="stat">
            <dt>Protein</dt>
            <dd>{meal.proteinGrams} g</dd>
          </div>
          <div className="stat">
            <dt>Carbs</dt>
            <dd>{meal.carbGrams} g</dd>
          </div>
          <div className="stat">
            <dt>Fat</dt>
            <dd>{meal.fatGrams} g</dd>
          </div>
        </dl>

        <h3 className="group-title">Whole dish</h3>
        <dl className="stat-row three">
          <div className="stat">
            <dt>Protein</dt>
            <dd>{scaled.totalProtein} g</dd>
          </div>
          <div className="stat">
            <dt>Carbs</dt>
            <dd>{scaled.totalCarbs} g</dd>
          </div>
          <div className="stat">
            <dt>Fat</dt>
            <dd>{scaled.totalFat} g</dd>
          </div>
        </dl>

        <p className="disclaimer">
          Invented sample figures for this prototype. Not health or medical advice.
        </p>
      </section>

      <section className="card" aria-labelledby="steps-heading">
        <h2 id="steps-heading" className="section-title">
          How to cook it
        </h2>
        <ol className="step-list">
          {meal.steps.map((step, index) => (
            <li className="step-row" key={step}>
              <span className="step-number" aria-hidden="true">
                {index + 1}
              </span>
              <span className="step-text">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="sticky-bar">
        <button type="button" className="primary-button" onClick={onBack}>
          Back to meals
        </button>
      </div>
    </div>
  );
}
