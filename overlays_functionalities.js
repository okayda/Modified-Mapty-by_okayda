'use strict';

import { app_data } from './app_data.js';

import { document_selector_name as queryName } from './query_name.js';

import { document_element_forms } from './document_element.js';

import { reset_input_obj } from './reset_inputs.js';

const overlays_data = {
  overlay_state: {
    isRunning: false,
    isCycling: false,

    editForm_timestamp_enabled: false,

    setForm_enabled: false,
    editForm_enabled: false,

    timestamp_edit_form_enabled: false,
    timestamp_set_form_enabled: false,

    error_alert_editForm_enabled: false,
    error_alert_setForm_enabled: false,
    error_alert_timestamp_enabled: false,
  },

  edit_form_hide_and_show(state) {
    document.querySelector(queryName.overlay).classList[state]('active');
    document.querySelector(queryName.editForm).classList[state]('active');
  },

  show_edit_form() {
    this.overlay_state.editForm_enabled = true;
    this.edit_form_hide_and_show('add');
  },

  hide_edit_form() {
    this.overlay_state.editForm_enabled = false;
    this.edit_form_hide_and_show('remove');

    app_data.specificEvents[6].classList.remove('active-edit');
    document_element_forms.editForm.removeAttribute('data-id');
    app_data.reset_specificEvents_data();
  },

  reset_exercise_timestamp_type() {
    this.overlay_state.isRunning = false;
    this.overlay_state.isCycling = false;
  },

  timestamp_remove_for_set_form() {
    this.overlay_state.timestamp_set_form_enabled = false;
    document.querySelector(queryName.overlay).classList.remove('active');
    document
      .querySelector(queryName.tidar_container)
      .classList.remove('active');
  },

  timestamp_remove_for_edit_form() {
    this.overlay_state.timestamp_edit_form_enabled = false;
    this.overlay_state.editForm_enabled = true;

    document
      .querySelector(queryName.tidar_container)
      .classList.remove('active');

    document.querySelector(queryName.editForm).classList.add('active');

    setTimeout(function () {
      document.querySelector(queryName.edit_rDistance).focus();
    }, 400);
  },

  set_form_display() {
    this.overlay_state.timestamp_set_form_enabled = false;

    document.querySelector(queryName.overlay).classList.remove('active');
    document
      .querySelector(queryName.tidar_container)
      .classList.remove('active');
  },

  error_set_form_modal_display() {
    this.overlay_state.error_alert_setForm_enabled = false;

    document.querySelector(queryName.overlay).classList.remove('active');

    document
      .querySelector(queryName.error_container)
      .classList.remove('active');
  },

  error_edit_form_modal_display() {
    this.overlay_state.error_alert_editForm_enabled = false;
    this.overlay_state.editForm_enabled = true;

    document
      .querySelector(queryName.error_container)
      .classList.remove('active');

    document.querySelector(queryName.editForm).classList.add('active');
  },

  error_timestamp_modal_display() {
    this.overlay_state.error_alert_timestamp_enabled = false;
    this.overlay_state.timestamp_edit_form_enabled = true;

    document
      .querySelector(queryName.error_container)
      .classList.remove('active');

    document.querySelector(queryName.tidar_container).classList.add('active');
  },
};

const overlay_init = function () {
  document
    .querySelector(queryName.overlay)
    .addEventListener('click', function () {
      if (overlays_data.overlay_state.editForm_enabled) {
        overlays_data.hide_edit_form();
        overlays_data.overlay_state.editForm_timestamp_enabled = false;
        reset_input_obj.edit_form();
        return;
      }

      if (overlays_data.overlay_state.timestamp_edit_form_enabled) {
        overlays_data.reset_exercise_timestamp_type();
        overlays_data.timestamp_remove_for_edit_form();
        app_data.timestamp_data.reset_date_and_properties();
        reset_input_obj.timestamp_form();

        overlays_data.overlay_state.editForm_timestamp_enabled = false;
        return;
      }

      if (overlays_data.overlay_state.timestamp_set_form_enabled) {
        overlays_data.timestamp_remove_for_set_form();
        reset_input_obj.timestamp_form();

        return;
      }

      if (overlays_data.overlay_state.error_alert_setForm_enabled) {
        overlays_data.error_set_form_modal_display();
        return;
      }

      if (overlays_data.overlay_state.error_alert_editForm_enabled) {
        overlays_data.error_edit_form_modal_display();
        return;
      }

      if (overlays_data.overlay_state.error_alert_timestamp_enabled) {
        overlays_data.error_edit_form_modal_display();
        return;
      }

      if (overlays_data.overlay_state.setForm_enabled) {
        overlays_data.set_form_display();
        return;
      }
    });
};

export { overlays_data, overlay_init };
