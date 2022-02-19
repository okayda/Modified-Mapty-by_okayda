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

  show_or_not_arrow: (isLongJourney, isDropDown) => {
    console.log(isDropDown);
    let str;
    if (isLongJourney) {
      str = 'display-arrow-icon';
      if (isDropDown === false) str += ' arrow-up-rotate';
    } else str = 'not-display-arrow-icon';

    return str;
  },

  checkIsLongJourney(...num) {
    return num.filter(num => num > 9999).length;
  },

  state_of_color_arrow(isDropDown) {
    if (isDropDown) return 'arrow-active';
    else return 'arrow-deactive';
  },

  make_ellipsis(text) {
    return text.toString().slice(0, 1) + '...';
  },

  is_needed_to_be_ellipsis(isDropDown, isLongJourney, exerciseText) {
    if (isDropDown && isLongJourney) return exerciseText;

    if (!isLongJourney) return exerciseText;

    if (isDropDown === false && isLongJourney) {
      if (exerciseText > 999) return this.make_ellipsis(exerciseText);

      return exerciseText;
    }
  },

  iconObject() {
    // Array orders really matter
    return {
      running: ['🏃‍♂️', '🦶🏼'],
      cycling: ['🚲', '⛰'],
    };
  },

  renderWorkout(workout) {
    if (Object.keys(CustomData).length > 0) {
      const scheduleArr = CustomData.date.replace(/ /g, '').split('/');
      workout.month = scheduleArr[0];
      workout.dayNumber = scheduleArr[1];
      workout.year = scheduleArr[2];
    }

    let html = `
        <div class="exercise-container exercise--${
          workout.exerciseType
        }" data-id="${workout.id}">
                    <h2 class="workout__title">
                    <span class="title">
                    ${workout.title}
                    </span>
                        <div class="icon_container">
                            <span class="arrow_up "><i id="arrow-icon" class="fas fa-arrow-down arrow-rotate-animation ${this.show_or_not_arrow(
                              workout.longJourney,
                              workout.isDropDown
                            )} ${this.state_of_color_arrow(
      workout.isDropDown
    )}"></i></span>
                            <span class="tarmap"><i id="marker-icon" class="fas fa-map-marker-alt"></i></span>
                            <span class="edit"><i id="edit-icon" class="far fa-edit"></i></span>
                            <span class="exe"><i id="remove-icon" class="fas fa-times delete-workout"></i></span>
                        </div>
                    </h2>   

    <div class="exercise-info-container ${
      this.conditionStyleAdd(
        workout.isDropDown,
        workout.longJourney,
        this.addStyleContainer().addGridClass
      ) +
      ' ' +
      this.conditionStyleAdd(
        workout.isDropDown,
        workout.longJourney,
        this.addStyleContainer().addHeightClass
      ) +
      ' ' +
      this.conditionStyleAdd(
        workout.isDropDown,
        workout.longJourney,
        this.addStyleContainer().addPaddingClass
      )
    }">
                    
                        <div class="workout__details">
                            <span class="workout__icon icon_info">${
                              workout.exerciseType === 'running'
                                ? '<img src="workout-icons/running.png" class="workout-img"/>'
                                : '<img src="workout-icons/cycling.png" class="workout-img"/>'
                            }</span>
                            <span class="workout__value text_info">${this.is_needed_to_be_ellipsis(
                              workout.isDropDown,
                              workout.longJourney,
                              workout.distance
                            )}</span>
                            <span class="workout__unit">km</span>
                        </div>
                        <div class="workout__details">
                            <span class="workout__icon"><img src="workout-icons/clock.png" class="workout-img"/></span>
                            <span class="workout__value text_info">${this.is_needed_to_be_ellipsis(
                              workout.isDropDown,
                              workout.longJourney,
                              workout.duration
                            )}</span>
                            <span class="workout__unit">min</span>
                        </div>
        `;

    if (workout.exerciseType === 'running')
      html += `
        <div class="workout__details">
            <span class="workout__icon"><img src="workout-icons/speed.png" class="workout-img"/></span>
            <span class="workout__value text_info">${
              workout.pace_or_speed
            }</span>
            <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
            <span class="workout__icon icon_info"><img src="workout-icons/foot.png" class="workout-img"/></span>
            <span class="workout__value text_info">${this.is_needed_to_be_ellipsis(
              workout.isDropDown,
              workout.longJourney,
              workout.cadence_or_elevation
            )}</span>
            <span class="workout__unit">spm</span>
            
        </div>

     </div>             
        
     <p class="timestamp-workout-container">
            <span class="timestamp-workout-text">
    ${workout.dateSchedule}
      </span>
      <span class="time">${workout.timeSchedule}</span>
      </p>
    `;
    if (workout.exerciseType === 'cycling')
      html += `
        <div class="workout__details">
            <span class="workout__icon"><img src="workout-icons/speed.png" class="workout-img"/></span>
            <span class="workout__value text_info">${
              workout.pace_or_speed
            }</span>
            <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
            <span class="workout__icon icon_info"><img src="workout-icons/route.png" class="workout-img"/></span>
            <span class="workout__value text_info">${this.is_needed_to_be_ellipsis(
              workout.isDropDown,
              workout.longJourney,
              workout.cadence_or_elevation
            )}</span>
            <span class="workout__unit">m</span>
        </div>

     </div>

     <p class="timestamp-workout-container">
     <span class="timestamp-workout-text">
     ${workout.timeSchedule}
</span>
<span class="time">00:00 NN</span>
</p>
    `;
    containerWorkouts.insertAdjacentHTML('afterbegin', html);
  },
  // ${workout.month} \\ ${workout.dayNumber} \\ ${workout.year}
};
