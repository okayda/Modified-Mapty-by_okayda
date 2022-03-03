import { objectOverlays as overlayState } from './overlays-functionalities.js';
import { infoData } from '/app.js';

export const initDebugHandlers = function (obj) {
  document.querySelector('.workouts').addEventListener('click', function () {
    console.log('<===================>');
    console.log('Workouts Data');
    console.log(obj.get_workouts_data());
    console.log('<===================>');
  });

  document
    .querySelector('.specificEvents')
    .addEventListener('click', function () {
      console.log('<===================>');

      console.log('specificEvents Data');
      console.log(obj.get_specificEvents_data());
      console.log('<===================>');
    });

  document.querySelector('.timestamp').addEventListener('click', function () {
    console.log('<===================>');

    console.log('timestamp Data');
    console.log(obj.timestamp_data);
    console.log('<===================>');
  });

  document
    .querySelector('.overlayState')
    .addEventListener('click', function () {
      console.log('<===================>');

      console.log('overlay state Data');
      console.log(overlayState.overlay_state);
      console.log('<===================>');
    });

  document
    .querySelector('.resetWorkouts')
    .addEventListener('click', function () {
      console.log('<===================>');
      console.log('Reset all executed');
      console.log(infoData.reset_workouts_data());
      console.log('<===================>');
    });

  document.querySelector('.markers').addEventListener('click', function () {
    console.log('<===================>');
    console.log('Markers Data');
    console.log(infoData.markers);
    console.log('<===================>');
  });

  document
    .querySelector('.delete-all-exercise')
    .addEventListener('click', function () {
      console.log('<===================>');
      console.log('Delete all exercise executed');
      console.log('<===================>');
    });
};
