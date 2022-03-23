'use strict';

import { document_selector_name as queryName } from '../query_name.js';

const exerciseSelector = queryName.exerciseContainer;
const runningSelector = queryName.runningContainer;
const cyclingSelector = queryName.cyclingContainer;

const exerciseNested = `${exerciseSelector} ${queryName.optionSelector}`;
const runningNested = `${runningSelector}  ${queryName.optionSelector}`;
const cyclingNested = `${cyclingSelector}  ${queryName.optionSelector}`;

export const nested_alternate_obj = {
  showRadioRunning: true,
  showRadioCycling: true,
  showCheckbox: true,

  animationProp: {
    exerciseShow: [exerciseNested, 'none', '1'],
    exerciseNot: [exerciseNested, 'flat', '0'],
    runningShow: [runningNested, 'none', '1'],
    runningNot: [runningNested, 'flat', '0'],
    cyclingShow: [cyclingNested, 'none', '1'],
    cyclingNot: [cyclingNested, 'flat', '0'],
  },

  displayingAnimation(className, transform, opacity) {
    const getList = document.querySelectorAll(className);
    for (let i = 0; i < getList.length; i++)
      getList[i].style.cssText = `
      opacity: ${opacity};
      transform: ${transform};
    `;
  },

  hideAllExerciseNested() {
    this.showCheckbox = true;
    this.showRadioRunning = true;
    this.showRadioCycling = true;

    this.displayingAnimation(...this.animationProp.exerciseNot);
    this.displayingAnimation(...this.animationProp.runningNot);
    this.displayingAnimation(...this.animationProp.cyclingNot);
  },

  hideAlreadyShow(isShow, targetElement) {
    if (!isShow)
      displayingAnimation(
        `.container-row-nav-${targetElement}  .nested-unorder-list > .nested-list`,
        'flat',
        '0'
      );
  },
};
