import { dataObj as queryName } from './query_name.js';
import { objectOverlays } from './overlays-functionalities.js';

export default function event_handlers_init() {
  document.querySelector(queryName.customRun).addEventListener(
    'click',
    function () {
      objectOverlays.overlay_state.timestamp_enabled = true;
      document
        .querySelector(queryName.editContainer)
        .classList.remove('active');
      document.querySelector(queryName.tidar_container).classList.add('active');
      objectOverlays.overlay_state.editForm_enabled = false;
      objectOverlays.overlay_state.isRunning = true;
    }.bind(this)
  );

  document.querySelector(queryName.customCyc).addEventListener(
    'click',
    function () {
      overlay.style.display = 'none';
      document.querySelector('.overlay-edit-form').style.display = 'block';
      document.querySelector(queryName.editContainer).style.display = 'none';
      document.querySelector(queryName.tidar_container).style.display = 'block';
      objectOverlays.overlay_state.isCycling = true;
    }.bind(this)
  );

  document.querySelector(queryName.customSched).addEventListener(
    'click',
    function () {
      objectOverlays.overlay_state.setFrom_enabled = true;
      document.querySelector('.overlay').classList.add('active');
      document.querySelector(queryName.tidar_container).classList.add('active');
    }.bind(this)
  );
}
