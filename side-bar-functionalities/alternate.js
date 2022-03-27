'use strict';

import { document_selector_name as queryName } from '../query_name.js';

export const alternate_obj = {
  countOpen: 0,
  previousPanel: [],
  previousDrop: [],
  previous_arrow_rotate: [],
  dropdown_previous_arrow_rotate: [],

  dropdown_alternate(panel, targetDom) {
    this.countOpen += 1;

    this.previousPanel.push(panel);

    this.previousDrop.push(targetDom);

    if (this.countOpen === 2) {
      this.previousPanel[0].style.maxHeight = null;

      this.countOpen = 1;

      this.previousPanel.splice(0, 1);

      this.previousDrop.splice(0, 1);
    }
  },

  remove_open_arrow(arrow_container, class_animation) {
    if (this[arrow_container].length === 0) return;

    this[arrow_container][0].classList.remove(class_animation);
    this[arrow_container].splice(0, 1);
  },

  arrow_alternate(obj, target) {
    target.querySelector(obj.parent_markup).classList.add(obj.class_animation);

    if (this[obj.arrow_container].length === 2) {
      const previous = this[obj.arrow_container][0].closest(
        obj.target_markup
      ).textContent;

      const current = this[obj.arrow_container][1].closest(
        obj.target_markup
      ).textContent;

      if (previous === current) {
        target
          .querySelector(obj.parent_markup)
          .classList.remove(obj.class_animation);

        this[obj.arrow_container] = [];
        return;
      }

      this.remove_open_arrow(obj.arrow_container, obj.class_animation);
    }
  },

  dropdown_arrow_alternate(target) {
    this.dropdown_previous_arrow_rotate.push(
      target.querySelector('.drop-icon')
    );

    this.arrow_alternate(
      {
        arrow_container: 'dropdown_previous_arrow_rotate',
        target_markup: '.nav-link-title',
        parent_markup: '.drop-icon',
        class_animation: 'drop-icon-animation',
      },
      target
    );
  },

  nested_arrow_alternate(e) {
    const target = e.target;
    if (target.classList.contains('nested-link-title')) {
      this.previous_arrow_rotate.push(
        target.querySelector(queryName.nestedIcon)
      );

      this.arrow_alternate(
        {
          arrow_container: 'previous_arrow_rotate',
          target_markup: '.nested-link-title',
          parent_markup: '.nested-drop-icon',
          class_animation: 'nested-drop-icon-animation',
        },
        target
      );
    }
  },
};
