'use strict';
import { dataObj as queryName } from './query_name.js';
import { document_obj } from './document_element.js';
import { infoData, CustomData } from '/app.js';

import { renderMethods } from '/render_markup.js';
import { objectOverlays } from './overlays-functionalities.js';

const clear_editForm_inputs = function ({
  distance: distance,
  duration: duration,
  cadence_or_elevation: cadence_or_elevation,
  exerciseType: exerciseType,
}) {
  if (distance <= 0)
    document.querySelector(
      queryName[exerciseType ? 'edit_rDistance' : 'edit_cDistance']
    ).value = '';

  if (duration <= 0)
    document.querySelector(
      queryName[exerciseType ? 'edit_rDuration' : 'edit_cDuration']
    ).value = '';

  if (cadence_or_elevation <= 0)
    document.querySelector(
      queryName[exerciseType ? 'edit_rCadence' : 'edit_cElevation']
    ).value = '';
};

const show_error_editForm_altert = function (message) {
  objectOverlays.overlay_state.editForm_enabled = false;
  objectOverlays.overlay_state.error_alert_editForm_enabled = true;

  document.querySelector(queryName.editForm).classList.remove('active');
  document.querySelector(queryName.error_container).classList.add('active');
  document.querySelector(queryName.error_message).textContent = message;
};

const reset_specificEvent_and_dataset = function () {
  document_obj.editForm.removeAttribute('data-id');
  infoData.specificEvents = [];
};

const makeEmptyEditFormInputs = function (str) {
  const distance = document.querySelector(`.${str}Distance`);
  const duration = document.querySelector(`.${str}Duration`);

  let cadence_or_elevation;

  if (str === 'r')
    cadence_or_elevation = document.querySelector(queryName.edit_rCadence);
  else cadence_or_elevation = document.querySelector(queryName.edit_cElevation);

  cadence_or_elevation.value = distance.value = duration.value = '';
};

const exerciseSimilarInputs_Value = function (exerciseType) {
  const str = exerciseType ? 'r' : 'c';
  let cadence, elevationGain;

  const distance = +document.querySelector(`.${str}Distance`).value;
  const duration = +document.querySelector(`.${str}Duration`).value;

  if (exerciseType)
    cadence = +document.querySelector(queryName.edit_rCadence).value;
  else elevationGain = +document.querySelector(queryName.edit_cElevation).value;

  makeEmptyEditFormInputs(str);

  return {
    distance: distance,
    duration: duration,
    cadence: cadence,
    elevationGain: elevationGain,
  };
};

const calcPace = function (targetWorkout) {
  return Math.round(targetWorkout.duration / targetWorkout.distance);
};

const calcSpeed = function (targetWorkout) {
  return Math.round(targetWorkout.distance / (targetWorkout.duration / 60));
};

const allPositive = (...arr) => arr.every(inp => inp > 0);

export const edit_workout_info_including_data_workout = function () {
  //Running first
  // True -> Running
  // False -> Cycling
  const exerciseType = document.querySelector(queryName.editRun).checked;

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

  const [target_workout_container, target_arrow_icon] = targetExerciseHTML();

  const add_style_to_arrow = function (isLongJourney) {
    target_workout_container.className = 'exercise-info-container';

    target_workout_container.classList.add(
      isLongJourney ? 'display-grid' : 'not-display-grid'
    );
  };

  const { distance, duration, cadence, elevationGain } =
    exerciseSimilarInputs_Value(exerciseType);

  const obj_input_val = {
    distance: distance,
    duration: duration,
    exerciseType: exerciseType ? cadence : elevationGain,
  };

  if (
    !allPositive(
      obj_input_val.distance,
      obj_input_val.duration,
      obj_input_val.exerciseType
    )
  ) {
    clear_editForm_inputs(obj_input_val);
    show_error_editForm_altert('Make sure all inputs value is > 0');
    return;
  }

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
        renderMethods.check_is_long_journey(
          itemWorkout.distance,
          itemWorkout.duration,
          itemWorkout.pace_or_speed,
          itemWorkout.cadence_or_elevation
        ) > 0
          ? true
          : false;

      itemWorkout.isDropDown = itemWorkout.longJourney;

      exerciseTitle.textContent = itemWorkout.title;

      exerciseIcon.forEach(
        (item, i) =>
          (item.textContent =
            renderMethods.icon_obj_container()[
              exerciseType ? 'running' : 'cycling'
            ][i])
      );

      exerciseTextNodes.forEach(
        (item, i) => (item.textContent = itemWorkout.ExerciseDetails[i])
      );

      if (itemWorkout.longJourney === false) {
        add_style_to_arrow(itemWorkout.longJourney);
        target_arrow_icon.className =
          'fas fa-arrow-down arrow-rotate-animation not-display-arrow-icon arrow-deactive';
      } else {
        add_style_to_arrow(itemWorkout.longJourney);
        target_arrow_icon.className =
          'fas fa-arrow-down arrow-rotate-animation display-arrow-icon arrow-active';
      }

      target_workout_container.closest(
        queryName.workItself
      ).className = `exercise-container exercise--${itemWorkout.exerciseType}`;

      infoData.reset_specificEvents_data();

      infoData.setLocalStorage();

      break;
    }
  }
};
