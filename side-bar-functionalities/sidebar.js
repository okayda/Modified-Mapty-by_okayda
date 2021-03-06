'use strict';

import { document_selector_name as queryName } from '../query_name.js';

import { alternate_obj } from './alternate.js';

import { nested_alternate_obj } from './nested_alternate.js';

let showRadioRunning = true;
let showRadioCycling = true;
let showCheckbox = true;

const displayingAnimation = function (className, transform, opacity) {
  const getList = document.querySelectorAll(className);
  for (let i = 0; i < getList.length; i++)
    getList[i].style.cssText = `
          opacity: ${opacity};
          transform: ${transform};
        `;
};

const hide_all_exercise_nested = function () {
  showCheckbox = true;
  showRadioRunning = true;
  showRadioCycling = true;
  displayingAnimation(...nested_alternate_obj.animationProp.exerciseNot);
  displayingAnimation(...nested_alternate_obj.animationProp.runningNot);
  displayingAnimation(...nested_alternate_obj.animationProp.cyclingNot);
};

const exercise_manage_zIndex = function (val1, val2, val3) {
  document.querySelector(queryName.exerciseContainer).style.zIndex = val1;
  document.querySelector(queryName.runningContainer).style.zIndex = val2;
  document.querySelector(queryName.cyclingContainer).style.zIndex = val3;
};

const display_exercise = function () {
  hide_all_exercise_nested();

  if (nested_alternate_obj.showCheckbox) {
    nested_alternate_obj.displayingAnimation(
      ...nested_alternate_obj.animationProp.exerciseShow
    );

    exercise_manage_zIndex('100', '-1', '-1');

    nested_alternate_obj.showCheckbox = false;

    nested_alternate_obj.hideAlreadyShow(showRadioRunning, 'running');
    nested_alternate_obj.hideAlreadyShow(showRadioCycling, 'cycling');

    nested_alternate_obj.showRadioRunning = true;
    nested_alternate_obj.showRadioCycling = true;
    return;
  }

  nested_alternate_obj.displayingAnimation(
    ...nested_alternate_obj.animationProp.exerciseNot
  );
  nested_alternate_obj.showCheckbox = true;
};

const sortRunning = function () {
  if (nested_alternate_obj.showRadioRunning) {
    hide_all_exercise_nested();

    nested_alternate_obj.displayingAnimation(
      ...nested_alternate_obj.animationProp.runningShow
    );

    exercise_manage_zIndex('-1', '100', '-1');

    nested_alternate_obj.showRadioRunning = false;

    nested_alternate_obj.hideAlreadyShow(showCheckbox, 'exercise');
    nested_alternate_obj.hideAlreadyShow(showRadioCycling, 'cycling');

    nested_alternate_obj.showCheckbox = true;
    nested_alternate_obj.showRadioCycling = true;
    return;
  }

  nested_alternate_obj.displayingAnimation(
    ...nested_alternate_obj.animationProp.runningNot
  );
  nested_alternate_obj.showRadioRunning = true;
};

const sortCycling = function () {
  if (nested_alternate_obj.showRadioCycling) {
    hide_all_exercise_nested();

    nested_alternate_obj.displayingAnimation(
      ...nested_alternate_obj.animationProp.cyclingShow
    );

    exercise_manage_zIndex('-1', '-1', '100');

    nested_alternate_obj.showRadioCycling = false;

    nested_alternate_obj.hideAlreadyShow(showRadioRunning, 'running');
    nested_alternate_obj.hideAlreadyShow(showCheckbox, 'exercise');

    nested_alternate_obj.showRadioRunning = true;
    nested_alternate_obj.showCheckbox = true;
    return;
  }

  nested_alternate_obj.displayingAnimation(
    ...nested_alternate_obj.animationProp.cyclingNot
  );
  nested_alternate_obj.showRadioCycling = true;
};

const toggle_side_bar = function (str) {
  document.querySelector(queryName.slideBar).classList[str]('active');
  document
    .querySelector(queryName.nestedLinkContainer)
    .classList[str]('active');
  document.querySelector(queryName.overlaySide).classList[str]('active');
};

const dropdown_side_bar = function (e) {
  const target = e.target;
  const panel = target.nextElementSibling;

  if (target.classList.contains('nav-link-title')) {
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;

      //for hidning nested elements or arrow if it's open
      nested_alternate_obj.hideAllExerciseNested();
      alternate_obj.remove_open_arrow(
        'previous_arrow_rotate',
        'nested-drop-icon-animation'
      );
      // *************************************

      alternate_obj.previousPanel.splice(0, 1);
      alternate_obj.countOpen = 0;
      alternate_obj.previousDrop = [];
    } else {
      panel.style.maxHeight = panel.scrollHeight + 'px';
      alternate_obj.dropdown_alternate(panel, target);
    }

    alternate_obj.dropdown_arrow_alternate(target);
  }
};

const class_contain = (e, targetClass) =>
  e.target.classList.contains(targetClass);

const nested_exercise_list = function (e) {
  alternate_obj.nested_arrow_alternate(e);

  if (class_contain(e, 'exercise-btn')) {
    display_exercise();
    return;
  }

  if (class_contain(e, 'running-btn')) {
    sortRunning();
    return;
  }

  if (class_contain(e, 'cycling-btn')) {
    sortCycling();
    return;
  }
};

const side_bar_handlers_init = function () {
  document
    .querySelector(queryName.menuOpen)
    .addEventListener('click', toggle_side_bar.bind(null, 'add'));

  document
    .querySelector(queryName.menuClose)
    .addEventListener('click', toggle_side_bar.bind(null, 'remove'));

  document
    .querySelector(queryName.overlaySide)
    .addEventListener('click', toggle_side_bar.bind(null, 'remove'));

  document
    .querySelector(queryName.dropdownList)
    .addEventListener('click', dropdown_side_bar);

  document
    .querySelector(queryName.nestedExerciseList)
    .addEventListener('click', nested_exercise_list);
};

export default function side_bar_init() {
  side_bar_handlers_init();
}
