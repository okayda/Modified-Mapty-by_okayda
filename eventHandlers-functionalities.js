import { document_obj } from './document_element.js';
import { dataObj as queryName } from './query_name.js';
import { objectOverlays } from './overlays-functionalities.js';
import { edit_workout_info_including_data_workout } from './edit_form_functionalities.js';

export default function event_handlers_init() {
  document
    .querySelector(queryName.timestamp_edit_run)
    .addEventListener('click', function () {
      objectOverlays.overlay_state.editForm_enabled = false;
      objectOverlays.overlay_state.timestamp_edit_form_enabled = true;
      objectOverlays.overlay_state.isRunning = true;
      objectOverlays.overlay_state.running_timestamp_enabled = true;

      document
        .querySelector(queryName.editContainer)
        .classList.remove('active');

      document.querySelector(queryName.tidar_container).classList.add('active');
    });

  document
    .querySelector(queryName.timestamp_edit_cyc)
    .addEventListener('click', function () {
      objectOverlays.overlay_state.editForm_enabled = false;
      objectOverlays.overlay_state.timestamp_edit_form_enabled = true;
      objectOverlays.overlay_state.isCycling = true;
      objectOverlays.overlay_state.cycling_timestamp_enabled = true;

      document
        .querySelector(queryName.editContainer)
        .classList.remove('active');

      document.querySelector(queryName.tidar_container).classList.add('active');
    });

  document
    .querySelector(queryName.customSched)
    .addEventListener('click', function () {
      objectOverlays.overlay_state.timestamp_set_form_enabled = true;
      document.querySelector(queryName.overlay).classList.add('active');
      document.querySelector(queryName.tidar_container).classList.add('active');
    });

  document
    .querySelector(queryName.editForm)
    .addEventListener('submit', function (e) {
      e.preventDefault();
      edit_workout_info_including_data_workout();
    });

  document
    .querySelector(queryName.error_Btn)
    .addEventListener('click', function () {
      if (objectOverlays.overlay_state.error_alert_setForm_enabled) {
        objectOverlays.overlay_state.error_alert_setForm_enabled = false;

        document.querySelector(queryName.overlay).classList.remove('active');

        document
          .querySelector(queryName.error_container)
          .classList.remove('active');
      } else {
        objectOverlays.overlay_state.error_alert_editForm_enabled = false;

        objectOverlays.overlay_state.editForm_enabled = true;

        document
          .querySelector(queryName.error_container)
          .classList.remove('active');

        document.querySelector(queryName.editForm).classList.add('active');
      }
    });
}
