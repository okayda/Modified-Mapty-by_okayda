import { document_obj } from './document_element.js';
import { dataObj as queryName } from './query_name.js';
import { objectOverlays } from './overlays-functionalities.js';
import { edit_workout_info_including_data_workout } from './edit_form_functionalities.js';

export default function event_handlers_init() {
  document
    .querySelector(queryName.customRun)
    .addEventListener('click', function () {
      objectOverlays.overlay_state.timestamp_enabled = true;
      document
        .querySelector(queryName.editContainer)
        .classList.remove('active');
      document.querySelector(queryName.tidar_container).classList.add('active');
      objectOverlays.overlay_state.editForm_enabled = false;
      objectOverlays.overlay_state.isRunning = true;
    });

  document
    .querySelector(queryName.customCyc)
    .addEventListener('click', function () {
      overlay.style.display = 'none';
      document.querySelector('.overlay-edit-form').style.display = 'block';
      document.querySelector(queryName.editContainer).style.display = 'none';
      document.querySelector(queryName.tidar_container).style.display = 'block';
      objectOverlays.overlay_state.isCycling = true;
    });

  document
    .querySelector(queryName.customSched)
    .addEventListener('click', function () {
      objectOverlays.overlay_state.setForm_enabled = true;
      document.querySelector('.overlay').classList.add('active');
      document.querySelector(queryName.tidar_container).classList.add('active');
    });

  document
    .querySelector(queryName.editForm)
    .addEventListener('submit', function (e) {
      e.preventDefault();

      edit_workout_info_including_data_workout();
    });

  document
    .querySelector(queryName.errBtn)
    .addEventListener('click', function () {
      if (objectOverlays.overlay_state.error_alert_enabled) {
        objectOverlays.overlay_state.error_alert_enabled = false;
        document.querySelector(queryName.overlay).classList.remove('active');
        document
          .querySelector(queryName.error_container)
          .classList.remove('active');
      }
    });
}
