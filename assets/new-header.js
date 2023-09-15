document.addEventListener('DOMContentLoaded', function(){


    //   add class to the header navigation to add top 0
    const content = document.querySelector(".header-navigation");
    const logo_block = document.querySelector(".header-item--logo");

    // add classes to the open navigation 
    const iconBurger = document.querySelector('.js-btn-burger-menu');
    const navDesktop = document.querySelector('.nav-desktop-drawer');

  window.addEventListener("scroll", function() {
    if (window.scrollY > 60) { // Adjust the scroll position where the class should be added
      content.classList.add("nav-active");
      logo_block.classList.add("nav-active");
    } else {
      content.classList.remove("nav-active");
      logo_block.classList.remove("nav-active");
    }
  });


  
iconBurger.addEventListener('click', function(){
    if(!navDesktop.classList.contains('nav-desktop-drawer-active')){
        navDesktop.classList.add('nav-desktop-drawer-active')
        document.body.classList.add('body-active');
        content.classList.add("nav-active-bars");
    }else{
        navDesktop.classList.remove('nav-desktop-drawer-active')
        document.body.classList.remove('body-active')
        content.classList.remove("nav-active-bars");
    }
})

})