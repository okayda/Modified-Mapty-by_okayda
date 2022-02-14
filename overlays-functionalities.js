import { dataObj as queryName } from './query_name.js';

export const objectOverlays = {
  overlay_state: {
    isRunning: false,
    isCycling: false,

    editForm_enabled: false,
    timestamp_enabled: false,
    setFrom_enabled: false,
    error_alert_enabled: false,
  },

  edit_form_init() {
    this.editForm_enabled = true;
    document.querySelector('.overlay').classList.add('active');
    document.querySelector('.edit-form').classList.add('active');
  },

  reset_exercise_timestamp_type() {
    this.overlay_state.isRunning = false;
    this.overlay_state.isCycling = false;
  },

  previousDisplay() {
    if (!this.overlay_state.setFrom_enabled) {
      console.log('kaycee');
      this.overlay_state.timestamp_enabled = false;
      document.querySelector('.edit-form').classList.add('active');
      document
        .querySelector(queryName.tidar_container)
        .classList.remove('active');
      this.overlay_state.editForm_enabled = true;

      setTimeout(function () {
        document.querySelector(`.rDistance`).focus();
      }, 400);
    } else {
      this.overlay_state.setFrom_enabled = false;
      document.querySelector('.overlay').classList.remove('active');
      document
        .querySelector(queryName.tidar_container)
        .classList.remove('active');

      console.log('set');
    }
  },

  overlays_init() {
    document.querySelector('.overlay').addEventListener(
      'click',
      function () {
        if (this.overlay_state.editForm_enabled) {
          this.overlay_state.editForm_enabled = false;
          document.querySelector('.overlay').classList.remove('active');
          document.querySelector('.edit-form').classList.remove('active');
        } else if (this.overlay_state.timestamp_enabled) {
          this.previousDisplay();
          this.reset_exercise_timestamp_type();
        } else {
          this.overlay_state.setFrom_enabled = false;
          document.querySelector('.overlay').classList.remove('active');
          document
            .querySelector(queryName.tidar_container)
            .classList.remove('active');
        }
        console.log(this.overlay_state);
      }.bind(this)
    );
  },
};
