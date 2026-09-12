import { useEffect, useMemo, useState } from 'react';
import SplashScreen from './components/SplashScreen.jsx';
import ServiceStatus from './components/ServiceStatus.jsx';
import SiteFooter from './components/SiteFooter.jsx';
import MealSetup from './components/MealSetup.jsx';
import MealRecommendations from './components/MealRecommendations.jsx';
import MealDetail from './components/MealDetail.jsx';
import { MEALS, MEAL_BY_ID } from './data/pantryData.js';
import { buildRecommendations, defaultSortDir, matchMeal } from './utils/mealMatching.js';

/**
 * PantryPilot root.
 *
 * All three screens live in one page: `screen` decides which one renders,
 * so moving between them never reloads the browser.
 */
export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [screen, setScreen] = useState('setup');
  const [activeMealId, setActiveMealId] = useState(null);

  // What the user tells us on screen 1. Cuisines and weight bands are
  // multi-select: an empty array means no restriction rather than nothing.
  const [setup, setSetup] = useState({
    ingredientIds: [],
    people: 2,
    timeId: '30',
    cuisineIds: [],
    weightBands: [],
  });

  // Controls that only exist on the results screen.
  const [listOptions, setListOptions] = useState({
    sortId: 'match',
    sortDir: 'desc',
    readyOnly: false,
    vegetarianOnly: false,
  });

  // Every screen change starts at the top of the page, like a real app would.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen, activeMealId]);

  const filters = {
    timeId: setup.timeId,
    cuisineIds: setup.cuisineIds,
    weightBands: setup.weightBands,
    sortId: listOptions.sortId,
    sortDir: listOptions.sortDir,
    readyOnly: listOptions.readyOnly,
    vegetarianOnly: listOptions.vegetarianOnly,
  };

  const recommendations = useMemo(
    () => buildRecommendations(MEALS, { ownedIds: setup.ingredientIds, ...filters }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setup, listOptions]
  );

  /**
   * Counts for the labels that promise something.
   *
   * Each applies every filter EXCEPT the one whose own label it sits on, so a
   * toggle can never advertise a number it is itself about to exclude. v1
   * shipped a counter that ignored the ingredient list entirely and read the
   * same whether nothing or fourteen things were ticked; see PROMPTS.md 2.14.
   */
  const counts = useMemo(() => {
    const base = {
      ownedIds: setup.ingredientIds,
      timeId: setup.timeId,
      cuisineIds: setup.cuisineIds,
      weightBands: setup.weightBands,
      sortId: 'match',
      sortDir: 'desc',
    };
    return {
      // ignores readyOnly, because it labels the readyOnly toggle
      ready: buildRecommendations(MEALS, {
        ...base,
        vegetarianOnly: listOptions.vegetarianOnly,
        readyOnly: true,
      }).length,
      // ignores vegetarianOnly, because it labels the vegetarian toggle
      vegetarian: buildRecommendations(MEALS, {
        ...base,
        readyOnly: listOptions.readyOnly,
        vegetarianOnly: true,
      }).length,
      // what pressing Find Meals will actually show
      setupTotal: buildRecommendations(MEALS, base).length,
      // The setup screen's own version, applying only the controls that screen
      // has. `ready` above carries the results-screen vegetarian toggle, which
      // on setup would silently shape a number against a control that is not
      // on the page - the same thing that made v1's counter unreconcilable.
      readyForSetup: buildRecommendations(MEALS, { ...base, readyOnly: true }).length,
    };
  }, [setup, listOptions.readyOnly, listOptions.vegetarianOnly]);

  const activeMeal = useMemo(() => {
    if (!activeMealId || !MEAL_BY_ID[activeMealId]) return null;
    return matchMeal(MEAL_BY_ID[activeMealId], setup.ingredientIds);
  }, [activeMealId, setup.ingredientIds]);

  // `patch` may be an object, or a function of the current setup for updates
  // that depend on what is already selected.
  function updateSetup(patch) {
    setSetup((current) => ({
      ...current,
      ...(typeof patch === 'function' ? patch(current) : patch),
    }));
  }

  function updateFilters(patch) {
    const { timeId, cuisineIds, weightBands, ...rest } = patch;
    if (timeId !== undefined || cuisineIds !== undefined || weightBands !== undefined) {
      updateSetup({
        ...(timeId !== undefined ? { timeId } : {}),
        ...(cuisineIds !== undefined ? { cuisineIds } : {}),
        ...(weightBands !== undefined ? { weightBands } : {}),
      });
    }
    if (Object.keys(rest).length > 0) {
      // Picking a new sort starts it in its own natural direction rather than
      // inheriting the previous one's, which would silently mean something else.
      if (rest.sortId && rest.sortDir === undefined) {
        rest.sortDir = defaultSortDir(rest.sortId);
      }
      setListOptions((current) => ({ ...current, ...rest }));
    }
  }

  function openMeal(mealId) {
    setActiveMealId(mealId);
    setScreen('detail');
  }

  // The cover sits above whatever screen is already mounted behind it, so
  // nothing has to load again once it fades.
  const cover = showSplash ? <SplashScreen onDone={() => setShowSplash(false)} /> : null;

  if (screen === 'detail' && activeMeal) {
    return (
      <>
        {cover}
        <ServiceStatus />
        <MealDetail
          key={activeMeal.id}
          meal={activeMeal}
          ownedIds={setup.ingredientIds}
          initialServings={setup.people}
          onBack={() => setScreen('results')}
        />
        <SiteFooter />
      </>
    );
  }

  if (screen === 'results') {
    return (
      <>
        {cover}
        <ServiceStatus />
        <MealRecommendations
          meals={recommendations}
          counts={counts}
          setup={setup}
          filters={filters}
          onFilterChange={updateFilters}
          onOpenMeal={openMeal}
          onEditSetup={() => setScreen('setup')}
        />
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      {cover}
      <ServiceStatus />
      <MealSetup
        setup={setup}
        onChange={updateSetup}
        onFindMeals={() => setScreen('results')}
        resultCount={counts.setupTotal}
        readyCount={counts.readyForSetup}
      />
      <SiteFooter />
    </>
  );
}
