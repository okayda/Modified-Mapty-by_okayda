'use strict';

import { document_selector_name as queryName } from './query_name.js';

import { alternate_obj } from './alternate.js';

import { nested_alternate_obj } from './nested_alternate.js';

export default function side_bar_init() {
  OpenMenuHandler();
  CloseMenuHandler();

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

  const hiedAllExerciseNested = function () {
    showCheckbox = true;
    showRadioRunning = true;
    showRadioCycling = true;
    displayingAnimation(...nested_alternate_obj.animationProp.exerciseNot);
    displayingAnimation(...nested_alternate_obj.animationProp.runningNot);
    displayingAnimation(...nested_alternate_obj.animationProp.cyclingNot);
  };

  document.querySelector('.nav-items').addEventListener('click', function (e) {
    const dropdownClass = e.target;
    const targetElement = e.target;
    const panel = targetElement.nextElementSibling;

    if (dropdownClass.classList.contains('nav-link-title')) {
      dropdownClass
        .querySelector('.drop-icon')
        .classList.toggle('drop-icon-animation');

      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;

        nested_alternate_obj.hideAllExerciseNested();

        alternate_obj.previousPanel.splice(0, 1);

        alternate_obj.countOpen = 0;

        alternate_obj.previousDrop = [];
      } else {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        alternate_obj.alternateArrow(panel, dropdownClass);
      }
    }
  });

  const exerciseDropdown = document.querySelector(queryName.exerDrop);

  const nestedArrowAnimation = function (e) {
    const target = e.target;
    if (target.classList.contains('nested-link-title'))
      target
        .querySelector(queryName.nestedIcon)
        .classList.toggle('nested-drop-icon-animation');
  };

  const exerciseSelector = queryName.exerciseContainer;
  const runningSelector = queryName.runningContainer;
  const cyclingSelector = queryName.cyclingContainer;

  const exerciseDOM_zIndex = function (val1, val2, val3) {
    document.querySelector(exerciseSelector).style.zIndex = val1;
    document.querySelector(runningSelector).style.zIndex = val2;
    document.querySelector(cyclingSelector).style.zIndex = val3;
  };

  const displayExercise = function () {
    hiedAllExerciseNested();

    if (nested_alternate_obj.showCheckbox) {
      nested_alternate_obj.displayingAnimation(
        ...nested_alternate_obj.animationProp.exerciseShow
      );

      exerciseDOM_zIndex('100', '-1', '-1');

      nested_alternate_obj.showCheckbox = false;

      nested_alternate_obj.hideAlreadyShow(showRadioRunning, 'running');
      nested_alternate_obj.hideAlreadyShow(showRadioCycling, 'cycling');

      nested_alternate_obj.showRadioRunning = true;
      nested_alternate_obj.showRadioCycling = true;
    } else {
      nested_alternate_obj.displayingAnimation(
        ...nested_alternate_obj.animationProp.exerciseNot
      );
      nested_alternate_obj.showCheckbox = true;
    }
  };

  const sortRunning = function () {
    if (nested_alternate_obj.showRadioRunning) {
      hiedAllExerciseNested();

      nested_alternate_obj.displayingAnimation(
        ...nested_alternate_obj.animationProp.runningShow
      );

      exerciseDOM_zIndex('-1', '100', '-1');

      nested_alternate_obj.showRadioRunning = false;

      nested_alternate_obj.hideAlreadyShow(showCheckbox, 'exercise');
      nested_alternate_obj.hideAlreadyShow(showRadioCycling, 'cycling');

      nested_alternate_obj.showCheckbox = true;
      nested_alternate_obj.showRadioCycling = true;
    } else {
      nested_alternate_obj.displayingAnimation(
        ...nested_alternate_obj.animationProp.runningNot
      );
      nested_alternate_obj.showRadioRunning = true;
    }
  };

  const sortCycling = function () {
    if (nested_alternate_obj.showRadioCycling) {
      hiedAllExerciseNested();

      nested_alternate_obj.displayingAnimation(
        ...nested_alternate_obj.animationProp.cyclingShow
      );

      exerciseDOM_zIndex('-1', '-1', '100');

      nested_alternate_obj.showRadioCycling = false;

      nested_alternate_obj.hideAlreadyShow(showRadioRunning, 'running');
      nested_alternate_obj.hideAlreadyShow(showCheckbox, 'exercise');

      nested_alternate_obj.showRadioRunning = true;
      nested_alternate_obj.showCheckbox = true;
    } else {
      nested_alternate_obj.displayingAnimation(
        ...nested_alternate_obj.animationProp.cyclingNot
      );
      nested_alternate_obj.showRadioCycling = true;
    }
  };

  const itContains = (e, targetClassname) =>
    e.target.classList.contains(targetClassname);

  exerciseDropdown.addEventListener('click', function (e) {
    nestedArrowAnimation(e);

    if (itContains(e, 'exercise-btn')) displayExercise();
    else if (itContains(e, 'running-btn')) sortRunning();
    else if (itContains(e, 'cycling-btn')) sortCycling();
  });
}

function OpenMenuHandler() {
  document
    .querySelector(queryName.menuOpen)
    .addEventListener('click', function () {
      document.querySelector(queryName.slideBar).classList.add('active');
      document
        .querySelector(queryName.nestedLinkContainer)
        .classList.add('active');
      document.querySelector(queryName.overlaySide).classList.add('active');
    });
}

function CloseMenuHandler() {
  document
    .querySelector(queryName.menuClose)
    .addEventListener('click', function () {
      document.querySelector(queryName.slideBar).classList.remove('active');
      document
        .querySelector(queryName.nestedLinkContainer)
        .classList.remove('active');
      document.querySelector(queryName.overlaySide).classList.remove('active');
    });
}
