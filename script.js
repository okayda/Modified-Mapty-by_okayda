'use strict';

import { initSideBar } from './sidebar.js';

import { dataObj as queryName } from './query_name.js';

console.log(queryName);

const userSelectedDate = {
  selectedDOM: null,
};

let manualSearchEnabled = false;

let CustomData = {};
let isEditForm = false;

let isRunning = false;
let isCycling = false;

const form = document.querySelector(queryName.form);
const containerWorkouts = document.querySelector(queryName.workouts);
const inputType = document.querySelector(queryName.inputType);
const inputDistance = document.querySelector(queryName.inputDistance);
const inputDuration = document.querySelector(queryName.inputDuration);
const inputCadence = document.querySelector(queryName.inputCadence);
const inputElevation = document.querySelector(queryName.inputElevation);

const editForm = document.querySelector(queryName.editForm);
const overlay = document.querySelector(queryName.overlay);

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10);
  clicks = 0;

  constructor(coords, distance, duration, longJourney, isDropDown) {
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
    this.longJourney = longJourney;
    this.isDropDown = isDropDown;
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December'];

    const weekDays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    // below, this is the title of each market in the leaflep map.

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;

    this.exerciseType = `${this.type[0].toUpperCase()}${this.type.slice(1)}`;

    this.month = `${this.date.getMonth() + 1}`;

    // this.dayName = `${weekDays[this.date.getDay()]}`;
    this.year = `${this.date.getFullYear()}`;

    this.dayNumber = `${this.date.getDate()}`;

    this.hours = `${this.date.getHours()}`;

    this.minutes = `${this.date.getMinutes()}`;
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence, longJourney, isDropDown) {
    super(coords, distance, duration, longJourney, isDropDown);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
    this.getExerciseDetails();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
  }

  getExerciseDetails() {
    this.ExerciseDetails = [this.distance, this.duration, this.cadence];
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(
    coords,
    distance,
    duration,
    elevationGain,
    longJourney,
    isDropDown
  ) {
    super(coords, distance, duration, longJourney, isDropDown);
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this._setDescription();
    this.getExerciseDetails();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
  }

  getExerciseDetails() {
    this.ExerciseDetails = [this.distance, this.duration, this.elevationGain];
  }
}

class App {
  date = new Date();

  #map;
  #mapEvent;
  #mapZoomLevel = 13;
  #workouts = [];
  #specificEvents = [];

  constructor() {
    this._getPosition();

    initSideBar();

    // here Custom Schedule Form
    this._getCustomSchedule();

    this._getLocalStorage();

    form.addEventListener('submit', this._newWorkout.bind(this));

    // this._searchAutoAnimation();

    // this._filterSearch();

    // temporary comment below
    // this._searchAnimation();

    this._eventDelegationIcons();

    inputType.addEventListener('change', this._toggleElevationField);
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your location');
        }
      );
  }

  _errorAlert(msg) {
    const popupBox = document.querySelector(queryName.errOverlay);
    const errorMessage = document.querySelector(queryName.errMessage);
    const okBtn = document.querySelector(queryName.errBtn);

    errorMessage.textContent = msg;

    popupBox.classList.add('active');

    okBtn.addEventListener('click', () => {
      popupBox.classList.remove('active');
    });
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  _offForm() {
    overlay.style.display = 'none';
    document.querySelector(queryName.tidar_container).style.display = 'none';
  }

  _getMeridiem() {
    const time = new Date();
    return time
      .toLocaleString('en-US', { hour: 'numeric', hour12: true })
      .split(' ')[1];
  }

  _setMeridiem() {
    document.querySelector(queryName.meridiem).textContent =
      this._getMeridiem();
    document
      .querySelector(`.btn-${this._getMeridiem()}`)
      .classList.add('active-meridiem');
  }

  _formatDate = function (d) {
    let day = d.getDate();

    if (day < 10) day = '0' + day;

    let month = d.getMonth() + 1;
    if (month < 10) month = '0' + month;

    let year = d.getFullYear();

    return `${month} / ${day} / ${year}`;
  };

  _deleteCustomData() {
    CustomData = {};

    document.querySelector(queryName.timeH).textContent = '00';
    document.querySelector(queryName.timeM).textContent = '00';

    this._setMeridiem();

    document.querySelector(queryName.dateText).textContent = this._formatDate(
      this.date
    );

    this._offForm();
  }

  _offDisplaySchedule(s) {
    document.querySelector(queryName.editOverlay).style.display = 'none';
    overlay.style.display = 'block';

    document.querySelector(queryName.editContainer).style.display = 'block';

    setTimeout(function () {
      document.querySelector(`.${s}Distance`).focus();
    }, 400);
  }

  _getCustomScheduleApp() {
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

    selected_date_element.textContent = this._formatDate(date);

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

          selected_date_element.textContent = this._formatDate(selectedDate);
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
      this._getMeridiem()
    );
    customTime(document.getElementsByClassName(minutesClassName), 59);

    document.addEventListener('click', closeAllSelect);

    this._setMeridiem();

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

    const setData = () => {
      CustomData.date = document.querySelector(queryName.dateText).textContent;
      CustomData.meridiem = document.querySelector(
        queryName.meridiem
      ).textContent;
      CustomData.hour = document.querySelector(queryName.timeH).textContent;
      CustomData.minutes = document.querySelector(queryName.timeM).textContent;

      if (CustomData.hour === '00')
        return alert('Make sure your hour time is greater than 0');

      if (isEditForm) {
        if (isRunning) {
          document.querySelector(
            queryName.customRun
          ).textContent = `${CustomData.date} -- ${CustomData.hour}:${CustomData.minutes} ${CustomData.meridiem}`;
          alert('Running exercise');
        }

        if (isCycling) {
          document.querySelector(
            '.custom-schedule-cycling'
          ).textContent = `${CustomData.date} -- ${CustomData.hour}:${CustomData.minutes} ${CustomData.meridiem}`;
          alert('Cycling exercise');
        }

        document.querySelector('.timestamp-container').style.display = 'none';

        this._offDisplaySchedule('r');

        isEditForm = false;
        isRunning = false;
        isCycling = false;
      } else {
        document.querySelector(
          '.custom__schedule'
        ).textContent = `${CustomData.date} -- ${CustomData.hour}:${CustomData.minutes} ${CustomData.meridiem}`;
        this._offForm();
      }
    };

    document.querySelector('.submit').addEventListener('click', setData);

    document.querySelector('.cancel').addEventListener(
      'click',
      function () {
        this._deleteCustomData();

        this._offForm();

        if (isEditForm) {
          this._offDisplaySchedule('r');
          isEditForm = false;
          isRunning = false;
          isCycling = false;
        }
        console.log(CustomData);
      }.bind(this)
    );
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  _displayCustomSchedule() {
    overlay.style.display = 'block';
    document.querySelector(queryName.tidar_container).style.display = 'block';
  }

  _getCustomSchedule() {
    this._getCustomScheduleApp();

    document.querySelector(queryName.customSched).addEventListener(
      'click',
      function () {
        this._displayCustomSchedule();
      }.bind(this)
    );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    const coords = [latitude, longitude];
    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    //   maxZoom: 20,
    //   subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    // }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));

    this.#workouts.forEach(work => this._renderWorkoutMarker(work));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    inputDistance.value =
      inputCadence.value =
      inputDuration.value =
      inputElevation.value =
        '';

    form.style.display = 'none';
    form.classList.add('hidden');

    setTimeout(() => (form.style.display = 'grid'), 1000);
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    const type = inputType.value;
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;

    const validInputs = (...inputs) =>
      inputs.every(inp => Number.isFinite(inp));

    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    const clearErrorInput = function (otherInput, initial) {
      document.querySelector(queryName.inputFormDistance).blur();
      document.querySelector(queryName.inputDuration).blur();
      document.querySelector(queryName.inputFormCadence).blur();

      if (!Number.isFinite(distance) || distance <= 0)
        document.querySelector(queryName.inputFormDistance).value = '';

      if (!Number.isFinite(duration) || duration <= 0)
        document.querySelector(queryName.inputDuration).value = '';

      if (!Number.isFinite(otherInput) || otherInput <= 0)
        document.querySelector(`.form__input--${initial}`).value = '';
    };

    e.preventDefault();

    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    if (type === 'running') {
      const cadence = +inputCadence.value;

      if (
        !validInputs(distance, duration, cadence) ||
        !allPositive(distance, duration, cadence)
      ) {
        clearErrorInput(cadence, 'cadence');
        return this._errorAlert('Inputs have to be positive numbers!');
      }

      workout = new Running(
        [lat, lng],
        distance,
        duration,
        cadence,
        this._checkIsLongJourney(distance, duration, cadence) > 0 ? true : false
      );
    }

    if (type === 'cycling') {
      const elevation = +inputElevation.value;
      console.log('cycling');
      if (
        !validInputs(distance, duration, elevation) ||
        !allPositive(distance, duration, elevation)
      ) {
        clearErrorInput(elevation, 'elevation');
        return this._errorAlert('Inputs have to be positive numbers!');
      }

      workout = new Cycling(
        [lat, lng],
        distance,
        duration,
        elevation,
        this._checkIsLongJourney(distance, duration, elevation) > 0
          ? true
          : false
      );
    }

    this.#workouts.push(workout);

    this._renderWorkoutMarker(workout);

    this._renderWorkout(workout);

    // this._searchAutoAnimation();

    this._hideForm();

    this._setLocalStorage();
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚲'} ${workout.description}`
      )
      .openPopup();
  }

  _addStyleContainer() {
    return {
      // array order inside really matter
      addGridClass: [
        'isDropDownGridTrue',
        'isDropDownGridFalse',
        'longJourneyGridTrue',
        'isDropDownGridFalse',
      ],
      addHeightClass: [
        'isDropDownHeightTrue',
        'isDropDownHeightFalse',
        'longJourneyHeightTrue',
        'longJourneyHeightFalse',
      ],
      addPaddingClass: [
        'isDropDownPaddingTrue',
        'isDropDownPaddingFalse',
        'longJourneyPaddingTrue',
        'longJourneyPaddingFalse',
      ],
    };
  }

  _conditionStyleAdd(isDropDown, isLongJourney, styleAdd) {
    let returnStyle;
    switch (true) {
      case isDropDown:
        returnStyle = styleAdd[0];
        break;
      case isDropDown === false:
        returnStyle = styleAdd[1];
        break;
      case isLongJourney:
        returnStyle = styleAdd[2];
        break;
      default:
        returnStyle = styleAdd[3];
    }
    return returnStyle;
  }

  _displayArrow = isLongJourney => (isLongJourney ? 'showIcon' : 'notShowIcon');

  _specificArrowRotation(isDropDown, isLongJourney) {
    let returnVal;

    switch (true) {
      case isDropDown === null && isLongJourney:
        returnVal = 'togPlusAni click_icon_color';
        break;
      case isDropDown:
        returnVal = 'togPlusAni click_icon_color';
        break;
      default:
        returnVal = 'togPlusAni togPlus arrowDefaultColor';
    }
    return returnVal;
  }

  _ellipsisIsDropdown(isDropDown, isLongJourney, exerciseText) {
    if (!isLongJourney || isDropDown === null) return exerciseText;

    return isDropDown
      ? exerciseText
      : exerciseText.toString().slice(0, 1) + '...';
  }

  _iconObject() {
    // Array orders really matter
    return {
      running: ['🏃‍♂️', '🦶🏼'],
      cycling: ['🚲', '⛰'],
    };
  }
  _renderWorkout(workout, isDropDown = null) {
    if (Object.keys(CustomData).length > 0) {
      const scheduleArr = CustomData.date.replace(/ /g, '').split('/');
      workout.month = scheduleArr[0];
      workout.dayNumber = scheduleArr[1];
      workout.year = scheduleArr[2];
    }

    let html = `
        <div class="exercise-container exercise--${workout.type}" data-id="${
      workout.id
    }">
                    <h2 class="workout__title">
                    ${workout.exerciseType}
                        <div class="icon_container">
                            <span class="arrow_up "><i class="fas fa-arrow-down up ${this._displayArrow(
                              workout.longJourney
                            )} ${this._specificArrowRotation(
      isDropDown,
      workout.longJourney
    )}"></i></span>
                            <span class="tarmap"><i class="fas fa-map-marker-alt"></i></span>
                            <span class="edit"><i class="far fa-edit"></i></span>
                            <span class="exe"><i class="fas fa-times delete-workout"></i></span>
                        </div>
                    </h2>   

    <div class="exercise-info-container ${
      this._conditionStyleAdd(
        isDropDown,
        workout.longJourney,
        this._addStyleContainer().addGridClass
      ) +
      ' ' +
      this._conditionStyleAdd(
        isDropDown,
        workout.longJourney,
        this._addStyleContainer().addHeightClass
      ) +
      ' ' +
      this._conditionStyleAdd(
        isDropDown,
        workout.longJourney,
        this._addStyleContainer().addPaddingClass
      )
    }">
                    
                        <div class="workout__details">
                            <span class="workout__icon icon_info">${
                              workout.type === 'running' ? '🏃‍♂️' : '🚲'
                            }</span>
                            <span class="workout__value text_info">${this._ellipsisIsDropdown(
                              isDropDown,
                              workout.longJourney,
                              workout.distance
                            )}</span>
                            <span class="workout__unit">km</span>
                        </div>
                        <div class="workout__details">
                            <span class="workout__icon">⏱</span>
                            <span class="workout__value text_info">${this._ellipsisIsDropdown(
                              isDropDown,
                              workout.longJourney,
                              workout.duration
                            )}</span>
                            <span class="workout__unit">min</span>
                        </div>
        `;

    if (workout.type === 'running')
      html += `
        <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">test</span>
            <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
            <span class="workout__icon icon_info">🦶🏼</span>
            <span class="workout__value text_info">${this._ellipsisIsDropdown(
              isDropDown,
              workout.longJourney,
              workout.cadence
            )}</span>
            <span class="workout__unit">spm</span>
            
        </div>

     </div>             
        
     <p class="timestamp-workout-container">
            <span class="timestamp-workout-text">
     ${workout.month} \\ ${workout.dayNumber} \\ ${workout.year}
      </span>
      <span class="time">12:00 PM</span>
      </p>
    `;
    // running
    // <span class="workout__value">${workout.pace.toFixed(1)}</span>

    // cycling
    // <span class="workout__value">${workout.speed.toFixed(1)}</span>

    if (workout.type === 'cycling')
      html += `
        <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">test</span>
            <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
            <span class="workout__icon icon_info">⛰</span>
            <span class="workout__value text_info">${this._ellipsisIsDropdown(
              isDropDown,
              workout.longJourney,
              workout.elevationGain
            )}</span>
            <span class="workout__unit">m</span>
        </div>

     </div>

     <p class="timestamp-workout-container">
     <span class="timestamp-workout-text">
${workout.month} \\ ${workout.dayNumber} \\ ${workout.year}
</span>
<span class="time">12:00 PM</span>
</p>
    `;
    containerWorkouts.insertAdjacentHTML('afterbegin', html);

    this._deleteCustomData();
  }
  _moveToPopUp(target) {
    const targetExerciseId = target.closest(queryName.workItself);

    if (!targetExerciseId) return;

    const workout = this.#workouts.find(
      work => work.id === targetExerciseId.dataset.id
    );

    this.#map.setView(workout.coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));

    if (!data) return;

    this.#workouts = data;

    this.#workouts.forEach(work => this._renderWorkout(work, work.isDropDown));
  }

  _burgerMenu() {
    document
      .querySelector(queryName.burgerIcon)
      .addEventListener('click', function () {
        console.log('Hello World');
      });
  }

  _searchAnimation() {
    document
      .getElementById(queryName.searchInput)
      .addEventListener('click', function () {
        if (manualSearchEnabled === false) {
          document.querySelector(queryName.searchContainer).style.width =
            '100%';
          manualSearchEnabled = true;
          return;
        }

        document.querySelector(queryName.searchContainer).style.width = '100px';
        manualSearchEnabled = false;
      });
  }

  _searchAutoAnimation() {
    if (manualSearchEnabled) return;

    if (this.#workouts.length >= 3)
      document.querySelector(queryName.searchContainer).style.width = '100%';
    else
      document.querySelector(queryName.searchContainer).style.width = '100px';
  }

  _filterSearch() {
    document.querySelector('.search_bar').addEventListener(
      'keyup',
      function () {
        let listExercise, iterationListTitle, searchValue;

        searchValue = document.querySelector('.search_bar').value;

        for (const [i, item] of this.#workouts.entries()) {
          listExercise = document.querySelectorAll(queryName.workItself);
          iterationListTitle = listExercise[i]
            .querySelector('.workout__title')
            .textContent.trim();

          listExercise[i].style.display =
            iterationListTitle.indexOf(searchValue) > -1 ? '' : 'none';
        }
      }.bind(this)
    );
  }

  _switchAlternate(docFor, isDisable, str) {
    document.querySelector(docFor).disabled = isDisable;
    document.querySelector(docFor).placeholder = str;
  }

  // toggle custom time here deleted
  _checkIsLongJourney = function (...num) {
    return num.filter(num => num > 9999).length;
  };

  _alternateArrow(target, targetName) {
    const checkHaveEllips = function (value) {
      return value.filter(val => val.textContent.slice(1, 4) === '...').length;
    };

    const targetExerciseAddStyle = function (isDropDown) {
      const targetExercise = target
        .closest(queryName.workItself)
        .querySelector(queryName.workInfo);

      targetExercise.className = 'exercise-info-container';
      targetExercise.classList.toggle(
        this._conditionStyleAdd(
          isDropDown,
          null,
          this._addStyleContainer().addGridClass
        )
      );
      targetExercise.classList.toggle(
        this._conditionStyleAdd(
          isDropDown,
          null,
          this._addStyleContainer().addHeightClass
        )
      );
      targetExercise.classList.toggle(
        this._conditionStyleAdd(
          isDropDown,
          null,
          this._addStyleContainer().addPaddingClass
        )
      );
    }.bind(this);

    if (targetName === 'fa-arrow-down') {
      target.classList.add('togPlusAni');
      target.classList.toggle('togPlus');
      target.classList.toggle('click_icon_color');

      const exerciseTextNodes = target
        .closest(queryName.workItself)
        .querySelectorAll('.text_info');
      const exerciseTargetId = target.closest(queryName.workItself).dataset.id;

      this.#workouts.forEach(eachExercise => {
        if (eachExercise.id === exerciseTargetId) {
          if (checkHaveEllips(Array.from(exerciseTextNodes)) === 0) {
            exerciseTextNodes.forEach(
              item => (item.textContent = item.textContent.slice(0, 1) + '...')
            );

            eachExercise.isDropDown = false;

            this._setLocalStorage();

            targetExerciseAddStyle(eachExercise.isDropDown);

            return;
          }

          exerciseTextNodes.forEach(
            (item, i) => (item.textContent = eachExercise.ExerciseDetails[i])
          );

          eachExercise.isDropDown = true;

          this._setLocalStorage();

          targetExerciseAddStyle(eachExercise.isDropDown);

          return;
        }
      });
    }
  }

  _toggleEditForm(val, target) {
    if (val === 'block') {
      this.#specificEvents.push(
        target.closest(queryName.workItself).dataset.id,
        target.closest(queryName.workItself).querySelectorAll('.text_info'),
        target.closest(queryName.workItself).querySelectorAll('.icon_info')
      );
      editForm.setAttribute(
        'data-id',
        target.closest(queryName.workItself).dataset.id
      );
    }

    if (val === 'none') {
      editForm.removeAttribute('data-id');
      this.#specificEvents = [];
    }

    editForm.style.display = val;

    setTimeout(function () {
      document.querySelector('.rDistance').focus();
    }, 400);

    overlay.style.display = val;
  }

  _exerciseSimilarInputs(str) {
    const distance = document.querySelector(`.${str}Distance`).value;
    const duration = document.querySelector(`.${str}Duration`).value;
    return { distance: distance, duration: duration };
  }

  _editFormInputs() {
    const exerciseTargetId = this.#specificEvents[0];

    const exerciseTextNodes = this.#specificEvents[1];

    const exerciseIcon = this.#specificEvents[2];

    const makeEmptyEditFormInputs = function (str) {
      const distance = document.querySelector(`.${str}Distance`);
      const duration = document.querySelector(`.${str}Duration`);

      distance.value = duration.value = '';
    };

    const targetExerciseHTML = function () {
      let getDOMArr = [];
      document.querySelectorAll(queryName.workItself).forEach(exercise => {
        if (exercise.dataset.id === exerciseTargetId)
          getDOMArr.push(
            exercise.querySelector(queryName.workInfo),
            exercise.querySelector('.fa-arrow-down')
          );
      });

      return getDOMArr;
    };

    const addStyleExcercise = function (isLongJourney) {
      targetExerciseHTML()[0].className = 'exercise-info-container';

      targetExerciseHTML()[0].classList.toggle(
        this._conditionStyleAdd(
          null,
          isLongJourney,
          this._addStyleContainer().addGridClass
        )
      );
      targetExerciseHTML()[0].classList.toggle(
        this._conditionStyleAdd(
          null,
          isLongJourney,
          this._addStyleContainer().addHeightClass
        )
      );
      targetExerciseHTML()[0].classList.toggle(
        this._conditionStyleAdd(
          null,
          isLongJourney,
          this._addStyleContainer().addPaddingClass
        )
      );
    }.bind(this);

    const running = document.querySelector(queryName.editRun).checked;
    const cycling = document.querySelector(queryName.editCyc).checked;

    if (running === true) {
      const { distance, duration } = this._exerciseSimilarInputs('r');
      const cadence = document.querySelector(queryName.edit_rCadence).value;
      this._toggleEditForm('none');

      for (const itemWorkout of this.#workouts) {
        if (itemWorkout.id === exerciseTargetId) {
          itemWorkout.type = 'running';

          itemWorkout.ExerciseDetails = [];

          itemWorkout.distance = distance;
          itemWorkout.duration = duration;
          itemWorkout.cadence = cadence;

          itemWorkout.ExerciseDetails.push(
            itemWorkout.distance,
            itemWorkout.duration,
            itemWorkout.cadence
          );

          itemWorkout.longJourney =
            this._checkIsLongJourney(
              itemWorkout.distance,
              itemWorkout.duration,
              itemWorkout.cadence
            ) > 0
              ? true
              : false;

          exerciseIcon.forEach(
            (item, i) => (item.textContent = this._iconObject().running[i])
          );

          exerciseTextNodes.forEach(
            (item, i) => (item.textContent = itemWorkout.ExerciseDetails[i])
          );

          if (!itemWorkout.longJourney) {
            addStyleExcercise(itemWorkout.longJourney);
            targetExerciseHTML()[1].className = 'fas fa-arrow-down notShowIcon';
            itemWorkout.isDropDown = false;
          } else {
            addStyleExcercise(itemWorkout.longJourney);
            targetExerciseHTML()[1].className =
              'fas fa-arrow-down up togPlusAni click_icon_color showIcon';
            itemWorkout.isDropDown = true;
          }

          targetExerciseHTML()[0].closest(
            queryName.workItself
          ).className = `${queryName.workItself} exercise--${itemWorkout.type}`;

          this.#specificEvents = [];

          this._setLocalStorage();

          break;
        }
      }
      document.querySelector(queryName.edit_rCadence).value = '';
      makeEmptyEditFormInputs('r');
    }

    if (cycling === true) {
      const { distance, duration } = this._exerciseSimilarInputs('c');
      const elevationGain = document.querySelector(
        queryName.edit_cElevation
      ).value;
      this._toggleEditForm('none');

      for (const itemWorkout of this.#workouts) {
        if (itemWorkout.id === exerciseTargetId) {
          itemWorkout.type = 'cycling';

          itemWorkout.ExerciseDetails = [];

          itemWorkout.distance = distance;
          itemWorkout.duration = duration;
          itemWorkout.elevationGain = elevationGain;

          itemWorkout.ExerciseDetails.push(
            itemWorkout.distance,
            itemWorkout.duration,
            itemWorkout.elevationGain
          );

          itemWorkout.longJourney =
            this._checkIsLongJourney(
              itemWorkout.distance,
              itemWorkout.duration,
              itemWorkout.elevationGain
            ) > 0
              ? true
              : false;

          exerciseIcon.forEach(
            (item, i) => (item.textContent = this._iconObject().cycling[i])
          );

          exerciseTextNodes.forEach(
            (item, i) => (item.textContent = itemWorkout.ExerciseDetails[i])
          );

          if (!itemWorkout.longJourney) {
            addStyleExcercise(itemWorkout.longJourney);
            targetExerciseHTML()[1].className = 'fas fa-arrow-down notShowIcon';
            itemWorkout.isDropDown = false;
          } else {
            addStyleExcercise(itemWorkout.longJourney);
            targetExerciseHTML()[1].className =
              'fas fa-arrow-down up togPlusAni click_icon_color showIcon';
            itemWorkout.isDropDown = true;
          }

          targetExerciseHTML()[0].closest(
            queryName.workItself
          ).className = `${queryName.workItself} exercise--${itemWorkout.type}`;

          this.#specificEvents = [];

          this._setLocalStorage();

          break;
        }
      }

      document.querySelector(queryName.edit_cElevation).value = '';
      makeEmptyEditFormInputs('c');
    }
  }

  _editForm(target, targetName) {
    if (target.className === 'overlay') {
      this._toggleEditForm('none');
      document.querySelector(queryName.tidar_container).style.display = 'none';
    }

    if (targetName === 'fa-edit') {
      this._toggleEditForm('block', target);
    }
  }

  _gotoMapmarker(target, targetName) {
    if (targetName === 'fa-map-marker-alt') {
      this._moveToPopUp(target);
      target.classList.toggle('click_icon_color');
    }
  }

  _removeErrorAlert(target) {
    if (target.className.split(' ')[0] === 'error-overlay')
      document.querySelector('.error-overlay').classList.remove('active');
  }

  _initIconsFunc(e) {
    const target = e.target;
    const targetName = target.className.split(' ')[1];

    this._removeErrorAlert(target);
    this._alternateArrow(target, targetName);
    this._editForm(target, targetName);
    this._gotoMapmarker(target, targetName);
  }

  _eventDelegationIcons() {
    document
      .querySelector('body')
      .addEventListener('click', this._initIconsFunc.bind(this));

    editForm.addEventListener(
      'submit',
      function (e) {
        e.preventDefault();
        this._editFormInputs();
      }.bind(this)
    );

    document.querySelector(queryName.customRun).addEventListener(
      'click',
      function () {
        overlay.style.display = 'none';
        document.querySelector('.overlay-edit-form').style.display = 'block';

        document.querySelector(queryName.editContainer).style.display = 'none';
        document.querySelector(queryName.tidar_container).style.display =
          'block';

        isEditForm = true;
        isRunning = true;
      }.bind(this)
    );

    document
      .querySelector('.overlay-edit-form')
      .addEventListener('click', function () {
        this.style.display = 'none';

        overlay.style.display = 'block';

        document.querySelector(queryName.editContainer).style.display = 'block';

        document.querySelector(queryName.tidar_container).style.display =
          'none';

        setTimeout(function () {
          document.querySelector(queryName.edit_rDistance).focus();
        }, 400);
      });

    document.querySelector(queryName.customCyc).addEventListener(
      'click',
      function () {
        overlay.style.display = 'none';
        document.querySelector('.overlay-edit-form').style.display = 'block';

        document.querySelector(queryName.editContainer).style.display = 'none';
        document.querySelector(queryName.tidar_container).style.display =
          'block';

        isEditForm = true;
        isCycling = true;
      }.bind(this)
    );
  }

  _getExerciseData() {
    return this.#workouts;
  }

  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }
}

const app = new App();
