import { dataObj as queryName } from './query_name.js';
import { document_obj } from './document_element.js';
import { infoData, CustomData } from '/app.js';

export const objectOverlays = {
  overlay_state: {
    isRunning: false,
    isCycling: false,

    editForm_enabled: false,
    timestamp_enabled: false,
    setForm_enabled: false,
    error_alert_editForm_enabled: false,
    error_alert_setForm_enabled: false,
  },

  show_edit_form() {
    this.overlay_state.editForm_enabled = true;
    document.querySelector(queryName.overlay).classList.add('active');
    document.querySelector(queryName.editForm).classList.add('active');
  },

  reset_exercise_timestamp_type() {
    this.overlay_state.isRunning = false;
    this.overlay_state.isCycling = false;
  },

  previousDisplay() {
    if (!this.overlay_state.setForm_enabled) {
      this.overlay_state.timestamp_enabled = false;
      document.querySelector(queryName.editForm).classList.add('active');
      document
        .querySelector(queryName.tidar_container)
        .classList.remove('active');
      this.overlay_state.editForm_enabled = true;

      setTimeout(function () {
        document.querySelector(queryName.edit_rDistance).focus();
      }, 400);
    } else {
      this.overlay_state.setForm_enabled = false;
      document.querySelector(queryName.overlay).classList.remove('active');
      document
        .querySelector(queryName.tidar_container)
        .classList.remove('active');
    }
  },

  overlays_init() {
    document.querySelector('.overlay').addEventListener(
      'click',
      function () {
        if (this.overlay_state.editForm_enabled) {
          this.overlay_state.editForm_enabled = false;

          document_obj.editForm.removeAttribute('data-id');
          infoData.reset_specificEvents_data();

          document.querySelector(queryName.overlay).classList.remove('active');
          document.querySelector(queryName.editForm).classList.remove('active');
        } else if (this.overlay_state.timestamp_enabled) {
          this.previousDisplay();

          this.reset_exercise_timestamp_type();
        } else if (this.overlay_state.error_alert_setForm_enabled) {
          this.overlay_state.error_alert_setForm_enabled = false;

          document.querySelector(queryName.overlay).classList.remove('active');

          document
            .querySelector(queryName.error_container)
            .classList.remove('active');
        } else if (this.overlay_state.error_alert_editForm_enabled) {
          this.overlay_state.error_alert_editForm_enabled = false;
          this.overlay_state.editForm_enabled = true;

          document
            .querySelector(queryName.error_container)
            .classList.remove('active');

          document.querySelector(queryName.editForm).classList.add('active');
        } else {
          this.overlay_state.setForm_enabled = false;

          document.querySelector(queryName.overlay).classList.remove('active');
          document
            .querySelector(queryName.tidar_container)
            .classList.remove('active');
        }
      }.bind(this)
    );
  },
};
