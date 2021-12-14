const menus = document.querySelectorAll(".menu");
menus.forEach(function (menu) {
  // find all the links
  const allLinks = menu.querySelectorAll(".link");
  const slider = menu.querySelector(".slider");
  const focus = menu.querySelector(".focus");

  // remove all the previous active if present
  const removeActiveClass = () => {
    allLinks.forEach(function (item) {
      item.classList.remove("active");
    });
  };

  const addActiveState = (activeElement) => {
    const icon = activeElement.querySelector(".icon");
    const sliderPos = activeElement.offsetLeft + icon.offsetWidth * 0.75;
    // animation
    gsap
      .timeline()
      .to(focus, {
        height: 0,
        duration: 0.3,
        ease: Power4.easeIn,
        onComplete: removeActiveClass,
      })
      .to(slider, {
        css: {
          width: icon.offsetWidth,
          left: sliderPos,
        },
        duration: 0.4,
        ease: Power4.easeInOut,
      })
      .to(focus, {
        height: activeElement.offsetHeight * 1.4,
        duration: 0.1,
        ease: Power4.easeOut,
        onComplete: () => activeElement.classList.add("active"),
      })
      .play();
  };

  // we need to add the click listener
  allLinks.forEach((link) =>
    link.addEventListener("click", () => {
      addActiveState(link);
    })
  );
});