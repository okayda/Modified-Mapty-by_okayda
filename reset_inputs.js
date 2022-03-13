'use strict';
import { document_selector_name as queryName } from './query_name.js';

export const reset_input_obj = {
  edit_form() {
    document.querySelector(`.rDistance`).value =
      document.querySelector(`.rDuration`).value =
      document.querySelector(`.cDistance`).value =
      document.querySelector(`.cDuration`).value =
      document.querySelector(queryName.edit_rCadence).value =
        '';

    const stamp_text = `TIMESTAMP
        <img src="side-bar-icons/schedule.png" class="workout-img" alt="" />
     `;

    document.querySelector(queryName.timestamp_edit_run).innerHTML =
      document.querySelector(queryName.timestamp_edit_cyc).innerHTML =
        stamp_text;
  },

  set_form() {},

  timestamp_form() {},
};
