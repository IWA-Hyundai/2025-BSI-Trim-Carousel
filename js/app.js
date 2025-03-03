gsap.registerPlugin(CustomEase);

document.addEventListener("DOMContentLoaded", (event) => {

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());


  if (typeof params["fpo"] !== 'undefined') {

      // Parameter exists, perform actions using the parameter
      console.log("FPO exists:", params["fpo"]);
      //change the opacity of 

      document.querySelector("h1.FPOdisclaimer ").style.display = "block";
      document.querySelector("header.mobile").style.opacity = parseFloat(params["fpo"]);
      document.querySelector("header.desktop").style.opacity = parseFloat(params["fpo"]);
      document.querySelector(".subhead-mobile").style.opacity = parseFloat(params["fpo"]);
      document.querySelector(".subhead-desktop").style.opacity = parseFloat(params["fpo"]);
      document.querySelector(".filters-desktop").style.opacity = parseFloat(params["fpo"]);

    } 


  document.body.removeAttribute('style');

  const showTrimsButtons = document.querySelectorAll(`[data-id="show-trims"]`);
  const trimcard = document.querySelector(".trimcard-header-desktop");  
  const carousel = document.querySelector(".trim-carousel-flickity" ); 
  var carouselNext = document.querySelectorAll(`button a[data-value="next"]`);
  var carouselPrevious = document.querySelectorAll(`button a[data-value="previous"]`);

  const carouselNavigationText  = document.querySelectorAll('.carousel-navigation .textdisplay');



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

        //console.log(el.getAttribute("data-type"));
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

    trimCard['active-breakpoints'].forEach(breakpoint =>  {

      console.log("clearBreakpointCarousels | currentBreakpoint: " + breakpoint);
      trimContent.removeAttribute('style');

      //update trims buttons to expanded state
      let containerButton = trimCard["breakpoints"][breakpoint]['containerButton'] ;
      containerButton.innerText  = trimCard['cta']['collapse'];

      containerButton.closest('.primary-button').classList.remove('secondary-button');
      containerButton.closest('.primary-button').removeAttribute('style');

      const svg = containerButton.parentElement.querySelector('.chevron-medium-14x8');
      svg.style.transform = 'rotate(180deg)';
      const path = svg.querySelector('.path-stroke');
      path.style.stroke = '#fff';
          
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



  // RESIZE WINDOW LISTENER
  var prevWidth = window.innerWidth;

  window.onresize = function(event) { 

    var width = window.innerWidth;
    
    //if we are only resizing on the width of the browser
    if (width != prevWidth) {

      //console.log( width  + " : " + prevWidth);
      const trimCardContent = document.querySelector('div.main .trimcard-content');

      prevWidth = window.innerWidth;
      console.log("RESIZE : trimcard status: " + trimCard['status'] );

      let currentBreakpoint;

      if (window.innerWidth >= 1440) {  currentBreakpoint = "desktop" };
      if (window.innerWidth >= 640 && window.innerWidth < 1440 ) { currentBreakpoint = "tablet" };  
      if (window.innerWidth < 640 ) {  currentBreakpoint= "mobile" }; 

      let showButtonResize = 0;


      //if we are no longer in the breakpoint and we are expanded, need to updated the cars
      if ( trimCard['status'] == "expanded") {

        //adjust the main card container
        trimContent.style.height = trimCard["breakpoints"][currentBreakpoint]["expanded"] + "px";

        //update trims buttons to expanded state
        let containerButton = trimCard["breakpoints"][currentBreakpoint]['containerButton'] ;
        containerButton.innerText  = trimCard['cta']['expanded'];
        const svg = containerButton.parentElement.querySelector('.chevron-medium-14x8');
        svg.style.transform = 'rotate(180deg)';
        const path = svg.querySelector('.path-stroke');
        path.style.stroke = '#002C5E';


        containerButton.closest('.primary-button').classList.add('secondary-button');
       

        let colLast; //default to desktop
        let colSupport;
        let col1;
        let disclaimer;
        let primaryButton;
        let trimCardHeader;

        console.log("currentBreakpoint: " + currentBreakpoint);

        switch (currentBreakpoint) {
          case "desktop":
            trimCardHeader = containerButton.closest('.trimcard-header-desktop');
            colLast =  containerButton.closest('.col3'); 
            colSupport = colLast.previousElementSibling;
            col1 = colSupport.previousElementSibling;
            primaryButton = document.querySelector('.trimcard-header-desktop .primary-button');  
            disclaimer = colSupport.querySelector('.disclaimer'); 

            break;

          case "tablet":
            trimCardHeader = containerButton.closest('.trimcard-header-tablet');
            colLast =  containerButton.closest('.col2');
            colSupport = containerButton.closest('.col2');
            col1 = colSupport.previousElementSibling;
            primaryButton = document.querySelector('.trimcard-header-tablet .primary-button');  
            disclaimer = col1.querySelector('.disclaimer'); 
            break;

          case "mobile":
            trimCardHeader = containerButton.closest('.trimcard-header-mobile');
            colLast = containerButton.closest('.col1');
            colSupport = containerButton.closest('.col1');
            col1 = colSupport;
            primaryButton = document.querySelector('.trimcard-header-mobile .primary-button');  
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
        const carouselNavigationText = carouselNavigation.querySelector('.textdisplay'); 

        const trimCardContentStyle = window.getComputedStyle(trimCardHeader);
        let trimCardContentMarginPadding = parseInt(trimCardContentStyle.paddingBottom, 0);  //use the margin bottom as an offset for our button Y positioning

        const rectPrimaryButton = primaryButton.getBoundingClientRect();
        const rectTrimCardContent = trimCardContent.getBoundingClientRect();

        showButtonResize = parseInt( rectTrimCardContent["bottom"] - (rectPrimaryButton['bottom'] + trimCardContentMarginPadding), 10);

        // if we havent moved the Button yet.....
        console.log((rectTrimCardContent["bottom"] -  rectPrimaryButton['bottom']) + " : " + trimCardContentMarginPadding);

        let offset =   parseInt( rectTrimCardContent["bottom"] - rectPrimaryButton['bottom'], 10);
 

        function getTranslateY(element) {
          const style = window.getComputedStyle(element);
          const matrix = style.transform || style.webkitTransform || style.mozTransform;

          if (matrix === 'none') return 0;

          const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ');
          const translateY = matrixValues.length === 6 ? parseFloat(matrixValues[5]) : parseFloat(matrixValues[13]);

          return translateY;
        }


        // Get the current translate Y value for the  
        const translateYValue = getTranslateY(primaryButton);

        if (offset != trimCardContentMarginPadding ) {
          containerButton.closest('.primary-button').style.transform  = 'translate(0px, ' + ( showButtonResize + translateYValue )  + 'px )';
        }

        photo.style.opacity =  0.0;
        disclaimer.style.opacity = 0.0;
        copy.style.opacity = 0.0;
        buildLinks.style.opacity =  0.0;
        carouselNavigation.style.opacity =  1.0;
        carouselNavigationText.style.opacity =  1.0;
        carouselNavigation.style.display =  'flex';
        carouselNavigation.style.pointerEvents =  'auto';
      }

      //update 'breakpoint' classification
      trimCard["breakpoint"] = currentBreakpoint;

      if (!trimCard['active-breakpoints'].includes(currentBreakpoint) ) { 
        console.log(currentBreakpoint + " not found in " + trimCard['active-breakpoints'] );
        trimCard['active-breakpoints'].push(currentBreakpoint); 
      }

      //only call flickity if we have it activated
      try {
        flkty.resize();
      } catch (error) {
        //console.log("flickity not active")
      } 
     }
   };



// FLICKITY 

  function flicktyUpdateNavText(indexStart, indexEnd, total) {

    console.log("indexStart: " +  indexStart + ' | indexEnd: '  + indexEnd  )

    // construct the current slides being shown...
    const slideNumbers = (indexStart != indexEnd ) ? indexStart + "-" + indexEnd : indexStart;

    carouselNavigationText.forEach(text =>  {

      text.innerText = slideNumbers + " of " + total + " matches";

    });
  }


  function flicktyChangeResize( _this, slide) {

    if(  (_this.selectedIndex + 1) == _this.slides.length) {

      let visibleCellsEnd = [];

      for(let i = 0; i < _this.selectedElements.length; i++) {

        visibleCellsEnd.push(_this.selectedElements[i].getAttribute('dataslide'));
      } 


      //if we are on mobile and only have 1 slide in view 
      if (visibleCellsChange.length == 1) {     
        flicktyUpdateNavText( (_this.selectedIndex + 1), _this.slides.length, _this.getCellElements().length);
        return;
      } 

      let visibleCellsPrevious = visibleCellsChange.length > 0 ? visibleCellsChange : visibleCellsStart;  //get the most recent set to compare against

      //are the sizes different? We could only have 1 activeCell in the visibleCellsEnd
      if (visibleCellsEnd.length < visibleCellsPrevious.length) {

        //console.log("visibleCellsEnd.length: " + visibleCellsEnd.length + " | visibleCellsPrevious.length: " + visibleCellsPrevious.length ); 

        for( let i = visibleCellsPrevious.length-1; i >= 1; i--) {
          //console.log("i: " +  visibleCellsPrevious[i]);
          visibleCellsEnd.unshift(visibleCellsPrevious[i]);
        }

        //console.log("visibleCellsEnd: " + visibleCellsEnd);
        flicktyUpdateNavText(visibleCellsEnd[0], visibleCellsEnd[visibleCellsChange.length - 1], _this.getCellElements().length);

      } else {

        // there is actually the same at the end active cells
        for(let i = 0; i < _this.selectedElements.length; i++) {
          visibleCellsChange.push(_this.selectedElements[i].getAttribute('dataslide'));
        } 

        //console.log( 'visibleCellsChange: ' + visibleCellsChange );
        flicktyUpdateNavText(visibleCellsChange[0], visibleCellsChange[visibleCellsChange.length - 1], _this.getCellElements().length);
      }

    } else {

      // we are not at the end
      visibleCellsChange = [];

      for(let i = 0; i < _this.selectedElements.length; i++) {
        visibleCellsChange.push(_this.selectedElements[i].getAttribute('dataslide'));
      } 

        //console.log( 'visibleCellsChange: ' + visibleCellsChange );
        flicktyUpdateNavText(visibleCellsChange[0], visibleCellsChange[visibleCellsChange.length - 1], _this.getCellElements().length );
    }
  }



  function flickityCarouselNavigation (_this) {

     //add or remove disable the previous
    if ( _this.selectedIndex == 0 ) { 
        addCarouselDisable(carouselPrevious); 
      } else {
        removeCarouselDisable(carouselPrevious);
    }

    //add or remove  disable the next
    if ( _this.selectedIndex == (_this.slides.length - 1) ) { 
      addCarouselDisable(carouselNext); 
    } else {
      removeCarouselDisable(carouselNext);          
    }
  }



  function flickityInit(elem, displaytext) {

    //default 
    const flickitySelectedAttraction = matchMedia('screen and (max-width: 768px)').matches ? 0.04 : 0.1;
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

            for(let i = 0; i < this.selectedElements.length; i++) {
              visibleCellsStart.push(this.selectedElements[i].getAttribute('dataslide'));
            } 

            //disable the first
            addCarouselDisable(carouselPrevious);

            if (this.slides.length === 1) { addCarouselDisable(carouselNext);  }  // if we are only at 1 slide
            flicktyUpdateNavText(visibleCellsStart[0], visibleCellsStart[visibleCellsStart.length - 1], this.getCellElements().length);

          },

          change: function(slide) {

            flicktyChangeResize(this, slide);
            flickityCarouselNavigation (this);
          },
          
          resize: function(slide) {
            
            flicktyChangeResize(this, slide);
            flickityCarouselNavigation (this);      
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
      'desktop' :  { 'collapsed' : 0 , 'expanded' : 712 ,  'containerButton' : document.querySelector('.trimcard-header-desktop .container-button')  },
      'tablet'  :  { 'collapsed' : 0 , 'expanded' : 651 ,  'containerButton' : document.querySelector('.trimcard-header-tablet .container-button') },
      'mobile'  :  { 'collapsed' : 0 , 'expanded' : 696 ,  'containerButton' : document.querySelector('.trimcard-header-mobile .container-button') },
    },
    'active-breakpoints' : []
  };


  trimCard['height1440'] =  { 'expanded' : 712 };   // 1440 height is 702 with the example cards
  trimCard['height1024'] =  { 'expanded' : 651 };   // 1024 height is 651 with the example cards
  trimCard['height640'] =   { 'expanded' : 696 };   //  640 height is 651 with the example cards

  const showTrimsBaseMobile  = document.querySelector('.trimcard-header-mobile  .primary-button');
  const showTrimsBaseDesktop = document.querySelector('.trimcard-header-desktop .primary-button');  
  const rect = showTrimsBaseDesktop.getBoundingClientRect();


  if (window.innerWidth >= 1440) { trimCard["breakpoint"] = "desktop" };
  if (window.innerWidth >= 640 && window.innerWidth < 1440 ) {  trimCard["breakpoint"] = "tablet" };  
  if (window.innerWidth < 640 ) {  trimCard["breakpoint"] = "mobile"  };  



  // expand / contract carousel 
  showTrimsButtons.forEach(showTrimsButton => {

    showTrimsButton.addEventListener("pointerdown", function (e) {

      //are we open or closed?
      const trimType = e.target.parentElement.getAttribute('data-type');  // desktop = tablet - mobile
      const svg = e.target.querySelector('.chevron-medium-14x8');
      svg.style.transform = 'rotate(180deg)';
      const path = svg.querySelector('.path-stroke');
      path.style.stroke = '#002C5E';

      const containerButton = e.target.querySelector('.container-button');
      const showTrimsBase = e.target.closest('.primary-button');
      const trimCardContent = document.querySelector('div.main .trimcard-content');  
      let heightType  =  trimCard['breakpoints'][trimType]['expanded'] + "px";


      let colLast; //default to desktop
      let colSupport ;
      let col1;
      let disclaimer; 


      switch (trimType) {
        case "desktop":
          colLast =  e.target.closest('.col3'); 
          colSupport = colLast.previousElementSibling;
          col1 = colSupport.previousElementSibling;
          disclaimer = colSupport.querySelector('.disclaimer');
          break;

        case "tablet":
          colLast =  e.target.closest('.col2');
          colSupport = e.target.closest('.col2');
          col1 = colSupport.previousElementSibling;
          disclaimer = col1.querySelector('.disclaimer');
          break;

        case "mobile":
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

      const carouselNavItems = {"text" : carouselNavigation.querySelector('.textdisplay')  , "button1" : carouselNavigation.getElementsByClassName('directional-selector-large-arrow')[0]  , "button2" : carouselNavigation.getElementsByClassName('directional-selector-large-arrow')[1]}

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


        //special title dissolve for mobile because the title moves
        if ( trimType == "mobile") {

          const titleCollapse = col1.querySelector('.mobile-collapse-title '); 
          const titleExpanded = col1.querySelector('.mobile-expanded-title '); 

          tl.to(titleCollapse, { opacity: 0, duration: 0.1667 }, 0.1);
          tl.to(titleExpanded, { opacity: 1, duration: 0.1667 }, 0.3);
        } 



        const rectTrimCardContent = trimCardContent.getBoundingClientRect();
        let showButtonY = trimCard['breakpoints'][trimType]['expanded'] - rectTrimCardContent['height'];  
        trimCard['breakpoints'][trimType]['collapsed'] = rectTrimCardContent['height']; 




        tl.to(showTrimsBase, {y: showButtonY, duration: 0.3, ease: CustomEase.create("custom", "M0,0 C0.217,0.796 0.47,1.02 1,1 ") }, 0.0 );
        tl.to(trimContent, {height: heightType , duration: 0.3, ease: CustomEase.create("custom", "M0,0 C0.217,0.796 0.47,1.02 1,1 ") },  0.0 );
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

        //clear our data object with value stored
        trimCard['breakpoints']['desktop']['collapse'] = trimCard['breakpoints']['tablet']['collapse'] = trimCard['breakpoints']['mobile']['collapse'] = 0;


      } else {

        trimCard['status'] = 'collapse';

        //update CTA button 
        containerButton.innerText  = trimCard['cta']['collapse'];
        const svg = e.target.querySelector('.chevron-medium-14x8');
        svg.style.transform = 'rotate(0deg)';
        const path = svg.querySelector('.path-stroke');
        path.style.stroke = '#fff';

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


        const trimCloseDelay =  trimCard['active-breakpoints'] == "mobile" ? 0.333 : 0.1;  //delay a little longer for mobile when closing for the 


        tl.to(trimContent, { height: 'auto', duration: 0.3, ease: CustomEase.create("custom", "M0,0 C0.217,0.796 0.47,1.02 1,1 ") }, trimCloseDelay );
        tl.to(showTrimsBase, { y: 0, duration: 0.3, ease: CustomEase.create("custom", "M0,0 C0.217,0.796 0.47,1.02 1,1 ") }, trimCloseDelay );
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
