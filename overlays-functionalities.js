import { dataObj as queryName } from './query_name.js';
import { document_obj } from './document_element.js';
import { infoData, CustomData } from '/app.js';

export const objectOverlays = {
  overlay_state: {
    isRunning: false,
    isCycling: false,

    setForm_enabled: false,
    editForm_enabled: false,

    timestamp_edit_form_enabled: false,
    timestamp_set_form_enabled: false,

    error_alert_editForm_enabled: false,
    error_alert_setForm_enabled: false,
  },

  display_edit_form(state) {
    document.querySelector(queryName.overlay).classList[state]('active');
    document.querySelector(queryName.editForm).classList[state]('active');
  },

  show_edit_form() {
    this.overlay_state.editForm_enabled = true;
    this.display_edit_form('add');
  },

  hide_edit_form() {
    this.overlay_state.editForm_enabled = false;
    this.display_edit_form('remove');
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

  edit_form_display() {
    this.overlay_state.editForm_enabled = false;

    document_obj.editForm.removeAttribute('data-id');
    infoData.reset_specificEvents_data();

    document.querySelector(queryName.overlay).classList.remove('active');
    document.querySelector(queryName.editForm).classList.remove('active');
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

  overlays_init() {
    document.querySelector(queryName.overlay).addEventListener(
      'click',
      function () {
        if (this.overlay_state.editForm_enabled) {
          this.edit_form_display();
          return;
        }

        if (this.overlay_state.timestamp_edit_form_enabled) {
          this.reset_exercise_timestamp_type();
          this.timestamp_remove_for_edit_form();
          return;
        }

        if (this.overlay_state.timestamp_set_form_enabled) {
          this.timestamp_remove_for_set_form();
          return;
        }

        if (this.overlay_state.error_alert_setForm_enabled) {
          this.error_set_form_modal_display();
          return;
        }

        if (this.overlay_state.error_alert_editForm_enabled) {
          this.error_edit_form_modal_display();
          return;
        }

        if (this.overlay_state.setForm_enabled) {
          this.set_form_display();
          return;
        }
      }.bind(this)
    );
  },
};
