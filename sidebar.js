import { obj as dropAlter } from './alternate.js';
import { obj as dropNested } from './nestedAlternate.js';

export const initSideBar = function () {
  document.querySelector('.menu-btn').addEventListener('click', function () {
    document.querySelector('.side-bar').classList.add('active');

    document.querySelector('.container-nested-option').classList.add('active');

    document.querySelector('.overlay-side-bar').classList.add('active');
  });

  document.querySelector('.close-btn').addEventListener('click', function () {
    document.querySelector('.side-bar').classList.remove('active');

    document
      .querySelector('.container-nested-option')
      .classList.remove('active');

    document.querySelector('.overlay-side-bar').classList.remove('active');
  });

  //   document
  //     .querySelector('.overlay-side-bar')
  //     .addEventListener('click', function () {
  //       document.querySelector('.overlay-side-bar').style.display = 'none';
  //     });

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

  const hideAllExerciseNested = function () {
    showCheckbox = true;
    showRadioRunning = true;
    showRadioCycling = true;
    displayingAnimation(...dropNested.animationProp.exerciseNot);
    displayingAnimation(...dropNested.animationProp.runningNot);
    displayingAnimation(...dropNested.animationProp.cyclingNot);
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

        dropNested.hideAllExerciseNested();

        dropAlter.previousPanel.splice(0, 1);

        dropAlter.countOpen = 0;

        dropAlter.previousDrop = [];
      } else {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        dropAlter.alternateArrow(panel, dropdownClass);
      }
    }
  });

  const exerciseDropdown = document.querySelector('.exercise-dropdown');

  const nestedArrowAnimation = function (e) {
    const target = e.target;
    if (target.classList.contains('nested-link-title'))
      target
        .querySelector('.nested-drop-icon')
        .classList.toggle('nested-drop-icon-animation');
  };

  const exerciseSelector = '.container-row-nav-exercise';
  const runningSelector = '.container-row-nav-running';
  const cyclingSelector = '.container-row-nav-cycling';

  console.log(document.querySelector('.container-row-nav-exercise'));

  const exerciseDOM_zIndex = function (val1, val2, val3) {
    document.querySelector(exerciseSelector).style.zIndex = val1;
    document.querySelector(runningSelector).style.zIndex = val2;
    document.querySelector(cyclingSelector).style.zIndex = val3;
  };

  const displayExercise = function () {
    if (dropNested.showCheckbox) {
      dropNested.displayingAnimation(...dropNested.animationProp.exerciseShow);

      exerciseDOM_zIndex('100', '-1', '-1');

      dropNested.showCheckbox = false;

      dropNested.hideAlreadyShow(showRadioRunning, 'running');
      dropNested.hideAlreadyShow(showRadioCycling, 'cycling');

      dropNested.showRadioRunning = true;
      dropNested.showRadioCycling = true;
    } else {
      dropNested.displayingAnimation(...dropNested.animationProp.exerciseNot);
      dropNested.showCheckbox = true;
    }
  };

  const sortRunning = function () {
    if (dropNested.showRadioRunning) {
      dropNested.displayingAnimation(...dropNested.animationProp.runningShow);

      exerciseDOM_zIndex('-1', '100', '-1');

      dropNested.showRadioRunning = false;

      dropNested.hideAlreadyShow(showCheckbox, 'exercise');
      dropNested.hideAlreadyShow(showRadioCycling, 'cycling');

      dropNested.showCheckbox = true;
      dropNested.showRadioCycling = true;
    } else {
      dropNested.displayingAnimation(...dropNested.animationProp.runningNot);
      dropNested.showRadioRunning = true;
    }
  };

  const sortCycling = function () {
    if (dropNested.showRadioCycling) {
      dropNested.displayingAnimation(...dropNested.animationProp.cyclingShow);

      exerciseDOM_zIndex('-1', '-1', '100');

      dropNested.showRadioCycling = false;

      dropNested.hideAlreadyShow(showRadioRunning, 'running');
      dropNested.hideAlreadyShow(showCheckbox, 'exercise');

      dropNested.showRadioRunning = true;
      dropNested.showCheckbox = true;
    } else {
      dropNested.displayingAnimation(...dropNested.animationProp.cyclingNot);
      dropNested.showRadioCycling = true;
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
};
