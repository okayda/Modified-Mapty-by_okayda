import { document_selector_name as queryName } from './query_name.js';
import { overlays_data } from './overlays_functionalities.js';
import { edit_workout_info_including_data_workout } from './edit_form_functionalities.js';
import { app_data } from './app_data.js';

export default function event_handlers_init() {
  document
    .querySelector(queryName.timestamp_edit_run)
    .addEventListener('click', function () {
      overlays_data.overlay_state.editForm_enabled = false;
      overlays_data.overlay_state.timestamp_edit_form_enabled = true;
      overlays_data.overlay_state.isRunning = true;
      overlays_data.overlay_state.editForm_timestamp_enabled = true;

      document
        .querySelector(queryName.editContainer)
        .classList.remove('active');

      document.querySelector(queryName.tidar_container).classList.add('active');
    });

  document
    .querySelector(queryName.timestamp_edit_cyc)
    .addEventListener('click', function () {
      overlays_data.overlay_state.editForm_enabled = false;
      overlays_data.overlay_state.timestamp_edit_form_enabled = true;
      overlays_data.overlay_state.isCycling = true;
      overlays_data.overlay_state.editForm_timestamp_enabled = true;

      document
        .querySelector(queryName.editContainer)
        .classList.remove('active');

      document.querySelector(queryName.tidar_container).classList.add('active');
    });

  document
    .querySelector(queryName.customSched)
    .addEventListener('click', function () {
      overlays_data.overlay_state.timestamp_set_form_enabled = true;
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
      if (overlays_data.overlay_state.error_alert_setForm_enabled) {
        overlays_data.overlay_state.error_alert_setForm_enabled = false;

        document.querySelector(queryName.overlay).classList.remove('active');

        document
          .querySelector(queryName.error_container)
          .classList.remove('active');
      } else {
        overlays_data.overlay_state.error_alert_editForm_enabled = false;

        overlays_data.overlay_state.editForm_enabled = true;

        document
          .querySelector(queryName.error_container)
          .classList.remove('active');

        document.querySelector(queryName.editForm).classList.add('active');
      }
    });

  document.querySelector('#map').addEventListener('click', function (e) {
    const target = e.target;
    if (target.className !== 'remove') return;
    let a;
    const target_id = Number(target.id);
    const target_workout = document.querySelectorAll('.exercise-container');

    app_data.markers.forEach((el, i) => {
      if (el.id == target_id) {
        app_data._remove_marker_and_info_data(el, i);
        app_data.setLocalStorage();

        setInterval(function () {
          target_workout[i].remove();
        }, 600);

        a = i;
        return;
      }
    });

    target_workout[a].classList.add('active-delete');
  });
}
