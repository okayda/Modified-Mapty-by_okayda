'use strict';

import { dataObj as queryName } from './query_name.js';

import { CustomData } from './app.js';

import { objectOverlays } from './overlays-functionalities.js';

export const timestampObj = {
  date: new Date(),
  id: (Date.now() + '').slice(-10),
  clicks: 0,

  getCustomScheduleApp() {
    const selected_date_element = document.querySelector(queryName.dateText);

    const mth_element = document.querySelector(queryName.monthText);

    const days_element = document.querySelector(queryName.daysContainer);

    const next_mth_element = document.querySelector(queryName.monthNextArrow);

    const prev_mth_element = document.querySelector(queryName.monthPrevArrow);

    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();

    let selectedDate = date;
    let selectedDay = day;
    let selectedMonth = month;
    let selectedYear = year;

    mth_element.textContent = `${months[month]} ${year}`;

    selected_date_element.textContent = this.formatDate(date);

    const alterSelected = function (selected, DOM) {
      if (selected === Number(DOM.textContent)) DOM.classList.add('selected');
      else DOM.classList.remove('selected');
    };

    const getDaysMonth = (month, year) => new Date(year, month, 0).getDate();

    const populateDates = function () {
      days_element.innerHTML = '';

      let amount_days = getDaysMonth(month + 1, year);

      for (let i = 0; i < amount_days; i++) {
        let day_element = document.createElement('div');
        day_element.classList.add('day');
        day_element.textContent = i + 1;

        if (
          months[month] === months[date.getMonth()] &&
          year === date.getFullYear() &&
          day_element.textContent < day
        )
          day_element.classList.add('pass-date');

        if (
          selectedDay === i + 1 &&
          selectedYear === year &&
          selectedMonth === month
        ) {
          day_element.classList.add('selected');
        }

        day_element.addEventListener('click', e => {
          const days = days_element.querySelectorAll('.day');

          selectedDate = new Date(year + '-' + (month + 1) + '-' + (i + 1));
          selectedDay = i + 1;
          selectedMonth = month;
          selectedYear = year;

          if (
            months[month] === months[date.getMonth()] &&
            year === date.getFullYear()
          )
            for (let j = day - 1; j < amount_days; j++)
              alterSelected(selectedDay, days[j]);
          else
            for (let j = 0; j < amount_days; j++)
              alterSelected(selectedDay, days[j]);

          selected_date_element.textContent = this.formatDate(selectedDate);
          selected_date_element.dataset.value = selectedDate;
        });

        days_element.appendChild(day_element);
      }
    }.bind(this);

    populateDates();

    const goToNextMonth = function (e) {
      document.querySelector('.prev-mth').classList.remove('notShowArrow');
      ++month;
      if (month > 11) {
        month = 0;
        ++year;
      }
      mth_element.textContent = `${months[month]} ${year}`;
      populateDates();
    };

    const goToPrevMonth = function () {
      --month;
      if (month < 0) {
        month = 11;
        --year;
      }

      mth_element.textContent = `${months[month]} ${year}`;
      populateDates();

      if (
        new Date().getMonth() === month &&
        year === new Date().getFullYear()
      ) {
        document
          .querySelector(queryName.monthPrevArrow)
          .classList.add('notShowArrow');
        return;
      }
    };

    next_mth_element.addEventListener('click', goToNextMonth);

    prev_mth_element.addEventListener('click', goToPrevMonth);

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
              else if (timeNumber < 10)
                minutesSet.textContent = `0${timeNumber}`;
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
      this.getMeridiem()
    );
    customTime(document.getElementsByClassName(minutesClassName), 59);

    document.addEventListener('click', closeAllSelect);

    this.setMeridiem();

    const changeOptionText = function (meridiem) {
      const selectHours = '.select-hours';
      const selectSelected = '.select-selected';

      document.querySelector(queryName.meridiem).textContent = meridiem;
      const userSelectHours =
        document.querySelector(selectSelected).textContent;

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

    const timestampSetText = function (
      target_timestamp,
      box_message,
      exercise_type
    ) {
      if (exercise_type) {
        document.querySelector(
          target_timestamp
        ).textContent = `${CustomData.date} | ${CustomData.hour}:${CustomData.minutes} ${CustomData.meridiem}`;
        alert(box_message);

        document.querySelector(queryName.customRun).style.width = '60%';
      }
    };

    const setData = () => {
      CustomData.date = document.querySelector(queryName.dateText).textContent;
      CustomData.meridiem = document.querySelector(
        queryName.meridiem
      ).textContent;
      CustomData.hour = document.querySelector(queryName.timeH).textContent;
      CustomData.minutes = document.querySelector(queryName.timeM).textContent;

      if (CustomData.hour === '00')
        return alert('Make sure your hour time is greater than 0');

      //for edit form functionalities
      if (objectOverlays.overlay_state.timestamp_edit_form_enabled) {
        timestampSetText(
          queryName.customRun,
          'Running exercise',
          objectOverlays.overlay_state.isRunning
        );
        timestampSetText(
          queryName.customCyc,
          'Cycling exercise',
          objectOverlays.overlay_state.isCycling
        );

        objectOverlays.reset_exercise_timestamp_type();
        objectOverlays.timestamp_remove_for_edit_form();
        return;
      }

      //for set form functionalities
      if (objectOverlays.overlay_state.timestamp_set_form_enabled) {
        objectOverlays.timestamp_remove_for_set_form();

        document.querySelector(
          queryName.customSched
        ).textContent = `${CustomData.date} | ${CustomData.hour}:${CustomData.minutes} ${CustomData.meridiem}`;
        return;
      }
    };

    document.querySelector('.submit').addEventListener('click', setData);

    document.querySelector('.cancel').addEventListener(
      'click',
      function () {
        this.deleteCustomData();

        objectOverlays.reset_exercise_timestamp_type();

        if (objectOverlays.overlay_state.timestamp_set_form_enabled) {
          objectOverlays.timestamp_remove_for_set_form();
          return;
        }

        if (objectOverlays.overlay_state.timestamp_edit_form_enabled) {
          objectOverlays.timestamp_remove_for_edit_form();
          return;
        }
      }.bind(this)
    );
  },

  //Timestamp for set exercise form
  getCustomSchedule() {
    this.getCustomScheduleApp();
  },

  getMeridiem() {
    const time = new Date();
    return time
      .toLocaleString('en-US', { hour: 'numeric', hour12: true })
      .split(' ')[1];
  },

  setMeridiem() {
    document.querySelector(queryName.meridiem).textContent = this.getMeridiem();
    document
      .querySelector(`.btn-${this.getMeridiem()}`)
      .classList.add('active-meridiem');
  },

  formatDate(d) {
    let day = d.getDate();

    if (day < 10) day = '0' + day;

    let month = d.getMonth() + 1;
    if (month < 10) month = '0' + month;
    1;

    let year = d.getFullYear();

    return `${month} / ${day} / ${year}`;
  },

  deleteCustomData() {
    Object.keys(CustomData).forEach(key => delete CustomData[key]);

    document.querySelector(queryName.timeH).textContent = '00';
    document.querySelector(queryName.timeM).textContent = '00';

    this.setMeridiem();

    document.querySelector(queryName.dateText).textContent = this.formatDate(
      this.date
    );
  },

  getCustomData() {
    console.log(CustomData);
  },
};
