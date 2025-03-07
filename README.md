# IUS BSI Trim Carousel Prototype
#### _HTML - CSS - JS_
https://hyundai.innoceanusa.com/2025/bsi/trim-carousel-animation/index.html?fpo=0.2

The BSI Trim Carousel Prototype is an IUS development build to showcase, validate and detail the following topics

- Flickity carousel js framework 
- Trim card expand/collapse motion using GSAP 
- Button and link rollover motion using CSS
- Browser resizing behaviour and how it effect the trim cards
- Describe the UI element 'State banner' in relation to the motion 

The prototype uses static place holder images in a few places, such as the trim cards themselves.

🔥 **Important!** The prototype adheres the layout and design decisions based on the FIGMA FRs found here: https://www.figma.com/design/YJP3VOJkFpGVNGue98sboZ/%5BBSI.1%5D-MTS-Model-Cards-FRs?node-id=4178-387463&p=f&m=dev

🔥 **Important!** Both the filter rail and global header are FPO, placed in the prototype with the purpose to give the trim card better context.  Please reference the filter rail and global header FRs for full behaviors.

****

### HTML
###### Optional URL Query parameters to pass
https://hyundai.innoceanusa.com/2025/bsi/trim-carousel-animation/index.html?fpo=0.2
The FPO overlay can be seen with passing in the key 'fpo' with an opacity value such as '0.2'. The lower float value, the stronger the FPO overlay. `index.html?fpo=0.2`

https://hyundai.innoceanusa.com/2025/bsi/trim-carousel-animation/index.html?fpo=0.2&slides=3
Change the # of trim slides you want to view in the carousel by passing 'slides' with the amount. 7 is the max. `index.html?fpo=0.2&slides=3`

https://hyundai.innoceanusa.com/2025/bsi/trim-carousel-animation/index.html?fpo=0.2&vehiclename=TUCSON%20Plug-in%20Hybrid
Update the name of the trim vehicle with the 'vehiclename' key. `/index.html?fpo=0.2&vehiclename=TUCSON%20Plug-in%20Hybrid`

https://hyundai.innoceanusa.com/2025/bsi/trim-carousel-animation/index.html?fpo=0.2&statebanner=1
Visualize the behaviour of the state banner as described in the FRs by passing 'statebanner' wtih a value of 1. `/index.html?fpo=0.2&statebanner=1`


****

### Flickity JS
###### Touch, responsive flickable carousel
Install and Documentation can be found at : https://flickity.metafizzy.co/

##### Behaviours described and implemented in the prototype 
- The vehicle card expanded/collapse state should remain in the same state upon browser resize.
- Carousel navigation text and icon buttons should update themselves automatically upon browser resize.
- Expansion height of the vehicle card is based on the variable height of the trim cards inside.

##### Additional notes with our implementation of Flickity in the prototype. 
These are contained in the app.js file, but thought it would be beneficial to point them out.
>We are using different values for the 'selectedAttraction' & 'friction' properties, depending on browser width. These settings on mobile are slightly faster then for table or desktop.

```
 //determine our motion settings - depends on breakpoint area
const flickitySelectedAttraction = matchMedia('screen and (max-width: 768px)').matches ? 0.04 : 0.1;
const flickityFriction  = matchMedia('screen and (max-width: 768px)').matches ? 0.28 : 0.6;
```

>Setting 'cellAlign' to 'center' in Flickity will give us centered trim cards, which is necessary when we get a result of 1 or 2 trims. When the cards can fit in the viewport with no need for navigation, they will need to be centered.  An example can be seen when viewing the prototype with settings such as https://hyundai.innoceanusa.com/2025/bsi/trim-carousel-animation/index.html?fpo=0.3&slides=1
```
    cellAlign: 'center',
```

****

### GSAP
###### Javascript animation library
https://gsap.com/

Installation and Documentation can be found at: https://gsap.com/docs/v3/GSAP/ 

> Along with GSAP, we are also using the plugin 'CustomEase' found in the installation page.
You will need to register the plugin in JS before using it ( as seen below)
```
<script>
 // Register the CustomEase plugin
 document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(CustomEase)
  // gsap code here!
 });
</script>
```

##### Notes with our implementation of GSAP in the prototype. 

The GSAP motion library includes 'timelines'. These 'timelines' are utilized in the prototype to help manage a series of orchestrated motions, in particular to the expand and collapse motion.

As described in the 'Timeline' documentation at https://gsap.com/docs/v3/GSAP/Timeline
>A Timeline is a powerful sequencing tool that acts as a container for tweens and other timelines, making it simple to control them as a whole and precisely manage their timing. Without Timelines, building complex sequences would be far more cumbersome because you'd need to use a delay for every animation.

```
//Create a GSAP timeline to help organize our series of expand motions
const tl = gsap.timeline({paused: true});
```

CustomEase plugin allow us greater control on the motion curve. Documentation can be found here: https://gsap.com/docs/v3/Eases/CustomEase 
Below is a code snippet from the app.js file utilizing customEase
```
//expand animation for content and show-trim button using custom easing
tl.to(showTrimsBase, {y: showButtonY, duration: 0.3, ease: CustomEase.create("custom", "M0,0 C0.217,0.796 0.47,1.02 1,1 ") }, 0.0 );
tl.to(trimContent, {height: expansionHeight , duration: 0.3, ease: CustomEase.create("custom", "M0,0 C0.217,0.796 0.47,1.02 1,1 ") },  0.0 );
```

****

IUS - 3/6/2025
ddintzner@innoceanusa.com

