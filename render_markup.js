'use strict ';

import { dataObj as queryName } from './query_name.js';

import { CustomData } from './app.js';

const containerWorkouts = document.querySelector(queryName.workouts);

export const renderMethods = {
  addStyleContainer() {
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
  },

  conditionStyleAdd(isDropDown, isLongJourney, styleAdd) {
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
  },

  displayArrow: isLongJourney => (isLongJourney ? 'showIcon' : 'notShowIcon'),

  checkIsLongJourney(...num) {
    return num.filter(num => num > 9999).length;
  },

  specificArrowRotation(isDropDown, isLongJourney) {
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
  },

  ellipsisIsDropdown(isDropDown, isLongJourney, exerciseText) {
    if (!isLongJourney || isDropDown === null) return exerciseText;

    return isDropDown
      ? exerciseText
      : exerciseText.toString().slice(0, 1) + '...';
  },

  iconObject() {
    // Array orders really matter
    return {
      running: ['🏃‍♂️', '🦶🏼'],
      cycling: ['🚲', '⛰'],
    };
  },

  renderWorkout(workout, isDropDown = null) {
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
                            <span class="arrow_up "><i class="fas fa-arrow-down up ${displayArrow(
                              workout.longJourney
                            )} ${specificArrowRotation(
      isDropDown,
      workout.longJourney
    )}"></i></span>
                            <span class="tarmap"><i class="fas fa-map-marker-alt"></i></span>
                            <span class="edit"><i class="far fa-edit"></i></span>
                            <span class="exe"><i class="fas fa-times delete-workout"></i></span>
                        </div>
                    </h2>   

    <div class="exercise-info-container ${
      conditionStyleAdd(
        isDropDown,
        workout.longJourney,
        addStyleContainer().addGridClass
      ) +
      ' ' +
      conditionStyleAdd(
        isDropDown,
        workout.longJourney,
        addStyleContainer().addHeightClass
      ) +
      ' ' +
      conditionStyleAdd(
        isDropDown,
        workout.longJourney,
        addStyleContainer().addPaddingClass
      )
    }">
                    
                        <div class="workout__details">
                            <span class="workout__icon icon_info">${
                              workout.type === 'running'
                                ? '<img src="workout-icons/running.png" class="workout-img"/>'
                                : '<img src="workout-icons/cycling.png" class="workout-img"/>'
                            }</span>
                            <span class="workout__value text_info">${ellipsisIsDropdown(
                              isDropDown,
                              workout.longJourney,
                              workout.distance
                            )}</span>
                            <span class="workout__unit">km</span>
                        </div>
                        <div class="workout__details">
                            <span class="workout__icon"><img src="workout-icons/clock.png" class="workout-img"/></span>
                            <span class="workout__value text_info">${ellipsisIsDropdown(
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
            <span class="workout__value text_info">${ellipsisIsDropdown(
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
    if (workout.type === 'cycling')
      html += `
        <div class="workout__details">
            <span class="workout__icon"><img src="workout-icons/speed.png" class="workout-img"/></span>
            <span class="workout__value">test</span>
            <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
            <span class="workout__icon icon_info"><img src="workout-icons/route.png" class="workout-img"/></span>
            <span class="workout__value text_info">${ellipsisIsDropdown(
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
  },
};
