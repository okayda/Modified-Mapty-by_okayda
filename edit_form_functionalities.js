'use strict';
// this import is a main JavaScript file
import { default as App, CustomData } from '/app.js';

import { renderMethods } from '/render_markup.js';

import { dataObj as queryName } from './query_name.js';

const editForm = document.querySelector(queryName.editForm);

const toggleEditForm = function (val, target) {
  if (val === 'block') {
    App.specificEvents.push(
      target.closest(queryName.workItself).dataset.id,
      target.closest(queryName.workItself).querySelectorAll('.text_info'),
      target.closest(queryName.workItself).querySelectorAll('.icon_info')
    );
    editForm.setAttribute(
      'data-id',
      target.closest(queryName.workItself).dataset.id
    );
  }

  if (val === 'none') {
    editForm.removeAttribute('data-id');
    App.specificEvents = [];
  }

  // editForm.style.display = val;

  // setTimeout(function () {
  //   document.querySelector('.rDistance').focus();
  // }, 400);

  // overlay.style.display = val;
};

const exerciseSimilarInputs = function (str) {
  const distance = document.querySelector(`.${str}Distance`).value;
  const duration = document.querySelector(`.${str}Duration`).value;
  return { distance: distance, duration: duration };
};

const editFormInputs = function () {
  const exerciseTargetId = App.specificEvents[0];

  const exerciseTextNodes = App.specificEvents[1];

  const exerciseIcon = AppspecificEvents[2];

  const makeEmptyEditFormInputs = function (str) {
    const distance = document.querySelector(`.${str}Distance`);
    const duration = document.querySelector(`.${str}Duration`);

    distance.value = duration.value = '';
  };

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
  }.bind(App);

  const running = document.querySelector(queryName.editRun).checked;
  // const cycling = document.querySelector(queryName.editCyc).checked;

  const changeWorkoutInfo = function (exerciseType, Obj) {
    const { distance, duration } = exerciseSimilarInputs('r');

    const cadence = document.querySelector(queryName.edit_rCadence).value;

    const elevationGain = document.querySelector(
      queryName.edit_cElevation
    ).value;

    App._toggleEditForm('none');

    for (const itemWorkout of workouts) {
      if (itemWorkout === exerciseTargetId) {
        //Running first condition
        itemWorkout.type = exerciseType ? 'running' : 'cycling';
        itemWorkout.ExerciseDetails = [];

        itemWorkout.distance = distance;
        itemWorkout.duration = duration;
        itemWorkout[exerciseType ? 'cadence' : 'elevationGain'] = exerciseType
          ? cadence
          : elevationGain;

        itemWorkout.ExerciseDetails.push(
          itemWorkout.distance,
          itemWorkout.duration,
          itemWorkout[exerciseType ? 'cadence' : 'elevationGain']
        );

        itemWorkout.longJourney =
          renderMethods.checkIsLongJourney(
            itemWorkout.distance,
            itemWorkout.duration,
            itemWorkout[exerciseType ? 'cadence' : 'elevationGain']
          ) > 0
            ? true
            : false;

        exerciseIcon.forEach(
          // (item, i) => (item.textContent = this._iconObject().running[i])
          (item, i) =>
            (item.textContent =
              renderMethods.iconObject()[exerciseType ? 'running' : 'cycling'][
                i
              ])
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
        ).className = `${queryName.workItself} exercise--${itemWorkout.type}`;

        App.specificEvents = [];

        App._setLocalStorage();

        break;
      }
    }

    if (exerciseType) {
      document.querySelector(queryName.edit_rCadence).value = '';
      makeEmptyEditFormInputs('r');
    } else {
      document.querySelector(queryName.edit_cElevation).value = '';
      makeEmptyEditFormInputs('c');
    }
  };

  changeWorkoutInfo(running);
};

export const testImport = function () {
  console.log(App);
  console.log(CustomData);
};
