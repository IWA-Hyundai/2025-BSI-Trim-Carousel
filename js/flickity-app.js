 document.addEventListener('DOMContentLoaded', function() {


  console.log('Page has loaded!'); 

  const isVisibleInViewport = (element) => {
    const rect = element.getBoundingClientRect()
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      )
    }


  var elem = document.querySelector('.trim-carousel-flickity');
  

  //default 
  var flickitySelectedAttraction = 0.025;
  var flickityFriction = 0.28;


  // enable prev/next buttons at 768px
  if ( matchMedia('screen and (max-width: 768px)').matches ) {
    
    flickitySelectedAttraction = 0.1;
    flickityFriction = 0.6;

  } 


    var flkty = new Flickity( elem, {
      // options
      cellAlign: 'left',
      contain: true,
      prevNextButtons: false,
      pageDots : true,
      groupCells : 4,
      on: {
        ready: function() {
          console.log('Flickity ready');
          const carouselNavigationCopy = document.querySelector('.navigation .copy');
          carouselNavigationCopy.innerHTML =  1 + " of " + this.slides.length + " Trim Matches";
        }
      },

      //based on breakpoint
      selectedAttraction: flickitySelectedAttraction, // higher attraction and higher friction
      friction: flickityFriction, // faster transitions

    });



    const lastCarouselItem = document.querySelector('#lastitem');
    const back = document.querySelector('.back');
    var previousIndex = flkty.selectedIndex;



    flkty.on( 'change', function( index ) {

      console.log("index: " + index + " | flkty.slides.length:  " + flkty.slides.length);
      var delta = index - previousIndex; //what direction are we going
      console.log("delta: " + delta);


      console.log("flkty.selectedAttraction: " + flkty.selectedAttraction );
      console.log("flkty.friction: " + flkty.friction );


      const isVisible = lastCarouselItem.checkVisibility();
      let inview = isVisibleInViewport(lastCarouselItem);
      console.log("Last item visible: " + inview );

      const rect = firstitem.getBoundingClientRect()
      console.log( rect.left + " : " + rect.right);


      if (index == 0) {
        back.disabled = true;
        back.classList.add('disable-navigation');
      } else {
        back.disabled = false;
        back.classList.remove('disable-navigation');
      }
 
      if (index == flkty.slides.length -1 ) {
        next.disabled = true;
        next.classList.add('disable-navigation');
      } else {
        next.disabled = false;
        next.classList.remove('disable-navigation');
      }


      const carouselNavigationCopy = document.querySelector('.navigation .copy');
      carouselNavigationCopy.innerHTML =  (index + 1 )+ " of " + flkty.slides.length + " Trim Matches";
      previousIndex = index;


      const carouselTrims = document.querySelector('.trims');

      flkty.on( 'staticClick', function( event, pointer, cellElement, cellIndex ) {

        if ( typeof cellIndex == 'number' ) {
          flkty.selectCell( cellIndex );
        }

      });


      flkty.on( 'scroll', function() {

        var xMotion = (  flkty.x ) *  1/ (flkty.slides.length);
        console.log("xMotion: " + xMotion); 

        carouselTrims.style.backgroundPositionX = xMotion + "px"; 

        // flkty.slides.forEach( function( slide, i ) {
        //   var img = imgs[i];
        //   var x = ( slide.target + flkty.x ) * -1/3;
        //   img.style[ transformProp ] = 'translateX(' + x  + 'px)';
        // });

      });

    });



    
    back.addEventListener('pointerdown', (event) => {

      console.log("Current Slide : " + flkty.selectedIndex);

      if(flkty.selectedIndex != 0 ) {

         flkty.previous( true );
        }
    });


    const next = document.querySelector('.next');


    next.addEventListener('pointerdown', (event) => {

      console.log("Current Slide : " + flkty.selectedIndex);

      if(flkty.selectedIndex <  flkty.slides.length - 1) {

         flkty.next( true );
        }
        
    });



});
