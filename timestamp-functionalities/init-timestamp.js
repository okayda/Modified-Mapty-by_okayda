'use strict';
import { init_calendar } from './calendar-picker.js';
import { init_time } from './date-picker.js';

import { dataObj as queryName } from '../query_name.js';
import { infoData } from '../app.js';
import { objectOverlays } from '../overlays-functionalities.js';
import { objMethod } from './timestamp-share-methods.js';

const timestampSetText = function (
  target_timestamp,
  box_message,
  exercise_type
) {
  const data = infoData.timestamp_data;

  if (exercise_type) {
    document.querySelector(
      target_timestamp
    ).textContent = `${data.month} \\ ${data.day} \\ ${data.year} | ${data.hour}:${data.minutes} ${data.meridiem}`;
    alert(box_message);

    document.querySelector(target_timestamp).style.width = '60%';
  }
};

const add_timestamp_data = function () {
  const data = infoData.timestamp_data;

  // data.date = document.querySelector(queryName.dateText).textContent;
  data.hour = document.querySelector(queryName.timeH).textContent;
  data.minutes = document.querySelector(queryName.timeM).textContent;
  data.meridiem = document.querySelector(queryName.meridiem).textContent;

  console.log(data.hour);
  console.log(data.minutes);
  console.log(data.meridiem);

  if (data.hour === '00')
    return alert('Make sure your hour time is greater than 0');

  //for edit form functionalities
  if (objectOverlays.overlay_state.timestamp_edit_form_enabled) {
    timestampSetText(
      queryName.timestamp_edit_run,
      'Running exercise',
      objectOverlays.overlay_state.isRunning
    );
    timestampSetText(
      queryName.timestamp_edit_cyc,
      'Cycling exercise',
      objectOverlays.overlay_state.isCycling
    );

    objectOverlays.reset_exercise_timestamp_type();
    objectOverlays.timestamp_remove_for_edit_form();
    // data.create_date();

    return;
  }

  //for set form functionalities
  if (objectOverlays.overlay_state.timestamp_set_form_enabled) {
    objectOverlays.timestamp_remove_for_set_form();
    document.querySelector(
      queryName.customSched
    ).textContent = `${data.month} / ${data.day} / ${data.year} | ${data.hour} / ${data.minutes} / ${data.meridiem}`;

    // infoData.workouts[target_exercise].timestamp = infoData.timestamp_data;
    // data.reset_date_and_properties();

    return;
  }
};

const remove_timestamp_data = function () {
  const data = infoData.timestamp_data;

  data.reset_date_and_properties();

  document.querySelector(queryName.timeH).textContent = '00';
  document.querySelector(queryName.timeM).textContent = '00';

  objMethod.setMeridiem();

  document.querySelector(queryName.dateText).textContent = objMethod.formatDate(
    new Date()
  );

  objectOverlays.reset_exercise_timestamp_type();

  if (objectOverlays.overlay_state.timestamp_set_form_enabled) {
    objectOverlays.timestamp_remove_for_set_form();
    return;
  }

  if (objectOverlays.overlay_state.timestamp_edit_form_enabled) {
    objectOverlays.timestamp_remove_for_edit_form();
    objectOverlays.overlay_state.editForm_timestamp_enabled = false;
  }
};

export const init_timestamp = function () {
  init_calendar();
  init_time();

  document
    .querySelector('.submit')
    .addEventListener('click', add_timestamp_data);
  document
    .querySelector('.cancel')
    .addEventListener('click', remove_timestamp_data);
};
