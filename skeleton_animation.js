'use strict';

export const activate_skeleton = function (str) {
  document
    .querySelector('.skeleton-animation-dropdown')
    .classList[str]('active');

  document
    .querySelector('.skeleton-animation-not-dropdown')
    .classList[str]('active');
};
