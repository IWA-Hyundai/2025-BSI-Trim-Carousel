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
  var carouselNext = document.querySelectorAll(`button a[data-value="next"]`);
  var carouselPrevious = document.querySelectorAll(`button a[data-value="previous"]`);

  //card specific
  const trimContent = document.querySelector('.trimcard-content');

  carouselNext.forEach(el => el.addEventListener('click', event => {

    console.log(event.target.parentElement.getAttribute("data-type"));
    flkty.next();
  }));

  carouselPrevious.forEach(el => el.addEventListener('click', event => {

    console.log(event.target.parentElement.getAttribute("data-type"));
    flkty.previous();
  }));



  function removeCarouselDisable(elements) {

    elements.forEach(el =>  {

        console.log(el.getAttribute("data-type"));

        el.classList.remove("disable-a");
        el.parentNode.classList.remove("disable-button");
        const path = el.querySelector("path");
        path.classList.remove("disable-path");
    });


  }


  function addCarouselDisable(elements, imd) {

    elements.forEach(el =>  {

        console.log(el.getAttribute("data-type"));

        el.classList.add("disable-a");
        el.parentNode.classList.add("disable-button");
        const path = el.querySelector("path");
        path.classList.add("disable-path");

    });

  }



  var flkty;  // declare flickity so we can use it in multiple places


  function clearBreakpointCarousels() {


    //adjust the main card container

    //alert(trimCard['active-breakpoints']);

    trimCard['active-breakpoints'].forEach(breakpoint =>  {

      console.log("clearBreakpointCarousels | currentBreakpoint: " + breakpoint);
      trimContent.removeAttribute('style');

      //update trims buttons to expanded state
      let containerButton = trimCard["breakpoints"][breakpoint]['containerButton'] ;
      containerButton.innerText  = trimCard['cta']['collapse'];

      containerButton.closest('.primary-button').classList.remove('secondary-button');
      containerButton.closest('.primary-button').removeAttribute('style');
          
      let colLast; //default to desktop
      let colSupport;
      let col1;
      let disclaimer;


      switch (breakpoint) {
        case "desktop":

          colLast =  containerButton.closest('.col3'); 
          colSupport = colLast.previousElementSibling;
          col1 = colSupport.previousElementSibling;
          disclaimer = colSupport.querySelector('.disclaimer'); 
          break;

        case "tablet":

          colLast =  containerButton.closest('.col2');
          colSupport = containerButton.closest('.col2');
          col1 = colSupport.previousElementSibling;
          disclaimer = col1.querySelector('.disclaimer'); 
          break;

        case "mobile":

          colLast = containerButton.closest('.col1');
          colSupport = containerButton.closest('.col1');
          col1 = colSupport;
          disclaimer = col1.querySelector('.disclaimer'); 
          col1.querySelector('.mobile-collapse-title').style.opacity = 1.0;
          col1.querySelector('.mobile-expanded-title').style.opacity = 0.0;
          break;

        default:
          break;

      }

      const photo = colSupport.querySelector('.photo'); 
      const pricing = col1.querySelector('.pricing'); 
      const copy = col1.querySelector('.copy');   
      const buildLinks = colLast.querySelector('.build-inventory-links');
      const carouselNavigation = colLast.querySelector('.carousel-navigation'); 

      photo.removeAttribute('style');
      disclaimer.removeAttribute('style');
      copy.removeAttribute('style');
      buildLinks.removeAttribute('style');
      pricing.removeAttribute('style');

      carouselNavigation.style.opacity =  0.0;
      carouselNavigation.style.display =  'display';
      carouselNavigation.style.pointerEvents =  'none';

    });

    trimCard['active-breakpoints'] = []; //empty out any stored breakpoints

  }

  window.onresize = function(event) { 

    console.log("trimcard status: " + trimCard['status'] );

    let currentBreakpoint;

    if (window.innerWidth >= 1440) {  currentBreakpoint = "desktop" };
    if (window.innerWidth >= 640 && window.innerWidth < 1440 ) { currentBreakpoint = "tablet" };  
    if (window.innerWidth < 640 ) {  currentBreakpoint= "mobile" }; 

    //if we are no longer in the breakpoint and we are expanded, need to updated the cars
    if ( trimCard['breakpoint']  !=  currentBreakpoint && trimCard['status'] == "expanded" ) {

      //adjust the main card container
      trimContent.style.height = trimCard["breakpoints"][currentBreakpoint]["expanded"] + "px";

      //update trims buttons to expanded state
      let containerButton = trimCard["breakpoints"][currentBreakpoint]['containerButton'] ;
      containerButton.innerText  = trimCard['cta']['expanded'];

      containerButton.closest('.primary-button').classList.add('secondary-button');
      containerButton.closest('.primary-button').style.transform  = 'translate(0px, ' +  trimCard["breakpoints"][currentBreakpoint]['showbutton-y']   + 'px )';
        
      let colLast; //default to desktop
      let colSupport;
      let col1;
      let disclaimer;

     console.log("currentBreakpoint: " + currentBreakpoint);

      switch (currentBreakpoint) {
        case "desktop":

          colLast =  containerButton.closest('.col3'); 
          colSupport = colLast.previousElementSibling;
          col1 = colSupport.previousElementSibling;
          disclaimer = colSupport.querySelector('.disclaimer'); 
          break;

        case "tablet":

          colLast =  containerButton.closest('.col2');
          colSupport = containerButton.closest('.col2');
          col1 = colSupport.previousElementSibling;
          disclaimer = col1.querySelector('.disclaimer'); 
          break;

        case "mobile":

          colLast = containerButton.closest('.col1');
          colSupport = containerButton.closest('.col1');
          col1 = colSupport;
          disclaimer = col1.querySelector('.disclaimer'); 
          col1.querySelector('.mobile-collapse-title').style.opacity = 0.0;
          col1.querySelector('.mobile-expanded-title').style.opacity = 1.0;
          break;

        default:
          break;

      }

      
      const photo = colSupport.querySelector('.photo'); 
      const pricing = col1.querySelector('.pricing'); 
      const copy = col1.querySelector('.copy');   
      const buildLinks = colLast.querySelector('.build-inventory-links');
      const carouselNavigation = colLast.querySelector('.carousel-navigation'); 


      photo.style.opacity =  0.0;
      disclaimer.style.opacity = 0.0;
      copy.style.opacity = 0.0;
      buildLinks.style.opacity =  0.0;
      carouselNavigation.style.opacity =  1.0;

      carouselNavigation.style.display =  'flex';
      carouselNavigation.style.pointerEvents =  'auto';


    }


     if ( trimCard['status'] == 'expanded' && currentBreakpoint == "mobile" ) {

        if ( window.innerWidth  <= 640) {
            showTrimsBaseMobile.style.transform  = 'translate(0px, 248px)';
        }

        if ( window.innerWidth < 600) {
            showTrimsBaseMobile.style.transform  = 'translate(0px, 228px)';
        }

        if ( window.innerWidth < 434) {
            showTrimsBaseMobile.style.transform  = 'translate(0px, 210px)';
        } 

     }


      //update 'breakpoint' classification
      trimCard["breakpoint"] = currentBreakpoint;

      if (!trimCard['active-breakpoints'].includes(currentBreakpoint) ) { 

        console.log(currentBreakpoint + " not found in " + trimCard['active-breakpoints'] );

        trimCard['active-breakpoints'].push(currentBreakpoint); 

      }

       

      try {
        // Code that might throw an error
        flkty.resize();
      } catch (error) {
        //console.log("flickity not active")
      } finally {
        // Code that always executes, regardless of errors
      }


   };


  function updateDisplayText(indexStart, indexEnd, total, displayText) {

    const slideNumbers = (indexStart != indexEnd ) ? indexStart + "-" + indexEnd : indexStart;
    displayText.innerText = slideNumbers + " of " + total + " matches";

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

            if (this.slides.length === 1) { addCarouselDisable(carouselNext);   }  // if we are only at 1 slide
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


              //if we are on mobile and only have 1 slide in view 
              if (visibleCellsChange.length == 1) {     
                updateDisplayText( (this.selectedIndex + 1), this.slides.length, this.getCellElements().length , displaytext);
                return;
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
            } else {
              removeCarouselDisable(carouselPrevious);

            }


            if ( this.selectedIndex === (this.slides.length - 1) ) { 
              addCarouselDisable(carouselNext); 
            } else {
              removeCarouselDisable(carouselNext);
              
            }

          },
          
           resize: function(slide) {

            console.log( 'resize called: ' );
            flkty.select(0);
            visibleCellsChange = [];

            for(let i = 0; i < this.selectedElements.length; i++) {
                visibleCellsStart.push(this.selectedElements[i].getAttribute('dataslide'));
            } 

            //console.log( 'visibleCellsResize: ' + visibleCellsStart );
            updateDisplayText(visibleCellsStart[0], visibleCellsStart[visibleCellsStart.length - 1], this.getCellElements().length , displaytext);
      
          },
        },

        //based on breakpoint
        selectedAttraction: flickitySelectedAttraction, // higher attraction and higher friction
        friction: flickityFriction, // faster transitions

      });
  }



  var trimCard = { 
    'status' : 'collapse', 
    'breakpoint' : null,  
    'cta' : { 'collapse' : 'Show 7 Trims', 'expanded' : 'Hide 7 Trims'},
      
    'breakpoints' : {
      'desktop' :  { 'expanded' : 712 , 'showbutton-y' : 348, 'containerButton' : document.querySelector('.trimcard-header-desktop .container-button')  },
      'tablet'  :  { 'expanded' : 651 , 'showbutton-y' : 332, 'containerButton' : document.querySelector('.trimcard-header-tablet .container-button') },
      'mobile'  :  { 'expanded' : 720 , 'showbutton-y' : 720, 'containerButton' : document.querySelector('.trimcard-header-mobile .container-button') },
    },
    'active-breakpoints' : []
  };

  trimCard['height1440'] =  { 'expanded' : 712 , 'showbutton-y' : 348 };   // 1440 height is 702 with the example cards
  trimCard['height1024'] =  { 'expanded' : 651 , 'showbutton-y' : 332 };   // 1024 height is 651 with the example cards
  trimCard['height640'] =   { 'expanded' : 720 , 'showbutton-y' : 720 };   //  640 height is 651 with the example cards

   const showTrimsBaseMobile = document.querySelector('.trimcard-header-mobile .primary-button');


  if (window.innerWidth >= 1440) {  trimCard["breakpoint"] = "desktop" };
  if (window.innerWidth >= 640 && window.innerWidth < 1440 ) {  trimCard["breakpoint"] = "tablet" };  
  if (window.innerWidth < 640 ) {  trimCard["breakpoint"] = "mobile" };  


  // expand / contract carousel 
  showTrimsButtons.forEach(showTrimsButton => {

    showTrimsButton.addEventListener("click", function (e) {

      //are we open or closed?
      const trimType = e.target.parentElement.getAttribute('data-type');  // desktop = tablet - mobile
   
      const containerButton = e.target.querySelector('.container-button');
      const showTrimsBase = e.target.closest('.primary-button');
      
      let heightType ; //default to desktop
      let colLast; //default to desktop
      let colSupport ;
      let col1;
      let disclaimer; 

      switch (trimType) {
        case "desktop":
          heightType =  trimCard['height1440']; 
          colLast =  e.target.closest('.col3'); 
          colSupport = colLast.previousElementSibling;
          col1 = colSupport.previousElementSibling;
          disclaimer = colSupport.querySelector('.disclaimer');
          break;

        case "tablet":
          heightType =  trimCard['height1024']; 
          colLast =  e.target.closest('.col2');
          colSupport = e.target.closest('.col2');
          col1 = colSupport.previousElementSibling;
          disclaimer = col1.querySelector('.disclaimer');
          break;

        case "mobile":
          heightType =  trimCard['height640']; 
          colLast = e.target.closest('.col1');
          colSupport = e.target.closest('.col1');
          col1 = colSupport;
          disclaimer = col1.querySelector('.disclaimer');
          break;

        default:
          break;
      }
      
      const buildInventoryLinks = colLast.querySelector('.build-inventory-links');
      const carouselNavigation = colLast.querySelector('.carousel-navigation'); 

      const carouselNavItems = {"text" : carouselNavigation.querySelector('.textdisplay')  , "button1" : carouselNavigation.getElementsByClassName('directional-selector-xlarge-arrow')[0]  , "button2" : carouselNavigation.getElementsByClassName('directional-selector-xlarge-arrow')[1]}

      const photo = colSupport.querySelector('.photo'); 
     

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

        if ( trimType == "mobile") {

          const titleCollapse = col1.querySelector('.mobile-collapse-title '); 
          const titleExpanded = col1.querySelector('.mobile-expanded-title '); 

          tl.to(titleCollapse, { opacity: 0, duration: 0.1667 }, 0.1);
          tl.to(titleExpanded, { opacity: 1, duration: 0.1667 }, 0.3);

          let showButtonY;

          switch (trimContent.offsetHeight) {
            case 472:
              showButtonY = 248; 
              break;
            case 492:
              showButtonY = 228; 
              break;
            case 508:
              showButtonY = 210; 
              break;
            default:
              // statements_def
              break;
          }


          //hard code these in for demp purpose 

          tl.to(showTrimsBase, {y: showButtonY, duration: 0.3, ease: CustomEase.create("custom", "M0,0 C0.217,0.796 0.47,1.02 1,1 ") }, 0.0 );

        } else {

          tl.to(showTrimsBase, {y: heightType["showbutton-y"], duration: 0.3, ease: CustomEase.create("custom", "M0,0 C0.217,0.796 0.47,1.02 1,1 ") }, 0.0 );
        }


        tl.to(trimContent, {height: (heightType["expanded"] + "px"), duration: 0.3, ease: CustomEase.create("custom", "M0,0 C0.217,0.796 0.47,1.02 1,1 ") },  0.0 );
        //tl.to(showTrimsBase, {y: heightType["showbutton-y"], duration: 0.3, ease: CustomEase.create("custom", "M0,0 C0.217,0.796 0.47,1.02 1,1 ") }, 0.0 );

        //animate trim cards on
        for(let i=0; i < carouselCards.length; i ++) {
          tl.fromTo(carouselCards[i], {opacity: 0.0}, { opacity: 1.00, duration: 0.2 }, 0.3 + ( (i + 0.2) * 0.115));
          tl.fromTo(carouselCards[i], {scale: 0.85}, {  scale: 1.00, duration: 0.235, ease: CustomEase.create("custom", "M0,0 C0.223,0 0.177,1 1,1 ") },  0.3 + ( (i + 0.2) * 0.115));
        }

        tl.to(carousel, {  opacity: 1, duration: 0.2 }, 0.25);
        tl.to(carouselNavigation, {  opacity: 1, duration: 0.5 }, 0.6);

    
        //trim navigation
        // previous - next position
        tl.fromTo(carouselNavItems["button1"] , {x: 32.0}, { x: 0.0, duration: 0.25, ease: "circ.out" }, 0.75);
        tl.fromTo(carouselNavItems["button2"] , {x: -32.0}, { x: 0.0, duration: 0.25, ease: "circ.out" }, 0.75);

        // previous - next opacity
        tl.fromTo(carouselNavItems["button1"].querySelector('.fff-solid') , {opacity: 1.0}, { opacity: 0.0, duration: 0.25 }, 0.8);
        tl.fromTo(carouselNavItems["button2"].querySelector('.fff-solid') , {opacity: 1.0}, { opacity: 0.0, duration: 0.25 }, 0.8);

        //text - opacity
        tl.fromTo(carouselNavItems["text"] , {opacity: 0.0}, { opacity: 1.0, duration: 0.33 }, 0.95);
        
        //play gs timeline
        tl.play();

        trimCard['active-breakpoints'].push(trimType); 
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
          removeCarouselDisable(carouselPrevious);

          gsap.set(trimContent, { clearProps: "all" });

          function removeDuplicates(data) {
            return [...new Set(data)];
          }

          trimCard['active-breakpoints'] =  removeDuplicates(trimCard['active-breakpoints']);        

          var index = trimCard['active-breakpoints'].indexOf(trimType);
          if (index !== -1) {
            trimCard['active-breakpoints'].splice(index, 1);
          }

          clearBreakpointCarousels(); // remove any instances of additional breakpoint carousels that could have been created on window resize

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

        if ( trimType == "mobile") {

          const titleCollapse = col1.querySelector('.mobile-collapse-title '); 
          const titleExpanded = col1.querySelector('.mobile-expanded-title '); 

          tl.to(titleCollapse, { opacity: 1, duration: 0.1667 }, 0.55);
          tl.to(titleExpanded, { opacity: 0, duration: 0.1667 }, 0.15);

        } 

        //play gs timeline
        tl.play();


      }

    });
  });

 
});
