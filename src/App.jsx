import { useEffect, useMemo, useState } from 'react';
import MealSetup from './components/MealSetup.jsx';
import MealRecommendations from './components/MealRecommendations.jsx';
import MealDetail from './components/MealDetail.jsx';
import { MEALS, MEAL_BY_ID } from './data/pantryData.js';
import { buildRecommendations, matchMeal, timeLimitMinutes } from './utils/mealMatching.js';

/**
 * PantryPilot root.
 *
 * All three screens live in one page: `screen` decides which one renders,
 * so moving between them never reloads the browser.
 */
export default function App() {
  const [screen, setScreen] = useState('setup');
  const [activeMealId, setActiveMealId] = useState(null);

  const [setup, setSetup] = useState({
    ingredientIds: [],
    people: 2,
    timeId: '30',
    preferenceId: 'regular',
  });

  const [listOptions, setListOptions] = useState({
    sortId: 'recommended',
    readyOnly: false,
  });

  // Every screen change starts at the top of the page, like a real app would.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen, activeMealId]);

  const filters = {
    timeId: setup.timeId,
    preferenceId: setup.preferenceId,
    sortId: listOptions.sortId,
    readyOnly: listOptions.readyOnly,
  };

  const recommendations = useMemo(
    () =>
      buildRecommendations(MEALS, {
        ownedIds: setup.ingredientIds,
        timeId: setup.timeId,
        preferenceId: setup.preferenceId,
        sortId: listOptions.sortId,
        readyOnly: listOptions.readyOnly,
      }),
    [setup, listOptions]
  );

  // How many meals need no extra shopping, before the "ready only" toggle is applied.
  const readyCount = useMemo(() => {
    const limit = timeLimitMinutes(setup.timeId);
    return MEALS.filter((meal) => meal.totalMinutes <= limit).filter(
      (meal) => matchMeal(meal, setup.ingredientIds).isReadyToCook
    ).length;
  }, [setup.timeId, setup.ingredientIds]);

  // How many cards the results screen will actually show, before the
  // results-screen toggles are applied. Moves with the time budget.
  const setupResultCount = useMemo(() => {
    const limit = timeLimitMinutes(setup.timeId);
    return MEALS.filter((meal) => meal.totalMinutes <= limit).length;
  }, [setup.timeId]);

  const activeMeal = useMemo(() => {
    if (!activeMealId || !MEAL_BY_ID[activeMealId]) return null;
    return matchMeal(MEAL_BY_ID[activeMealId], setup.ingredientIds);
  }, [activeMealId, setup.ingredientIds]);

  // `patch` may be an object, or a function of the current setup for updates
  // that depend on what is already selected (toggling an ingredient, stepping
  // the people count).
  function updateSetup(patch) {
    setSetup((current) => ({
      ...current,
      ...(typeof patch === 'function' ? patch(current) : patch),
    }));
  }

  function updateFilters(patch) {
    const { timeId, preferenceId, ...rest } = patch;
    if (timeId || preferenceId) {
      updateSetup({ ...(timeId ? { timeId } : {}), ...(preferenceId ? { preferenceId } : {}) });
    }
    if (Object.keys(rest).length > 0) {
      setListOptions((current) => ({ ...current, ...rest }));
    }
  }

  function openMeal(mealId) {
    setActiveMealId(mealId);
    setScreen('detail');
  }

  if (screen === 'detail' && activeMeal) {
    return (
      <MealDetail
        key={activeMeal.id}
        meal={activeMeal}
        ownedIds={setup.ingredientIds}
        initialServings={setup.people}
        onBack={() => setScreen('results')}
      />
    );
  }

  if (screen === 'results') {
    return (
      <MealRecommendations
        meals={recommendations}
        readyCount={readyCount}
        setup={setup}
        filters={filters}
        onFilterChange={updateFilters}
        onOpenMeal={openMeal}
        onEditSetup={() => setScreen('setup')}
      />
    );
  }

  return (
    <MealSetup
      setup={setup}
      onChange={updateSetup}
      onFindMeals={() => setScreen('results')}
      resultCount={setupResultCount}
      readyCount={readyCount}
    />
  );
}
