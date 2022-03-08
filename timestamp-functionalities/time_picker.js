'use strict';

import { document_selector_name as queryName } from '../query_name.js';
import { objMethod } from './timestamp_share_methods.js';

export const init_time = function () {
  //   const date = new Date();
  //   const id = (Date.now() + '').slice(-10);

  // UI text Class Name
  const hoursSet = document.querySelector(queryName.timeH);
  const minutesSet = document.querySelector(queryName.timeM);

  // select Class Name
  const hoursClassName = 'select-hours';
  const minutesClassName = 'select-minutes';

  const closeAllSelect = function (element) {
    const arrId = [];

    const selectItems = document.querySelectorAll('.select-items');
    const selected = document.querySelectorAll('.select-selected');

    for (let i = 0; i < selected.length; i++) {
      if (element === selected[i]) {
        arrId.push(i);
      } else {
        selected[i].classList.remove('select-arrow-active');
        selected[i].classList.remove('select-selected-bottom-square');
      }
    }

    for (let i = 0; i < selectItems.length; i++) {
      if (arrId.indexOf(i)) selectItems[i].classList.add('select-hide');
    }
  };

  const optionsFunctionality = function (
    targetSelect,
    selectElement,
    createDiv,
    targetSelectClassName
  ) {
    const createDivOptionList = document.createElement('DIV');
    createDivOptionList.setAttribute('class', 'select-items select-hide');

    for (let j = 1; j < selectElement.length; j++) {
      const createDivOptionItem = document.createElement('DIV');
      createDivOptionItem.innerHTML = selectElement.options[j].innerHTML;

      createDivOptionItem.addEventListener('click', function () {
        const selectedItems =
          this.parentNode.parentNode.getElementsByTagName('select')[0];
        const textElement = this.parentNode.previousSibling;

        for (let k = 0; k < selectedItems.length; k++) {
          if (selectElement[k].innerHTML === this.innerHTML) {
            selectElement.selectedIndex = k;

            textElement.innerHTML = this.innerHTML;

            const timeNumber = this.textContent.split(' ')[0];

            if (targetSelectClassName === hoursClassName)
              hoursSet.textContent = timeNumber;
            else if (timeNumber < 10) minutesSet.textContent = `0${timeNumber}`;
            else minutesSet.textContent = timeNumber;

            const userSelected =
              this.parentNode.getElementsByTagName('same-as-selected');

            for (let d = 0; d < userSelected.length; d++)
              userSelected[d].removeAttribute('class');

            this.setAttribute('class', 'same-as-selected');

            break;
          }
        }
        textElement.click();
      });
      createDivOptionList.appendChild(createDivOptionItem);
    }

    targetSelect[0].appendChild(createDivOptionList);
    createDiv.addEventListener('click', function (e) {
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle('select-hide');
      this.classList.toggle('select-arrow-active');
      this.classList.toggle('select-selected-bottom-square');
    });
  };

  const customTime = function (targetSelect, howManyNum, merediem) {
    const targetSelectClassName = targetSelect[0].className.split(' ')[1];

    const parentSelect = document.querySelector(
      `.${targetSelectClassName} select`
    );

    const firstOptionTitle = document.createElement('option');

    firstOptionTitle.value = 0;
    firstOptionTitle.text = `${
      targetSelectClassName === hoursClassName
        ? 'Select Hours'
        : 'Select Minutes'
    }`;

    parentSelect.appendChild(firstOptionTitle);

    for (let i = howManyNum === 59 ? 0 : 1; i <= howManyNum; i++) {
      const createOptions = document.createElement('option');

      createOptions.value = i;
      createOptions.text = `${i} ${
        targetSelectClassName === hoursClassName ? merediem : 'Minutes'
      }`;

      parentSelect.appendChild(createOptions);
    }

    const selectElement = targetSelect[0].getElementsByTagName('select')[0];

    const createDiv = document.createElement('DIV');
    createDiv.setAttribute(
      'class',
      'select-selected select-selected-bottom-rounded'
    );
    createDiv.innerHTML =
      selectElement.options[selectElement.selectedIndex].innerHTML;

    targetSelect[0].appendChild(createDiv);

    optionsFunctionality(
      targetSelect,
      selectElement,
      createDiv,
      targetSelectClassName
    );
  };

  customTime(
    document.getElementsByClassName(hoursClassName),
    12,
    objMethod.getMeridiem()
  );
  customTime(document.getElementsByClassName(minutesClassName), 59);

  document.addEventListener('click', closeAllSelect);

  objMethod.setMeridiem();

  const changeOptionText = function (meridiem) {
    const selectHours = '.select-hours';
    const selectSelected = '.select-selected';

    document.querySelector(queryName.meridiem).textContent = meridiem;
    const userSelectHours = document.querySelector(selectSelected).textContent;

    const deleteSelect = document.querySelector(`${selectHours} select`);
    deleteSelect.remove();

    const createSelect = document.createElement('select');
    document.querySelector(selectHours).appendChild(createSelect);

    const deleteDiv = document.querySelectorAll(`${selectHours} div`);
    deleteDiv.forEach(item => item.remove());

    customTime(document.getElementsByClassName(hoursClassName), 12, meridiem);

    document.querySelector(selectSelected).textContent = `${
      userSelectHours.split(' ')[0]
    } ${meridiem}`;
  };

  const meridiemSetText = function () {
    const activeMeridiem = 'active-meridiem';

    const btnAM = document.querySelector(queryName.btnBN).classList;
    const btnPM = document.querySelector(queryName.btnAN).classList;

    if (this.textContent === 'AM' && btnPM.contains(activeMeridiem)) {
      btnPM.remove(activeMeridiem);
      btnAM.add(activeMeridiem);
    } else {
      btnAM.remove(activeMeridiem);
      btnPM.add(activeMeridiem);
    }

    changeOptionText(this.textContent);
  };

  document
    .querySelector(queryName.btnBN)
    .addEventListener('click', meridiemSetText);
  document
    .querySelector(queryName.btnAN)
    .addEventListener('click', meridiemSetText);
};
