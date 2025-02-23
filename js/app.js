gsap.registerPlugin(CustomEase);

document.addEventListener("DOMContentLoaded", (event) => {




const isVisibleInViewport = (element) => {
  const rect = element.getBoundingClientRect()
  return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }



const showTrimsButtons = document.querySelectorAll(`[data-id="show-trims"]`);
const trimcard = document.querySelector(".trimcard-header-desktop");  
const carousel = document.querySelector(".trim-carousel-flickity" ); 

  
var carouselNext = document.querySelector(`button a[data-value="next"][data-type="desktop"]`);
var carouselPrevious = document.querySelector(`button a[data-value="previous"][data-type="desktop"]`);

var carouselTabletNext = document.querySelector(`button a[data-value="next"][data-type="tablet"]`);
var carouselTabletPrevious = document.querySelector(`button a[data-value="previous"][data-type="tablet"]`);


  function removeCarouselDisable(elem) {

    elem.classList.remove("disable-a");
    elem.parentNode.classList.remove("disable-button");
    const path = elem.querySelector("path");
    path.classList.remove("disable-path");

  }


  function addCarouselDisable(elem, imd) {

    elem.classList.add("disable-a");
    elem.parentNode.classList.add("disable-button");
    const path = elem.querySelector("path");
    path.classList.add("disable-path");
    
  }




  carouselNext.addEventListener("click", (event) => {

     flkty.next();
  });


  carouselPrevious.addEventListener("click", (event) => {

     flkty.previous();

  });


  carouselTabletNext.addEventListener("click", (event) => {

     flkty.next();
  });


  carouselTabletPrevious.addEventListener("click", (event) => {

     flkty.previous();

  });





  var trimCard = { 'status' : 'collapse',  'cta' : { 'collapse' : 'Show 7 Trims', 'expanded' : 'Hide 7 Trims'}  };
  trimCard['height1440'] =  { 'expanded' : 712 , 'showbutton-y' : 348 };  // 1440 height is 702 with the example cards
  trimCard['height1024'] =  { 'expanded' : 651 , 'showbutton-y' : 332 };   // 1440 height is 651 with the example cards

  var flkty;  // declare flickity so we can use it in multiple places

  window.onresize = function(event) { 
    flkty.resize(); 

   };


  function updateDisplayText(indexStart, indexEnd, total, displayText) {
    displayText.innerText = indexStart + "-" + indexEnd + " of " + total + " matches";

  }


  function flickityInit(elem, displaytext) {

    //default 
    const flickitySelectedAttraction = matchMedia('screen and (max-width: 768px)').matches ? 0.025 : 0.1;
    const flickityFriction  = matchMedia('screen and (max-width: 768px)').matches ? 0.28 : 0.6;

    let visibleCellsStart = [];
    let visibleCellsChange = [];

    flkty = new Flickity( elem, {
   
        cellAlign: 'left',
        contain: true,
        prevNextButtons: false,
        pageDots : false,
        groupCells : true,
        //cellAlign: 'center',  // if we have only 1 slide then use
        on: {
          ready: function() {
            console.log('Flickity ready');
            console.log("Slide " + (this.selectedIndex + 1) + " of " + this.slides.length);

            console.log("flkty.getCellElements(): " + this.getCellElements().length );

            for(let i = 0; i < this.selectedElements.length; i++) {
              visibleCellsStart.push(this.selectedElements[i].getAttribute('dataslide'));
            } 

            console.log( 'visibleCellsStart: ' + visibleCellsStart );

            //disable the first
            addCarouselDisable(carouselPrevious);
            addCarouselDisable(carouselTabletPrevious);

            if (this.slides.length === 1) { addCarouselDisable(carouselNext);   addCarouselDisable(carouselTabletNext); }  // if we are only at 1 slide
            updateDisplayText(visibleCellsStart[0], visibleCellsStart[visibleCellsStart.length - 1], this.getCellElements().length , displaytext);

          },
          change: function(slide) {

            console.log("Slide " + (this.selectedIndex + 1) + " of " + this.slides.length);
           
           //if we are at the end, assume the selected class is applied to less then is shown

           if(  (this.selectedIndex + 1) == this.slides.length) {

              let visibleCellsEnd = [];

              for(let i = 0; i < this.selectedElements.length; i++) {

                visibleCellsEnd.push(this.selectedElements[i].getAttribute('dataslide'));

              } 

              let visibleCellsPrevious = visibleCellsChange.length > 0 ? visibleCellsChange : visibleCellsStart;  //get the most recent set to compare against

              //are the sizes different? We could only have 1 activeCell in the visibleCellsEnd
              if (visibleCellsEnd.length < visibleCellsPrevious.length) {

                console.log("visibleCellsEnd.length: " + visibleCellsEnd.length + " | visibleCellsPrevious.length: " + visibleCellsPrevious.length ); 

                for( let i = visibleCellsPrevious.length-1; i >= 1; i--) {

                  console.log("i: " +  visibleCellsPrevious[i]);
                  visibleCellsEnd.unshift(visibleCellsPrevious[i]);

                }

                console.log("visibleCellsEnd: " + visibleCellsEnd);
                updateDisplayText(visibleCellsEnd[0], visibleCellsEnd[visibleCellsChange.length - 1], this.getCellElements().length , displaytext);

              } else {

                // there is actually the same at the end active cells
                for(let i = 0; i < this.selectedElements.length; i++) {

                  visibleCellsChange.push(this.selectedElements[i].getAttribute('dataslide'));

                } 

                console.log( 'visibleCellsChange: ' + visibleCellsChange );
                updateDisplayText(visibleCellsChange[0], visibleCellsChange[visibleCellsChange.length - 1], this.getCellElements().length , displaytext);

              }

           } else {

            // we are not at the end

            visibleCellsChange = [];
            for(let i = 0; i < this.selectedElements.length; i++) {

                visibleCellsChange.push(this.selectedElements[i].getAttribute('dataslide'));
            } 

              console.log( 'visibleCellsChange: ' + visibleCellsChange );
              updateDisplayText(visibleCellsChange[0], visibleCellsChange[visibleCellsChange.length - 1], this.getCellElements().length , displaytext);
            }

            //remove disable the first
            if ( this.selectedIndex === 0 ) { 
              addCarouselDisable(carouselPrevious); 
              addCarouselDisable(carouselTabletPrevious); 
            } else {
              removeCarouselDisable(carouselPrevious);
              removeCarouselDisable(carouselTabletPrevious);

            }


            if ( this.selectedIndex === (this.slides.length - 1) ) { 
              addCarouselDisable(carouselNext); 
              addCarouselDisable(carouselTabletNext);
            } else {
              removeCarouselDisable(carouselNext);
              removeCarouselDisable(carouselTabletNext);
              
            }

          },
          
           resize: function(slide) {

            console.log( 'resize called: ' );
            flkty.select(0);
            visibleCellsChange = [];

            for(let i = 0; i < this.selectedElements.length; i++) {
                visibleCellsStart.push(this.selectedElements[i].getAttribute('dataslide'));
            } 

            console.log( 'visibleCellsResize: ' + visibleCellsStart );
            updateDisplayText(visibleCellsStart[0], visibleCellsStart[visibleCellsStart.length - 1], this.getCellElements().length , displaytext);
      
          },
        },

        //based on breakpoint
        selectedAttraction: flickitySelectedAttraction, // higher attraction and higher friction
        friction: flickityFriction, // faster transitions

      });
  }



// expand / contract carousel 
showTrimsButtons.forEach(showTrimsButton => {




  showTrimsButton.addEventListener("click", function (e) {

    //are we open or closed?
    const trimType = e.target.parentElement.getAttribute('data-type');  // desktop = tablet - mobile
 
    const containerButton = e.target.querySelector('.container-button');
    const showTrimsBase = e.target.closest('.primary-button');
    const trimContent = e.target.closest('.trimcard-content');

    const heightType = (trimType == "desktop") ?  trimCard['height1440'] : trimCard['height1024'];
    
     const colLast =  (trimType == "desktop") ? e.target.closest('.col3') : e.target.closest('.col2');
    //const col3 = e.target.cloest('.col3'); 

    const buildInventoryLinks = colLast.querySelector('.build-inventory-links');
    const carouselNavigation = colLast.querySelector('.carousel-navigation'); 


    const carouselNavItems = {"text" : carouselNavigation.querySelector('.textdisplay')  , "button1" : carouselNavigation.getElementsByClassName('directional-selector-xlarge-arrow')[0]  , "button2" : carouselNavigation.getElementsByClassName('directional-selector-xlarge-arrow')[1]}

    const col2 =  (trimType == "desktop") ? colLast.previousElementSibling : e.target.closest('.col2');
    //const col2 = col3.previousElementSibling;

    const photo = col2.querySelector('.photo'); 
    const disclaimer = col2.querySelector('.disclaimer'); 

    const col1 = col2.previousElementSibling;
    const pricing = col1.querySelector('.pricing'); 
    const copy = col1.querySelector('.copy');  

    //get carousel items
    const mainCarousel = document.querySelector('.main-carousel');
    const carouselCells = mainCarousel.getElementsByClassName('carousel-cell');

    let carouselCards = [];
    for(let i=0; i < carouselCells.length; i ++) {
      carouselCards.push(  carouselCells[i].querySelector('img') );
    }



    if (trimCard['status'] == 'collapse') {

      trimCard['status'] = 'expanded';

      //update CTA button 
      containerButton.innerText  = trimCard['cta']['expanded'];
      showTrimsBase.classList.add('secondary-button');
      
      const tl = gsap.timeline({paused: true});

      carousel.style.display = 'inline';
      carouselNavigation.style.display =  'flex';
      carouselNavigation.style.pointerEvents =  'auto';

      tl.to(pricing, { opacity: 0, duration: 0.2 }, 'start');
      tl.to(buildInventoryLinks, { opacity: 0, duration: 0.2 },  'start');
      tl.to(copy, {  opacity: 0, duration: 0.25 }, 0.1);
      tl.to(photo, { opacity: 0, duration: 0.1667 }, 0.1);
      tl.fromTo(photo, {scale: 1.0}, {  scale: 0.85, ease: CustomEase.create("custom", "M0,0 C0.611,0 0.176,1 1,1 "), duration: 0.2 }, 0.1);
      tl.to(disclaimer, { opacity: 0, duration: 0.1667 }, 0.1);

      tl.to(trimContent, { height: (heightType["expanded"] + "px"), duration: 0.3, ease: CustomEase.create("custom", "M0,0 C0.217,0.796 0.47,1.02 1,1 ") },  0.0 );
      tl.to(showTrimsBase, { y: heightType["showbutton-y"], duration: 0.3, ease: CustomEase.create("custom", "M0,0 C0.217,0.796 0.47,1.02 1,1 ") }, 0.0 );

      //animate trim cards on
      for(let i=0; i < carouselCards.length; i ++) {
        tl.fromTo(carouselCards[i], {opacity: 0.0}, { opacity: 1.00, duration: 0.1667 }, 0.3 + ( i * 0.1));
        tl.fromTo(carouselCards[i], {scale: 0.85}, {  scale: 1.00, duration: 0.225 }, 0.3 + ( i * 0.1));
      }

      tl.to(carousel, {  opacity: 1, duration: 0.5 }, 0.4);
      tl.to(carouselNavigation, {  opacity: 1, duration: 0.5 }, 0.5);

  
      //trim navigation
      // previous - next position
      tl.fromTo(carouselNavItems["button1"] , {x: 32.0}, { x: 0.0, duration: 0.25 }, 0.6);
      tl.fromTo(carouselNavItems["button2"] , {x: -32.0}, { x: 0.0, duration: 0.25 }, 0.6);

      // previous - next opacity
      tl.fromTo(carouselNavItems["button1"].querySelector('.fff-solid') , {opacity: 1.0}, { opacity: 0.0, duration: 0.25 }, 0.65);
      tl.fromTo(carouselNavItems["button2"].querySelector('.fff-solid') , {opacity: 1.0}, { opacity: 0.0, duration: 0.25 }, 0.65);

      //text - opacity
      tl.fromTo(carouselNavItems["text"] , {opacity: 0.0}, { opacity: 1.0, duration: 0.33 }, 0.85);
      
      //play gs timeline
      tl.play();


      flickityInit(mainCarousel, carouselNavItems["text"] );

    } else {

      trimCard['status'] = 'collapse';

      //update CTA button 

      containerButton.innerText  = trimCard['cta']['collapse'];
      e.target.closest('.primary-button').classList.remove('secondary-button');

      carouselNavigation.style.pointerEvents =  'none';

      function completeCollapse() {
        flkty.destroy();
        carousel.style.display = 'none';
        removeCarouselDisable(carouselNext);
        removeCarouselDisable(carouselTabletNext);
        removeCarouselDisable(carouselPrevious);
        removeCarouselDisable(carouselTabletPrevious);


        gsap.set(trimContent, { clearProps: "all" });
      }

      const tl = gsap.timeline({paused: true, onComplete: completeCollapse});

      tl.to(carousel, { opacity: 0, duration: 0.35 }, 'start');
      tl.to(carouselNavigation, {  opacity: 0, duration: 0.35 }, 0.1);

      tl.to(trimContent, { height: 'auto', duration: 0.3, ease: CustomEase.create("custom", "M0,0 C0.217,0.796 0.47,1.02 1,1 ") }, 0.15 );
      tl.to(showTrimsBase, { y: 0, duration: 0.3, ease: CustomEase.create("custom", "M0,0 C0.217,0.796 0.47,1.02 1,1 ") }, 0.15 );
      tl.to(photo, {  opacity: 1, duration: 0.25, ease: CustomEase.create("custom", "M0,0 C-0.014,0.711 0.306,1 1,1 "), }, 0.45);
      tl.fromTo(photo,  {scale: 0.8}, {  scale: 1, duration: 0.25 }, 0.45);
      tl.to(copy, {  opacity: 1, duration: 0.33 }, 0.55);
      tl.to(disclaimer, {  opacity: 1, duration: 0.33 }, 0.45);
      tl.to(pricing, { opacity: 1, duration: 0.33 }, 0.55);
      tl.to(buildInventoryLinks, { opacity: 1, duration: 0.33 }, 0.55);

      //play gs timeline
      tl.play();


    }

  });
});

 
});
