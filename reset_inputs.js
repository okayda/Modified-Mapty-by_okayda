'use strict';
import { document_selector_name as queryName } from './query_name.js';

export const reset_input_obj = {
  edit_form() {
    document.querySelector(`.rDistance`).value =
      document.querySelector(`.rDuration`).value =
      document.querySelector(`.cDistance`).value =
      document.querySelector(`.cDuration`).value =
      document.querySelector(queryName.edit_rCadence).value =
      document.querySelector(queryName.edit_cElevation).value =
        '';

    const stamp_text = `TIMESTAMP
        <img src="side-bar-icons/schedule.png" class="workout-img" alt="" />
     `;

    document.querySelector(queryName.timestamp_edit_run).innerHTML =
      document.querySelector(queryName.timestamp_edit_cyc).innerHTML =
        stamp_text;
  },

  set_form() {},

  timestamp_form() {
    document.querySelector(queryName.timeH).textContent = '00';
    document.querySelector(queryName.timeM).textContent = '00';
    document.querySelector('.meridiem-set').textContent = 'NN';
    document.querySelector('.selected-hours-drop').textContent = 'Select Hours';
    document.querySelector('.selected-minutes-drop').textContent =
      'Select Minutes';
  },
};
