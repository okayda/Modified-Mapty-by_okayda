'use strict';

import { app_data } from '../app_data.js';

import { document_selector_name as queryName } from '../query_name.js';

import { timestamp_utilities_method } from './timestamp_share_methods.js';

import { overlays_data } from '../overlays_functionalities.js';

import { reset_input_obj } from '../reset_inputs.js';

import { init_calendar } from './date_picker.js';

import { init_time } from './time_picker.js';

const show_error_timestamp_alert = function (message) {
  overlays_data.overlay_state.timestamp_edit_form_enabled = false;
  overlays_data.overlay_state.error_alert_timestamp_enabled = true;

  document.querySelector(queryName.tidar_container).classList.remove('active');
  document.querySelector(queryName.error_container).classList.add('active');
  document.querySelector(queryName.error_message).textContent = message;
};

const timestampSetText = function (
  target_timestamp,
  box_message,
  exercise_type
) {
  const data = app_data.timestamp_data;

  if (exercise_type) {
    document.querySelector(
      target_timestamp
    ).textContent = `${data.month} \\ ${data.day} \\ ${data.year} | ${data.hour}:${data.minutes} ${data.meridiem}`;
    alert(box_message);

    document.querySelector(target_timestamp).style.width = 'auto';
  }
};

const add_timestamp_data = function () {
  const data = app_data.timestamp_data;
  data.hour = document.querySelector(queryName.timeH).textContent;
  data.minutes = document.querySelector(queryName.timeM).textContent;
  data.meridiem = document.querySelector(queryName.meridiem).textContent;

  if (data.hour == '00')
    return show_error_timestamp_alert(
      'Make sure your hour time is greater than 0'
    );

  //for edit form functionalities
  if (overlays_data.overlay_state.timestamp_edit_form_enabled) {
    timestampSetText(
      queryName.timestamp_edit_run,
      'Running exercise',
      overlays_data.overlay_state.isRunning
    );
    timestampSetText(
      queryName.timestamp_edit_cyc,
      'Cycling exercise',
      overlays_data.overlay_state.isCycling
    );

    overlays_data.reset_exercise_timestamp_type();
    overlays_data.timestamp_remove_for_edit_form();
    // data.create_date();

    return;
  }

  //for set form functionalities
  if (overlays_data.overlay_state.timestamp_set_form_enabled) {
    overlays_data.timestamp_remove_for_set_form();
    document.querySelector(
      queryName.customSched
    ).textContent = `${data.month} / ${data.day} / ${data.year} | ${data.hour} / ${data.minutes} / ${data.meridiem}`;

    // app_data.workouts[target_exercise].timestamp = app_data.timestamp_data;
    // data.reset_date_and_properties();

    return;
  }
};

const reset_timestamp = function () {
  const data = app_data.timestamp_data;

  data.reset_date_and_properties();

  reset_input_obj.timestamp_form();

  // timestamp_utilities_method.setMeridiem();
  const morning_btn = document.querySelector('.morning');
  const afternoon_btn = document.querySelector('.afternoon');
  morning_btn.classList.remove('active');
  afternoon_btn.classList.remove('active');

  document.querySelector(queryName.dateText).textContent =
    timestamp_utilities_method.formatDate(new Date());

  overlays_data.reset_exercise_timestamp_type();

  if (overlays_data.overlay_state.timestamp_set_form_enabled) {
    overlays_data.timestamp_remove_for_set_form();
    return;
  }

  if (overlays_data.overlay_state.timestamp_edit_form_enabled) {
    overlays_data.timestamp_remove_for_edit_form();
    overlays_data.overlay_state.editForm_timestamp_enabled = false;
  }
};

export default function timestamp_init() {
  init_calendar();
  init_time();

  document
    .querySelector('.submit')
    .addEventListener('click', add_timestamp_data);

  document.querySelector('.cancel').addEventListener('click', reset_timestamp);

  document
    .querySelector('.timestamp-remove')
    .addEventListener('click', reset_timestamp);
}
