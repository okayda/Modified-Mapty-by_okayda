'use strict';

import { dataObj as queryName } from './query_name.js';

import { initSideBar } from './sidebar.js';

import { initTheme } from './theme.js';

import { timestampObj as AppTimestamp } from './timestamp.js';

import { objectOverlays } from './overlays-functionalities.js';

import event_handlers_init from './eventHandlers-functionalities.js';

import { testImport } from './edit_form_functionalities.js';

export let CustomData = {};

console.log(queryName);

let manualSearchEnabled = false;

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

export default class App {
  date = new Date();

  #map;
  #mapEvent;
  #mapZoomLevel = 13;

  #workouts = [];
  #specificEvents = [];

  constructor() {
    this._getPosition();

    initSideBar();

    initTheme();

    // here Custom Schedule Form

    event_handlers_init();

    AppTimestamp.getCustomSchedule();

    objectOverlays.overlays_init();

    testImport();

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

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

    // L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    //   attribution:
    //     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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
      console.log('clear inputs');

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
        console.log(this);
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
    // renderWorkout(workout);

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
                              workout.type === 'running'
                                ? '<img src="workout-icons/running.png" class="workout-img"/>'
                                : '<img src="workout-icons/cycling.png" class="workout-img"/>'
                            }</span>
                            <span class="workout__value text_info">${this._ellipsisIsDropdown(
                              isDropDown,
                              workout.longJourney,
                              workout.distance
                            )}</span>
                            <span class="workout__unit">km</span>
                        </div>
                        <div class="workout__details">
                            <span class="workout__icon"><img src="workout-icons/clock.png" class="workout-img"/></span>
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
            <span class="workout__icon"><img src="workout-icons/speed.png" class="workout-img"/></span>
            <span class="workout__value">test</span>
            <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
            <span class="workout__icon icon_info"><img src="workout-icons/foot.png" class="workout-img"/></span>
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
            <span class="workout__icon"><img src="workout-icons/speed.png" class="workout-img"/></span>
            <span class="workout__value">test</span>
            <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
            <span class="workout__icon icon_info"><img src="workout-icons/route.png" class="workout-img"/></span>
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
    // this.#workouts.forEach(work => renderWorkout(work, work.isDropDown));
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

    // editForm.style.display = val;

    // setTimeout(function () {
    //   document.querySelector('.rDistance').focus();
    // }, 400);

    // overlay.style.display = val;
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
      this._toggleEditForm('none', target);
      // document.querySelector(queryName.tidar_container).style.display = 'none';
    }

    if (targetName === 'fa-edit') {
      // this._toggleEditForm('block', target);
      this._toggleEditForm('block', target);

      objectOverlays.edit_form_init();
    }
  }

  _gotoMapmarker(target, targetName) {
    if (targetName === 'fa-map-marker-alt') {
      this._moveToPopUp(target);
      target.classList.toggle('click_icon_color');
    }
  }

  _removeErrorAlert(target) {
    if (target.className.split(' ')[0] === 'error-overlay') {
      document.querySelector('.error-overlay').classList.remove('active');
    }
  }

  _workout_icons_functionalities(e) {
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
      .addEventListener(
        'click',
        this._workout_icons_functionalities.bind(this)
      );

    editForm.addEventListener(
      'submit',
      function (e) {
        e.preventDefault();
        this._editFormInputs();
        console.log('test');
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
console.log(app._getExerciseData());
