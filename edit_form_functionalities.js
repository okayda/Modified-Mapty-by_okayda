'use strict';
import { infoData, CustomData } from '/app.js';
import { renderMethods } from '/render_markup.js';
import { dataObj as queryName } from './query_name.js';

const editForm = document.querySelector(queryName.editForm);

export const changeWorkoutInfo = function () {
  const reset_specificEvent_and_dataset = function () {
    editForm.removeAttribute('data-id');
    infoData.specificEvents = [];
  };

  const makeEmptyEditFormInputs = function (str) {
    const distance = document.querySelector(`.${str}Distance`);
    const duration = document.querySelector(`.${str}Duration`);

    let cadence_or_elevation;

    if (exerciseType === 'r')
      cadence_or_elevation = document.querySelector(queryName.edit_rCadence);
    else
      cadence_or_elevation = document.querySelector(queryName.edit_cElevation);

    cadence_or_elevation.value = distance.value = duration.value = '';
  };

  const exerciseSimilarInputs_Value = function (exerciseType) {
    const str = exerciseType ? 'r' : 'c';
    let cadence, elevationGain;

    const distance = +document.querySelector(`.${str}Distance`).value;
    const duration = +document.querySelector(`.${str}Duration`).value;

    if (exerciseType)
      cadence = +document.querySelector(queryName.edit_rCadence).value;
    else
      elevationGain = +document.querySelector(queryName.edit_cElevation).value;

    makeEmptyEditFormInputs(str);

    return {
      distance: distance,
      duration: duration,
      cadence: cadence,
      elevationGain: elevationGain,
    };
  };

  const exerciseTargetId = infoData.specificEvents[0];

  const exerciseTextNodes = infoData.specificEvents[1];

  const exerciseIcon = infoData.specificEvents[2];

  const exerciseTitle = infoData.specificEvents[3];

  const targetExerciseHTML = function () {
    let getDOMArr = [];
    document.querySelectorAll(queryName.workItself).forEach(exercise => {
      if (exercise.dataset.id === exerciseTargetId)
        getDOMArr.push(
          exercise.querySelector(queryName.workInfo),
          exercise.querySelector('.fa-arrow-down')
        );
    });

    return getDOMArr;
  };

  const addStyleExcercise = function (isLongJourney) {
    targetExerciseHTML()[0].className = 'exercise-info-container';

    targetExerciseHTML()[0].classList.toggle(
      renderMethods.conditionStyleAdd(
        null,
        isLongJourney,
        renderMethods.addStyleContainer().addGridClass
      )
    );
    targetExerciseHTML()[0].classList.toggle(
      renderMethods.conditionStyleAdd(
        null,
        isLongJourney,
        renderMethods.addStyleContainer().addHeightClass
      )
    );
    targetExerciseHTML()[0].classList.toggle(
      renderMethods.conditionStyleAdd(
        null,
        isLongJourney,
        renderMethods.addStyleContainer().addPaddingClass
      )
    );
  };

  const calcPace = function (targetWorkout) {
    return Math.round(targetWorkout.duration / targetWorkout.distance);
  };

  const calcSpeed = function (targetWorkout) {
    return Math.round(targetWorkout.distance / (targetWorkout.duration / 60));
  };

  //Running first condition
  const exerciseType = document.querySelector(queryName.editRun).checked;

  const { distance, duration, cadence, elevationGain } =
    exerciseSimilarInputs_Value(exerciseType);

  reset_specificEvent_and_dataset();

  for (const itemWorkout of infoData.get_workouts_data()) {
    if (itemWorkout.id === exerciseTargetId) {
      itemWorkout.exerciseType = exerciseType ? 'running' : 'cycling';

      itemWorkout.title =
        itemWorkout.exerciseType[0].toUpperCase() +
        itemWorkout.exerciseType.slice(1);

      itemWorkout.ExerciseDetails = [];

      itemWorkout.distance = distance;
      itemWorkout.duration = duration;
      itemWorkout.cadence_or_elevation = exerciseType ? cadence : elevationGain;
      itemWorkout.pace_or_speed = exerciseType
        ? calcPace(itemWorkout)
        : calcSpeed(itemWorkout);

      itemWorkout.ExerciseDetails.push(
        itemWorkout.distance,
        itemWorkout.duration,
        itemWorkout.pace_or_speed,
        itemWorkout.cadence_or_elevation
      );

      itemWorkout.longJourney =
        renderMethods.checkIsLongJourney(
          itemWorkout.distance,
          itemWorkout.duration,
          itemWorkout.pace_or_speed,
          itemWorkout.cadence_or_elevation
        ) > 0
          ? true
          : false;

      exerciseTitle.textContent = itemWorkout.title;

      exerciseIcon.forEach(
        (item, i) =>
          (item.textContent =
            renderMethods.iconObject()[exerciseType ? 'running' : 'cycling'][i])
      );

      exerciseTextNodes.forEach(
        (item, i) => (item.textContent = itemWorkout.ExerciseDetails[i])
      );

      if (!itemWorkout.longJourney) {
        addStyleExcercise(itemWorkout.longJourney);
        targetExerciseHTML()[1].className = 'fas fa-arrow-down notShowIcon';
        itemWorkout.isDropDown = false;
      } else {
        addStyleExcercise(itemWorkout.longJourney);
        targetExerciseHTML()[1].className =
          'fas fa-arrow-down up togPlusAni click_icon_color showIcon';
        itemWorkout.isDropDown = true;
      }

      targetExerciseHTML()[0].closest(
        queryName.workItself
      ).className = `exercise-container exercise--${itemWorkout.exerciseType}`;

      infoData.reset_specificEvents_data();

      infoData.setLocalStorage();

      break;
    }
  }
};
