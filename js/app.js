
document.addEventListener("DOMContentLoaded", (event) => {

  gsap.registerPlugin(CustomEase);

  //search for any URL query parameters
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  //show the 'fpo' overlay graphics on the trim card if found
  if (typeof params["fpo"] !== 'undefined') {

    //change the opacity of ...
    document.querySelector("h1.FPOdisclaimer ").style.display = "block";
    document.querySelector("header.mobile").style.opacity = parseFloat(params["fpo"]);
    document.querySelector("header.desktop").style.opacity = parseFloat(params["fpo"]);
    document.querySelector(".subhead-mobile").style.opacity = parseFloat(params["fpo"]);
    document.querySelector(".subhead-desktop").style.opacity = parseFloat(params["fpo"]);
    document.querySelector(".filters-desktop").style.opacity = parseFloat(params["fpo"]);
  }

  //update the vehicle name for all placements if we passed in 'vehiclename'
  if (typeof params["vehiclename"] !== 'undefined') { 

    const vehicleNames = document.querySelectorAll(".vehicle-name");
    const vehicleNamesArray = Array.from(vehicleNames);

    //update every vehicle name placement
    vehicleNamesArray.forEach(el =>  {
      //prevent vehicle names with hyphens from line breaking
      var txt = params["vehiclename"] .replace(/-/g, '‑');
      el.innerText  = txt;
    });
  }

  //show the 'availability conflict' banner on the trim card if found
  if (params["statebanner"] == true) { 

    document.querySelector(".availability-conflict").style.display = 'flex';
  }


  //show the 'availability conflict' banner on the trim card if found
  if (params["statebanner"] == true) { 

    document.querySelector(".availability-conflict").style.display = 'flex';
  }


  if (typeof params["slides"] !== 'undefined') {

    const slides =  parseInt(params["slides"]) > 7 ? 7 : parseInt(params["slides"]);
    const carousel = document.querySelector('.trim-carousel-flickity'); 
    const carouselCells = carousel.querySelectorAll('.carousel-cell');
    const carouselCellsArray = Array.from(carouselCells);

    const carouselCellsRemove = carouselCellsArray.slice( slides );

    for(let i=0; i < carouselCellsRemove.length; i++) {
      carouselCellsRemove[i].remove();
    }

  }

  //remove the inline style of white on the body, used to avoid the FPO flicker 
  document.body.removeAttribute('style');

  // Using a single trim card as an example, so put together a single data object. 
  const trimCard = document.querySelector(".trimcard");  
  const trimCardTrims = 7; //placeholder dummy data - we have 7 static cards in the carousel


  var trimCardData = { 
    'vehicle' : trimCard.getAttribute('data-id'),
    'status' : 'collapse', 
    'breakpoint' : null,  
    'cta' : { 'collapse' : `Show ${trimCardTrims} Trims`, 'expanded' : `Hide ${trimCardTrims} Trims`},
      
     // 712, 651, 696 - hard lines
    'breakpoints' : {
      'desktop' :  { 'collapsed' : 0 , 'expanded' : undefined ,  'hideshowTrimsButton' : trimCard.querySelector('.trimcard-collapse-desktop .container-button')  },
      'tablet'  :  { 'collapsed' : 0 , 'expanded' : undefined ,  'hideshowTrimsButton' : trimCard.querySelector('.trimcard-collapse-tablet .container-button') },
      'mobile'  :  { 'collapsed' : 0 , 'expanded' : undefined ,  'hideshowTrimsButton' : trimCard.querySelector('.trimcard-collapse-mobile .container-button') },
    },

    'active-breakpoints' : []
  };


  // where are we on page load?
  if (window.innerWidth >= 1440) { trimCardData["breakpoint"] = "desktop" };
  if (window.innerWidth >= 640 && window.innerWidth < 1440 ) {  trimCardData["breakpoint"] = "tablet" };  
  if (window.innerWidth < 640 ) {  trimCardData["breakpoint"] = "mobile"  };  


  //card specific to Palisade - would be unique to each vehicle card
  const trimContent = document.querySelector('.trimcard-content');
  const showTrimsButtons = document.querySelectorAll(`[data-id="show-hide-trims"]`);


  //determine the expanded state height based on the current breakpoint 
  //Referecing the FRs, add margin, padding and element's height to determine the expansion height at that breakpoint
  // We can access this function for 
  // 1) type = 'top' : the top height of the trim card to determine the absolute top value for the 'trim-carousel-flickity' element
  // 2) type = 'trimcardContent' : the expansion height for the 'trimcard-content' 


  function getElementHeight(type, carousel, currentBreakpoint) {

    //get the height of the carousel trim cards
    const carouselCell = carousel.querySelector('.carousel-cell'); 
    const rect = carouselCell.getBoundingClientRect();
    let carouselCardHeight = parseInt(rect.height, 0); 

    //placeholder 1-line title-header heights -- they are variable, depending on content.  
    let desktopHeaderHeight = 88, tabletHeaderHeight = 66, mobileHeaderHeight = 66;
    //declare the show-hide-trim button with a default 1-line value of 44
    let desktopTrimsButtonHeight = 44, tabletTrimsButtonHeight = 44, mobileTrimsButtonHeight = 44;

    //find the true height of the vehicle header - includes year toggles and name
    switch (currentBreakpoint) {
      case 'desktop':

        const desktopHeader = trimContent.querySelector('.trimcard-collapse-desktop .vehicle-header'); 
        desktopHeaderHeight = desktopHeader.offsetHeight;
        const desktopShowTrims = trimContent.querySelector('.trimcard-collapse-desktop .ctas [data-id="show-hide-trims"]'); 
        desktopTrimsButtonHeight = desktopShowTrims.offsetHeight;

        break;

      case 'tablet':

        const tabletHeader = trimContent.querySelector('.trimcard-collapse-tablet .vehicle-header'); 
        tabletHeaderHeight = tabletHeader.offsetHeight;
        const tabletShowTrims = trimContent.querySelector('.trimcard-collapse-tablet .ctas [data-id="show-hide-trims"]'); 
        tabletTrimsButtonHeight = tabletShowTrims.offsetHeight;
        break;

      case 'mobile':

        const mobileHeaderCollapse = trimContent.querySelector('.trimcard-collapse-mobile .vehicle-header'); 
        const mobileHeaderH2Collapse = trimContent.querySelector('.trimcard-collapse-mobile  .mobile-expanded-title'); 

        //because our mobile vehicle name on expansion is an 'absolute' position, we will need to add it's height to the header's value
        mobileHeaderHeight = mobileHeaderCollapse.offsetHeight + mobileHeaderH2Collapse.offsetHeight;

        const mobileShowTrims = trimContent.querySelector('.trimcard-collapse-mobile .ctas [data-id="show-hide-trims"]'); 
        mobileTrimsButtonHeight = mobileShowTrims.offsetHeight;
        break;

      default:
        console.log("breakpoint not found")
        break;
    }

    //data object that details the elements found at each breakpoint
    const carouselCardsData  = { 

      // desktop margins 24px, padding 16px, top nav 88px, hide trims 44px
      'desktop' : { 'top' :  (24 + desktopHeaderHeight + 16), 'bottom'  : (16 + desktopTrimsButtonHeight + 24) },
      // tablet margins 16px, padding 16px, top nav 66px, hide trims 44px
      'tablet' : { 'top' :  (16 +  tabletHeaderHeight + 16), 'bottom'  : (16 +  tabletTrimsButtonHeight + 16) },
      // tablet margins 16px and 24px, padding 16px, top nav 70px, bottom nav 32, bottom hide trims 44px
      'mobile' : { 'top' :  (16 +  mobileHeaderHeight + 24), 'bottom'  : ( 16 +  32 + 16 + mobileTrimsButtonHeight + 16) }

    }


    //console.log("top: ", carouselCardsData[currentBreakpoint]['top']);

    if(type == 'top') {
      return carouselCardsData[currentBreakpoint]['top'] ;
    }

    if(type == 'bottom') {
      return carouselCardsData[currentBreakpoint]['bottom'] ;
    }

    if(type == 'trimcardContent') {

      //calculate the expansion height based on the top and bottom elements plus the height of carousel cell. 
      let expansionHeight = carouselCardsData[currentBreakpoint]['top']  + carouselCardHeight  + carouselCardsData[currentBreakpoint]['bottom'];
      return expansionHeight;
    }


  }




  //when the user expands the carousel, we save all breakpoints the user might encounter.
  //on collapse, we will go thru that array and reset the CSS back to its collapse state.
  function clearBreakpointCarousels() {

    //reset trim card to collapse state - go thru all saved breakpoints
    trimCardData['active-breakpoints'].forEach(breakpoint =>  {

      //console.log("clearBreakpointCarousels | currentBreakpoint: ", breakpoint);
      trimContent.removeAttribute('style');

      //update trims buttons to expanded state
      let hideshowTrimsButton = trimCardData["breakpoints"][breakpoint]['hideshowTrimsButton'] ;
      hideshowTrimsButton.innerText  = trimCardData['cta']['collapse'];

      hideshowTrimsButton.closest('.primary-button').classList.remove('secondary-button');
      hideshowTrimsButton.closest('.primary-button').removeAttribute('style');

      const svg = hideshowTrimsButton.parentElement.querySelector('.chevron-medium-14x8');
      svg.style.transform = 'rotate(180deg)';
      const path = svg.querySelector('.path-stroke');
      path.style.stroke = '#fff';
          
      let colLast, colSupport, col1, disclaimer; 

      //each breakpoint has a different markup structure do the layout variations. 
      //we  look at the following as mobile = 1 column, tablet = 2 columns, desktop = 3 columns.

      switch (breakpoint) {
        case "desktop":

          colLast =  hideshowTrimsButton.closest('.col3'); 
          colSupport = colLast.previousElementSibling;
          col1 = colSupport.previousElementSibling;
          disclaimer = colSupport.querySelector('.disclaimer'); 
          break;

        case "tablet":

          colLast =  hideshowTrimsButton.closest('.col2');
          colSupport = hideshowTrimsButton.closest('.col2');
          col1 = colSupport.previousElementSibling;
          disclaimer = col1.querySelector('.disclaimer'); 
          break;

        case "mobile":

          colLast = hideshowTrimsButton.closest('.col1');
          colSupport = hideshowTrimsButton.closest('.col1');
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

    trimCardData['active-breakpoints'] = []; //empty out any stored breakpoints

  }



  // RESIZE WINDOW LISTENER
  var prevWidth = window.innerWidth;

  window.onresize = function(event) { 

    var width = window.innerWidth;
    
    //if we are only resizing on the width of the browser
    if (width != prevWidth) {

      //console.log( width, " : ", prevWidth);
      const trimCardContent = document.querySelector('div.main .trimcard-content');

      prevWidth = window.innerWidth;
      //console.log("RESIZE : trimcard status: ", trimCardData['status'] );

      let currentBreakpoint;

      if (window.innerWidth >= 1440) {  currentBreakpoint = "desktop" };
      if (window.innerWidth >= 640 && window.innerWidth < 1440 ) { currentBreakpoint = "tablet" };  
      if (window.innerWidth < 640 ) {  currentBreakpoint= "mobile" }; 

      //update 'breakpoint' classification
      trimCardData["breakpoint"] = currentBreakpoint;

      //if we are no longer in the breakpoint and we are expanded, need to updated the cars
      if ( trimCardData['status'] == "expanded") {

        //adjust the main card container

        //we need to compute carousel height if we haven't already
        //the trim cards have been defined as having a variable height, each result could be different
        if ( trimCardData['breakpoints'][currentBreakpoint]['expanded'] === undefined) {

          trimCardData['breakpoints'][currentBreakpoint]['expanded'] = getElementHeight('trimcardContent', carousel, currentBreakpoint);
        }

        // we will need to get the height of the top card section to pass to the flickity-carousel
        carousel.style.top = getElementHeight('top', carousel, currentBreakpoint) + "px";
        
        trimCardData['breakpoints'][currentBreakpoint]['expanded'] = getElementHeight('trimcardContent', carousel, currentBreakpoint);
        trimContent.style.height = trimCardData["breakpoints"][currentBreakpoint]["expanded"] + "px";

        //update trims buttons to expanded state
        let hideshowTrimsButton = trimCardData["breakpoints"][currentBreakpoint]['hideshowTrimsButton'] ;
        hideshowTrimsButton.innerText  = trimCardData['cta']['expanded'];
        const svg = hideshowTrimsButton.parentElement.querySelector('.chevron-medium-14x8');
        svg.style.transform = 'rotate(180deg)';
        const path = svg.querySelector('.path-stroke');
        path.style.stroke = '#002C5E';

        hideshowTrimsButton.closest('.primary-button').classList.add('secondary-button');
       
        let colLast, colSupport, col1, disclaimer, trimShowHideButton, trimCardHeader;

        //each breakpoint has a different markup structure do the layout variations. 
        //we can look at the layout as mobile = 1 column, tablet = 2 columns, desktop = 3 columns.

        switch (currentBreakpoint) {
          case "desktop":
            trimCardHeader = hideshowTrimsButton.closest('.trimcard-collapse-desktop');
            colLast =  hideshowTrimsButton.closest('.col3'); 
            colSupport = colLast.previousElementSibling;
            col1 = colSupport.previousElementSibling;
            trimShowHideButton = document.querySelector('.trimcard-collapse-desktop .primary-button');  
            disclaimer = colSupport.querySelector('.disclaimer'); 
            break;

          case "tablet":
            trimCardHeader = hideshowTrimsButton.closest('.trimcard-collapse-tablet');
            colLast =  hideshowTrimsButton.closest('.col2');
            colSupport = hideshowTrimsButton.closest('.col2');
            col1 = colSupport.previousElementSibling;
            trimShowHideButton = document.querySelector('.trimcard-collapse-tablet .primary-button');  
            disclaimer = col1.querySelector('.disclaimer'); 
            break;

          case "mobile":
            trimCardHeader = hideshowTrimsButton.closest('.trimcard-collapse-mobile');
            colLast = hideshowTrimsButton.closest('.col1');
            colSupport = hideshowTrimsButton.closest('.col1');
            col1 = colSupport;
            trimShowHideButton = document.querySelector('.trimcard-collapse-mobile .primary-button');  
            disclaimer = col1.querySelector('.disclaimer'); 
            col1.querySelector('.mobile-collapse-title').style.opacity = 0.0;
            col1.querySelector('.mobile-expanded-title').style.opacity = 1.0;
            break;

          default:
            break;
        }


        //now we have the general layout from above, select the elements within
        const photo = colSupport.querySelector('.photo'); 
        const pricing = col1.querySelector('.pricing'); 
        const copy = col1.querySelector('.copy');   
        const buildLinks = colLast.querySelector('.build-inventory-links');
        const carouselNavigation = colLast.querySelector('.carousel-navigation'); 
        const carouselNavigationText = carouselNavigation.querySelector('.textdisplay'); 


        // <--- show-hide-trim button positionn STARTS HERE
        const rectShowHideButtonn = trimShowHideButton.getBoundingClientRect();
        const rectTrimCardContent = trimCardContent.getBoundingClientRect();

        //use the padding bottom as an offset for our button Y positioning
        const trimCardContentStyle = window.getComputedStyle(trimCardHeader);
        let trimCardContentMarginPadding = parseInt(trimCardContentStyle.paddingBottom, 0); 

        // calculate the botton position in relationship to the card' expansion state
        let showhideButtonYPos = parseInt( rectTrimCardContent["bottom"] - (rectShowHideButtonn['bottom'] + trimCardContentMarginPadding), 10);
  
        //return translate Y from an element's CSS transform
        function getTranslateY(element) {
          const style = window.getComputedStyle(element);
          const matrix = style.transform || style.webkitTransform || style.mozTransform;

          if (matrix === 'none') return 0;

          const matrixValues = matrix.match(/matrix.*\((.+)\)/)[1].split(', ');
          const translateY = matrixValues.length === 6 ? parseFloat(matrixValues[5]) : parseFloat(matrixValues[13]);
          return translateY;
        }

        // Get the current translate Y value for the  
        const translateYValue = getTranslateY(trimShowHideButton);
        const offset =   parseInt( rectTrimCardContent["bottom"] - rectShowHideButtonn['bottom'], 10);

        if (offset != trimCardContentMarginPadding ) {
          // appy to the show-hide-trim translation 
          hideshowTrimsButton.closest(`[data-id="show-hide-trims"]`).style.transform  = 'translate(0px, ' + ( showhideButtonYPos + translateYValue )  + 'px )';
        }
        //show-hide-trim button positionn ENDS HERE --->

        //special title dissolve for mobile because the title moves
        if ( trimCardData["breakpoint"] == "mobile") {

          const titleExpanded = col1.querySelector('.mobile-expanded-title '); 
          titleExpanded.style.height = 'auto';
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

      if (!trimCardData['active-breakpoints'].includes(currentBreakpoint) ) { 
        //console.log(currentBreakpoint, " not found in ", trimCardData['active-breakpoints'] );
        trimCardData['active-breakpoints'].push(currentBreakpoint); 
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
  // declare flickity 
  var flkty; 
  const carousel = document.querySelector('.trim-carousel-flickity'); 
  var carouselNext = document.querySelectorAll(`button a[data-value="next"]`);
  var carouselPrevious = document.querySelectorAll(`button a[data-value="previous"]`);
  const carouselNavigationText  = document.querySelectorAll('.carousel-navigation .textdisplay');

  carouselNext.forEach(el => el.addEventListener('click', event => {

    //what breakpoint nav are we clicking on?
    //console.log(event.target.parentElement.getAttribute("data-type"));
    flkty.next();
  }));

  carouselPrevious.forEach(el => el.addEventListener('click', event => {

    //what breakpoint nav are we clicking on?
    //console.log(event.target.parentElement.getAttribute("data-type"));
    flkty.previous();
  }));
 

  function addCarouselDisable(elements, imd) {

    elements.forEach(el =>  {

        //console.log(el.getAttribute("data-type"));
        el.classList.add("disable-a");
        el.parentNode.classList.add("disable-button");
        const path = el.querySelector("path");
        path.classList.add("disable-path");

    });
  }


  function removeCarouselDisable(elements) {

    elements.forEach(el =>  {
      
        //console.log(el.getAttribute("data-type"));
        el.classList.remove("disable-a");
        el.parentNode.classList.remove("disable-button");
        const path = el.querySelector("path");
        path.classList.remove("disable-path");
    });
  }



function flickityInit(elem, displaytext) {


  //determine our motion settings - dependes on breakpoint area
  const flickitySelectedAttraction = matchMedia('screen and (max-width: 768px)').matches ? 0.15 : 0.1;
  const flickityFriction  = matchMedia('screen and (max-width: 768px)').matches ? 0.75 : 0.6;

  function flicktyUpdateNavText(indexStart, indexEnd, total) {

    //console.log("indexStart: ",  indexStart, ' | indexEnd: ', indexEnd  )

    //do our cards all fit in the view without the need for a navigation?
    const totalCellsinView =  cellsPossibleInViewport();
    const navArrows = document.querySelectorAll('.directional-selector-large-arrow');

    if( totalCellsinView >= total) {

      //our viewport can view all the trim cards without the need for the navigation UI, so turn off
      navArrows.forEach(el => {
        el.style.display = 'none';
      });

      //update text that simplifies the messaging
      carouselNavigationText.forEach(text =>  {
        text.innerText = total + " matches";
      });

      return;
    }

    // construct the current slides being shown...
    const slideNumbers = (indexStart != indexEnd ) ? indexStart + "-" + indexEnd : indexStart;

    navArrows.forEach(el => {
      el.style.display = 'flex';
    });

    //update navigations 
    carouselNavigationText.forEach(text =>  {
      text.innerText = slideNumbers + " of " + total + " matches";
    });
  }


  //use to determine how many carousel trim cards can be seen in the viewport at 100% width
  function cellsPossibleInViewport() {

    const carouselCells = carousel.querySelectorAll('.carousel-cell');
    const trimcardContainer = document.querySelector('.trimcard');

    let carouselCelWidth = carouselCells[0].offsetWidth;
    let trimcardContainerWidth = trimcardContainer.offsetWidth;

    return Math.floor(trimcardContainerWidth/carouselCelWidth);
  }


  function flicktyNavigationLogic( _this ) {

    const totalCellsinView =  cellsPossibleInViewport();
    const currentSet = _this.selectedIndex ;
    const totalSlides = _this.getCellElements().length;

    //we will need to figure out the nav text, flickity out of the box won't give us everything
    let startIndex, endIndex;

    if (  totalCellsinView == 1 ) {
       //if we only have 1 trim inview 
      startIndex = endIndex = currentSet + 1;

    } else if ( (totalCellsinView * (currentSet + 1)) > totalSlides) {
      //if we are at the end, then go backwards to capture any possible cards in view
      startIndex = totalSlides - (totalCellsinView - 1);
      endIndex = totalSlides;

    } else {
       //else we are in a place where its not the end or a single card view
       startIndex = (currentSet * totalCellsinView) + 1 ;
       endIndex = (startIndex + (totalCellsinView - 1)) ;
    }

    const StartEndIndexes = [startIndex, endIndex];
    return StartEndIndexes;
  }



  //update the disable state of the carousel navigation
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


  flkty = new Flickity( elem, {
 
    cellAlign: 'left',
    contain: true,
    prevNextButtons: false,
    pageDots : false,
    groupCells : true,
    cellAlign: 'center',  
    on: {
      ready: function() {
        console.log('Flickity ready');
        let visibleCellsStart  = [];

        for(let i = 0; i < this.selectedElements.length; i++) {
          visibleCellsStart.push(this.selectedElements[i].getAttribute('dataslide'));
        } 

        //disable the first
        addCarouselDisable(carouselPrevious);

        //console.log("current set: ", (this.selectedIndex + 1), " | total elements in set: ", this.selectedElements.length, " | total slides: " +  this.getCellElements().length);

        if (this.slides.length === 1) { addCarouselDisable(carouselNext);  }  // if we are only at 1 slide
        flicktyUpdateNavText(visibleCellsStart[0], visibleCellsStart[visibleCellsStart.length - 1], this.getCellElements().length);

      },        

      change: function(slide) {

        const totalSlides = this.getCellElements().length;
        // construct the logic for the navigation text
        const startEndIndexes = flicktyNavigationLogic(this);

        flicktyUpdateNavText(startEndIndexes[0], startEndIndexes[1], totalSlides);
        flickityCarouselNavigation (this);          
      },
      
      resize: function(slide) {

        const totalSlides = this.getCellElements().length;
        // construct the logic for the navigation text
        const startEndIndexes = flicktyNavigationLogic(this);

        flicktyUpdateNavText(startEndIndexes[0], startEndIndexes[1], totalSlides);
        flickityCarouselNavigation (this);     
      },
    },

      //based on breakpoint
      selectedAttraction: flickitySelectedAttraction, // higher attraction and higher friction
      friction: flickityFriction, // faster transitions

    });
  }


  // SHOW - HIDE TRIM BUTTONS
  // expand / contract carousel the Palisade vehicle card 
  showTrimsButtons.forEach(showTrimsButton => {

    showTrimsButton.addEventListener("pointerdown", function (e) {

      //are we open or closed?
      const currentBreakpoint = e.target.parentElement.getAttribute('data-type');  // desktop = tablet - mobile
      const svg = e.target.querySelector('.chevron-medium-14x8');
      svg.style.transform = 'rotate(180deg)';
      const path = svg.querySelector('.path-stroke');
      path.style.stroke = '#002C5E';

      const hideshowTrimsButton = e.target.querySelector('.container-button');
      const showTrimsBase = e.target.closest('.primary-button');
      const trimCardContent = document.querySelector('div.main .trimcard-content');  
      
      let colLast, colSupport, col1, disclaimer; 

      //each breakpoint has a different markup structure do the layout variations. 
      //we  look at the following as mobile = 1 column, tablet = 2 columns, desktop = 3 columns.

      switch (currentBreakpoint) {
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

      const carouselNavItems = {"text" : carouselNavigation.querySelector('.textdisplay') , "navButtonLeft" : carouselNavigation.getElementsByClassName('directional-selector-large-arrow')[0]  , "navButtonRight" : carouselNavigation.getElementsByClassName('directional-selector-large-arrow')[1]}

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


      if (trimCardData['status'] === 'collapse') {

        trimCardData['status'] = 'expanded';

        //update CTA button text and styling
        hideshowTrimsButton.innerText  = trimCardData['cta']['expanded'];
        showTrimsBase.classList.add('secondary-button');
        
        //Create a GSAP timeline to help organize our series of expand motions
        const tl = gsap.timeline({paused: true});

        //the flickity carousel - will need to return the top offset for the placement
        carousel.style.display = 'inline';
        carousel.style.top = getElementHeight('top', carousel, currentBreakpoint) + "px";

        //carousel navigation to visible
        carouselNavigation.style.display =  'flex';  
        carouselNavigation.style.pointerEvents =  'auto';

        let mobileHeaderCollapseH2 = 0;

        //special title dissolve for mobile because the title moves
        if ( currentBreakpoint == "mobile") {

          const titleCollapse = col1.querySelector('.mobile-collapse-title '); 
          const titleExpanded = col1.querySelector('.mobile-expanded-title '); 
          mobileHeaderCollapseH2 = titleCollapse.querySelector('h2').offsetHeight; // use the height from the collapse h2

          tl.to(titleCollapse, { opacity: 0, duration: 0.1667 }, 0.1);
          tl.to(titleExpanded, { opacity: 1, duration: 0.333 }, 0.3);

        } 

        //we need to compute carousel height if we haven't already
        //the trim cards have been defined as having a variable height, each result could be different
        if ( trimCardData['breakpoints'][currentBreakpoint]['expanded'] === undefined) {

          trimCardData['breakpoints'][currentBreakpoint]['expanded'] = getElementHeight('trimcardContent', carousel, currentBreakpoint);
        }
        
        let expansionHeight  =  trimCardData['breakpoints'][currentBreakpoint]['expanded'] + "px";

        //animations to expand
        tl.to(pricing, { opacity: 0, duration: 0.2 }, 0);
        tl.to(buildInventoryLinks, { opacity: 0, duration: 0.2 },  0);
        tl.to(copy, {  opacity: 0, duration: 0.25 }, 0.1);
        tl.to(photo, { opacity: 0, duration: 0.1667 }, 0.1);
       
        tl.fromTo(photo, {scale: 1.0}, {  scale: 0.85, ease: CustomEase.create("custom", "M0,0 C0.611,0 0.176,1 1,1 "), duration: 0.2 }, 0.1);
        tl.to(disclaimer, { opacity: 0, duration: 0.1667 }, 0.1);


        // <--- show-hide-trim button position STARTS HERE
        const rectTrimCardContent = trimCardContent.getBoundingClientRect();
        let showButtonY = trimCardData['breakpoints'][currentBreakpoint]['expanded'] - rectTrimCardContent['height'] ;  
        trimCardData['breakpoints'][currentBreakpoint]['collapsed'] = rectTrimCardContent['height']; 

        //expand animation
        tl.to(showTrimsBase, {y: showButtonY,         duration: 0.3, ease: CustomEase.create("custom", "M0,0 C0.217,0.796 0.47,1.02 1,1 ") }, 0.0 );
        tl.to(trimContent, {height: expansionHeight , duration: 0.3, ease: CustomEase.create("custom", "M0,0 C0.217,0.796 0.47,1.02 1,1 ") },  0.0 );

        //animate trim cards on
        for(let i=0; i < carouselCards.length; i ++) {
          tl.fromTo(carouselCards[i], {opacity: 0.0}, { opacity: 1.00, duration: 0.2 }, 0.3 + ( (i + 0.2) * 0.115));
          tl.fromTo(carouselCards[i], {scale: 0.85}, {  scale: 1.00, duration: 0.235, ease: CustomEase.create("custom", "M0,0 C0.223,0 0.177,1 1,1 ") },  0.3 + ( (i + 0.2) * 0.115));
        }

        //carousel animation
        tl.to(carousel, {  opacity: 1, duration: 0.2 }, 0.25);
        tl.to(carouselNavigation, {  opacity: 1, duration: 0.5 }, 0.6);

        //trim navigation
        // previous - next position
        tl.fromTo(carouselNavItems["navButtonLeft"] , {x: 32.0}, { x: 0.0, duration: 0.25, ease: "circ.out" }, 0.75);
        tl.fromTo(carouselNavItems["navButtonRight"] , {x: -32.0}, { x: 0.0, duration: 0.25, ease: "circ.out" }, 0.75);

        // previous - next opacity
        tl.fromTo(carouselNavItems["navButtonLeft"].querySelector('.fff-solid') , {opacity: 1.0}, { opacity: 0.0, duration: 0.25 }, 0.8);
        tl.fromTo(carouselNavItems["navButtonRight"].querySelector('.fff-solid') , {opacity: 1.0}, { opacity: 0.0, duration: 0.25 }, 0.8);

        //text - opacity
        tl.fromTo(carouselNavItems["text"] , {opacity: 0.0}, { opacity: 1.0, duration: 0.33 }, 0.95);
        
        //play gs timeline
        tl.play();

        trimCardData['active-breakpoints'].push(currentBreakpoint); 
        flickityInit(mainCarousel, carouselNavItems["text"] );

        //clear our data object with value stored
        trimCardData['breakpoints']['desktop']['collapse'] = trimCardData['breakpoints']['tablet']['collapse'] = trimCardData['breakpoints']['mobile']['collapse'] = 0;


      } else {

        trimCardData['status'] = 'collapse';

        //update CTA button text and styling
        hideshowTrimsButton.innerText  = trimCardData['cta']['collapse'];
        const svg = e.target.querySelector('.chevron-medium-14x8');
        svg.style.transform = 'rotate(0deg)';
        const path = svg.querySelector('.path-stroke');
        path.style.stroke = '#fff';

        e.target.closest('.primary-button').classList.remove('secondary-button');

        //turn off the carousel Navigations so we can't accidently fire it
        carouselNavigation.style.pointerEvents =  'none';

        //when the GSAP timeline completes, call...
        function completeCollapse() {

          //remove flickity
          flkty.destroy();
          carousel.style.display = 'none';

          //remove all greensock's inline styles that were added
          gsap.set(trimContent, { clearProps: "all" });

          function removeDuplicates(data) {
            return [...new Set(data)];
          }

          //scrub thru the array to remove any duplicates that may have been added
          trimCardData['active-breakpoints'] =  removeDuplicates(trimCardData['active-breakpoints']);        

          //remove current breakpoint
          var index = trimCardData['active-breakpoints'].indexOf(currentBreakpoint);

          if (index !== -1) {
            trimCardData['active-breakpoints'].splice(index, 1);
          }

           // remove any instances of additional breakpoint carousels that could have been created on window resize
          clearBreakpointCarousels();
        }

        //Create a GSAP timeline to help organize our series of collapse motions
        const tl = gsap.timeline({paused: true, onComplete: completeCollapse});

        tl.to(carousel, { opacity: 0, duration: 0.35 }, 'start');
        tl.to(carouselNavigation, {  opacity: 0, duration: 0.35 }, 0.1);

        //delay a little longer for mobile when closing for the 
        const trimCloseDelay =   currentBreakpoint == "mobile" ? 0.333 : 0.1;  

        //animate back to the card's collapse state
        tl.to(trimContent, { height: 'auto', duration: 0.3, ease: CustomEase.create("custom", "M0,0 C0.217,0.796 0.47,1.02 1,1 ") }, trimCloseDelay );
        tl.to(showTrimsBase, { y: 0, duration: 0.3, ease: CustomEase.create("custom", "M0,0 C0.217,0.796 0.47,1.02 1,1 ") }, trimCloseDelay );
        tl.to(photo, {  opacity: 1, duration: 0.25, ease: CustomEase.create("custom", "M0,0 C-0.014,0.711 0.306,1 1,1 "), }, 0.45);
        tl.fromTo(photo,  {scale: 0.8}, {  scale: 1, duration: 0.25 }, 0.45);
        tl.to(photo, {  y: 0, duration: 0.15 }, 0.1);
        tl.to(copy, {  opacity: 1, duration: 0.33 }, 0.55);
        tl.to(disclaimer, {  opacity: 1, duration: 0.33 }, 0.45);
        tl.to(pricing, { opacity: 1, duration: 0.33 }, 0.55);
        tl.to(buildInventoryLinks, { opacity: 1, duration: 0.33 }, 0.55);

        if ( currentBreakpoint == "mobile") {
          // Because mobile has the vehicle name in a different place when collapse
          const titleCollapse = col1.querySelector('.mobile-collapse-title '); 
          const titleExpanded = col1.querySelector('.mobile-expanded-title '); 

          tl.to(titleCollapse, { opacity: 1, duration: 0.25 }, 0.55);
          tl.to(titleExpanded, { opacity: 0, duration: 0.2 }, 0.05);
        } 

        //play gs timeline
        tl.play();

      }
    });
  });
});
