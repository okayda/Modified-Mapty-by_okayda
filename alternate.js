'use strict';

export const alternate_obj = {
  countOpen: 0,
  previousPanel: [],
  previousDrop: [],

  alternateArrow(panel, targetDom) {
    this.countOpen += 1;

    this.previousPanel.push(panel);

    this.previousDrop.push(targetDom);

    if (this.countOpen === 2) {
      this.previousPanel[0].style.maxHeight = null;

      this.countOpen = 1;

      this.previousPanel.splice(0, 1);

      // this.backArrow(this.previousDrop[0]);

      this.previousDrop.splice(0, 1);
    }
  },
};
