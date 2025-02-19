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


  const showTrimsButton = document.querySelector(`[data-id="show-trims"]`);
  const trimcard = document.querySelector(".trimcard-header-desktop");  
  const carousel = document.querySelector(".trim-carousel-flickity" ); 

  


const carouselNext = document.querySelector(`button a[data-value="next"]`);
const carouselPrevious = document.querySelector(`button a[data-value="previous"]`);


carouselNext.addEventListener("click", (event) => {

   flkty.next();

});



carouselPrevious.addEventListener("click", (event) => {

   flkty.previous();

});




  var trimCard = { 'status' : 'collapse',  'cta' : { 'collapse' : 'Show 7 Trims', 'expanded' : 'Hide 7 Trims'}  };
  //let trimCardHeight = { "collapse" : col3.offsetHeight, "expanded" : col3.offsetHeight + 340 };

  var flkty;  // declare flickity so we can use it in multiple places

  window.onresize = function(event) { 
    flkty.resize(); 
    //console.log("resize")
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



  showTrimsButton.addEventListener("click", function (e) {

    //are we open or closed?

    if (trimCard['status'] == 'collapse') {

      trimCard['status'] = 'expanded';

      //update CTA button 
      const containerButton = e.target.querySelector('.container-button');
      containerButton.innerText  = trimCard['cta']['expanded'];
      e.target.closest('.primary-button').classList.add('secondary-button');
      

      const col3 = e.target.closest('.col3'); 
      const buildInventoryLinks = col3.querySelector('.build-inventory-links');


      trimCard['height'] =  { 'collapse' : col3.offsetHeight, 'expanded' : 654 };  // 1920 height is 702


      const carouselNavigation = col3.querySelector('.carousel-navigation'); 

      const col2 = col3.previousElementSibling;
      const photo = col2.querySelector('.photo'); 
      const disclaimer = col2.querySelector('.disclaimer'); 

      const col1 = col2.previousElementSibling;
      const pricing = col1.querySelector('.pricing'); 
      const copy = col1.querySelector('.copy');  

      const tl = gsap.timeline({paused: true});

      carousel.style.display = 'inline';
      carouselNavigation.style.display =  'flex';
      carouselNavigation.style.pointerEvents =  'auto';

      tl.to(pricing, { opacity: 0, duration: 0.1 }, 'start');
      tl.to(buildInventoryLinks, { opacity: 0, duration: 0.1 }, 'start');
      tl.to(col3, { height: (trimCard['height']["expanded"] + "px"), duration: 0.3, ease: CustomEase.create("custom", "M0,0 C0.217,0.796 0.47,1.02 1,1 ") } );
      tl.to(copy, {  opacity: 0, duration: 0.25 }, 0.15);
      tl.to(photo, {  opacity: 0, duration: 0.25 }, 0.15);
      tl.to(disclaimer, {  opacity: 0, duration: 0.25 }, 0.2);
      tl.to(carousel, {  opacity: 1, duration: 0.5 }, 0.4);
      tl.to(carouselNavigation, {  opacity: 1, duration: 0.5 }, 0.5);

      tl.play();

      const textdisplay = carouselNavigation.querySelector('.textdisplay');
      flickityInit(document.querySelector('.main-carousel'), textdisplay );

    } else {

      trimCard['status'] = 'collapse';

      //update CTA button 
      const containerButton = e.target.querySelector('.container-button');
      containerButton.innerText  = trimCard['cta']['collapse'];
      e.target.closest('.primary-button').classList.remove('secondary-button');

      const col3 = e.target.closest('.col3'); 
      const buildInventoryLinks = col3.querySelector('.build-inventory-links');
      const carouselNavigation = col3.querySelector('.carousel-navigation'); 
      carouselNavigation.style.pointerEvents =  'none';

      const col2 = col3.previousElementSibling;
      const photo = col2.querySelector('.photo'); 
      const disclaimer = col2.querySelector('.disclaimer'); 

      const col1 = col2.previousElementSibling;
      const pricing = col1.querySelector('.pricing'); 
      const copy = col1.querySelector('.copy');  



      function completeCollapse() {
        flkty.destroy();
        carousel.style.display = 'none';
      }

      const tl = gsap.timeline({paused: true, onComplete: completeCollapse});

      tl.to(carousel, { opacity: 0, duration: 0.35 }, 'start');
      tl.to(carouselNavigation, {  opacity: 0, duration: 0.35 }, 0.1);
      tl.to(col3, { height: (trimCard['height']["collapse"] + "px"), duration: 0.3, ease: CustomEase.create("custom", "M0,0 C0.217,0.796 0.47,1.02 1,1 ") }, 0.25 );
      tl.to(photo, {  opacity: 1, duration: 0.25 }, 0.45);
      tl.to(copy, {  opacity: 1, duration: 0.25 }, 0.55);
      tl.to(disclaimer, {  opacity: 1, duration: 0.25 }, 0.6);
      tl.to(pricing, { opacity: 1, duration: 0.35 }, 0.65);
      tl.to(buildInventoryLinks, { opacity: 1, duration: 0.35 }, 0.65);
      tl.play();

    }

  });


 
});
