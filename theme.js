export const initTheme = function () {
  const theme = document.querySelector('.theme');

  const workoutSidebar = document.querySelector('.workouts-sidebar');

  const slideSidebar = document.querySelector('.side-bar');
  const dropDownTitles = document.querySelectorAll('.side-bar .nav-link-title');

  const logoTitle = document.querySelector('.logo-title');
  const closeBtn = document.querySelector('.close-btn');
  const menuBtn = document.querySelector('.menu-btn');

  const workoutFooter = document.querySelector('.workout-sidebar-footer');

  const slide_dropdown_workouts = function (color, background) {
    const workoutContainer = document.querySelectorAll('.exercise-container');

    workoutContainer.forEach(el => {
      el.style.backgroundColor = background;
      el.style.color = color;
    });

    menuBtn.style.color = color;
    closeBtn.style.color = logoTitle.style.color = color;

    dropDownTitles.forEach(el => {
      el.style.cssText = `
      color: ${color};
     `;
    });

    workoutFooter.style.cssText = `
      color: ${color};
      background-color: ${background};
    `;
  };

  const darkTheme = function () {
    slideSidebar.style.cssText = `
    background-color: #2d3439;
    color: #fff;
    `;

    workoutSidebar.style.cssText = `
    background-color: #2f4353;
    background-image: linear-gradient(315deg, #313b44 0%, #83807d 74%);
    `;

    slide_dropdown_workouts('#fff', 'rgb(66, 72, 77)');
  };

  const lightTheme = function () {
    slideSidebar.style.cssText = workoutSidebar.style.cssText = `
    background-color: #ffffff;
    background-image: linear-gradient(315deg, #ffffff 0%, #d7e1ec 74%);
    color: #000;
    `;

    slide_dropdown_workouts('#000', 'white');
  };

  const alterSelected = function (targetClass) {
    document
      .querySelector(`${targetClass === 'dark' ? '.light' : '.dark'}`)
      .classList.remove('active-link');

    document
      .querySelector(`${targetClass === 'light' ? '.light' : '.dark'}`)
      .classList.add('active-link');
  };

  theme.addEventListener('click', function (e) {
    // first className of the target element
    const className = e.target.className.split(' ')[0];
    /* *************** */

    alterSelected(className);

    className === 'light' ? lightTheme() : darkTheme();
  });
};
