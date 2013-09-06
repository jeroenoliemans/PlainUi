/**
 * 
 * @param {type} _elGallery
 * @returns {PlainGallery.showImageByIndex}
 */
var PlainGallery = function(_elGallery) {

    var _galleryIndex = 0;
    var _thumbNails = [];
    
    //Selecting our node
    var elGallery = document.querySelector(_elGallery);

    //deactivate links in gallery and add index
    var linksGallery = document.querySelectorAll('#galleryList a');
    for (var i = 0; i < linksGallery.length; i++) {
        //add index
        _thumbNails[i] = linksGallery[i];
        _thumbNails[i].setAttribute('data-index', i);
        //preventdefault
        linksGallery[i].addEventListener('click', function(e) {
            e.preventDefault();
        });
    }

    //Main event
    elGallery.addEventListener("click", function(e) {

        if (e.target.tagName === 'IMG' || e.target.tagName === 'SPAN') {
            e.preventDefault();
            _galleryIndex = e.target.parentNode.getAttribute('data-index');
            var linkSrc = e.target.parentNode.href;
            createGalleryOverlay(linkSrc);
        }

    }, false);

    //Main overlay function
    function createGalleryOverlay(_href) {
        var elOverlay = document.createElement('div');
        elOverlay.id = 'overlay';
        document.body.appendChild(elOverlay);

        //set up overlay styles
        elOverlay.style.position = 'absolute';
        elOverlay.style.top = 0;
        elOverlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
        elOverlay.style.cursor = 'pointer';

        //resize and position overlay
        elOverlay.style.width = window.innerWidth + 'px';
        elOverlay.style.height = window.innerHeight + 'px';
        elOverlay.style.top = window.pageYOffset + 'px';
        elOverlay.style.left = window.pageXOffset + 'px';

        var imageContainer = document.createElement('div');
        imageContainer.id = 'imageContainer';
        imageContainer.style.display = 'block';
        imageContainer.style.position = 'absolute';
        
        imageContainer.style.backgroundColor = 'transparent';

        var largeImage = document.createElement('img');
        largeImage.id = 'largeImage';
        largeImage.src = _href;
        largeImage.style.display = 'block';
        largeImage.style.position = 'absolute';

        //wait until the image has loaded
        largeImage.addEventListener('load', function() {

            //Resize if taller
            if (this.height > window.innerHeight) {
                this.ratio = window.innerHeight / this.height;
                this.height = this.height * this.ratio;
                this.width = this.width * this.ratio;
            }

            //Resize if wider
            if (this.width > window.innerWidth) {
                this.ratio = window.innerWidth / this.width;
                this.height = this.height * this.ratio;
                this.width = this.width * this.ratio;
            }

            //set containerwidth/height
            imageContainer.width = this.width;
            imageContainer.height = this.height + 40;

            centerImage(imageContainer);
            
            elOverlay.appendChild(imageContainer);
            imageContainer.appendChild(largeImage);
        });
        
        //if more than one picture add controls
        if( elGallery.children.length > 1 ){
            createGalleryControls( elOverlay, imageContainer );
        }
        
        //overlay events
        largeImage.addEventListener('click', function() {
            if (elOverlay) {
                resetOverlay(elOverlay, imageContainer);
            }
        }, false);

        window.addEventListener('scroll', function() {
            if (elOverlay) {
                elOverlay.style.top = window.pageYOffset + 'px';
                elOverlay.style.left = window.pageXOffset + 'px';
            }
        }, false);

        window.addEventListener('resize', function() {
            if (elOverlay) {
                elOverlay.style.width = window.innerWidth + 'px';
                elOverlay.style.height = window.innerHeight + 'px';
                elOverlay.style.top = window.pageYOffset + 'px';
                elOverlay.style.left = window.pageXOffset + 'px';

                centerImage(imageContainer);
            }
        }, false);
    }
    //create slideshow navigation
    function createGalleryControls(_overlay, _imageContainer){
        //add controls
        var prev = document.createElement('a');
        prev.id = "prev";
        prev.textContent = "prev";
        var next = document.createElement('a');
        next.id = "next";
        next.textContent = "next";
        _imageContainer.appendChild(prev);
        _imageContainer.appendChild(next);
        //add events
        prev.addEventListener('click', function(){
            _galleryIndex--;
            _galleryIndex = _galleryIndex === -1 ? elGallery.children.length-1 :_galleryIndex;
            resetOverlay(_overlay, _imageContainer);
            showSpecificImage();
        }, false);
        next.addEventListener('click', function(){
            _galleryIndex++;
            _galleryIndex = _galleryIndex === elGallery.children.length ? 0 :_galleryIndex;
            resetOverlay(_overlay, _imageContainer);
            showSpecificImage();
        }, false);
    }
    
    //create specfic overlay 
    function showSpecificImage() {
        createGalleryOverlay( extractImageUrl( _galleryIndex ) );
    }
    //center the image in the window
    function centerImage(_image) {
        var myDivX = (window.innerWidth - _image.width) / 2;
        var myDivY = (window.innerHeight - _image.height) / 2;

        _image.style.top = myDivY + 'px';
        _image.style.left = myDivX + 'px';

        return _image;
    }
    //get the image url by index
    function extractImageUrl( _index ){
        var link = elGallery.children[_index].children[0];
        return link.href;
    }
    //reset overlay
    function resetOverlay(_overlay, _imageContainer){
        window.removeEventListener('resize', window, false);
        window.removeEventListener('scroll', window, false);
        //TODO FIX
        _imageContainer.parentNode.removeChild(_imageContainer);
        _overlay.parentNode.removeChild(_overlay);
    }

    //PUBLIC INTERFACE
    return{
        showImageByIndex: function(_index) {
            _galleryIndex = _index;
            showSpecificImage();
        }
    };
};




var PlainAccordion = function(_elAccordion) {
    //TODO add acordion functionality
    var _openSection = 0;
    //store for reference
    var dtArray = [];
    var ddArray = [];
    //Selecting our node
    var elAccordion = document.querySelector(_elAccordion);

    //constructor
    (function createAccordion(){
        //add index to dt's
        var dt = elAccordion.querySelectorAll('dt');
        for( var j = 0; j < dt.length; j++ ){
            dtArray[j] = dt[j];
            dtArray[j].style.cursor = "pointer";
            dtArray[j].setAttribute('data-index', j);
            dtArray[j].setAttribute('data-show', "false");
        }
        //close all dd's
        var dd = elAccordion.querySelectorAll('dd');
        for(var i = 0; i < dd.length; i++){
            ddArray[i] = dd[i];
            //hide
            ddArray[i].classList.add('slideUp');
        }
    })();

    //Main event
    elAccordion.addEventListener("click", function(e) {
        if (e.target.tagName === 'DT' ) {
            showSpecificSection( e.target.getAttribute( 'data-index' ) );
        }

    }, false);

    //helper functions
    function showSpecificSection(_index) {
        if( dtArray[_index].getAttribute('data-show') === "false" ){
            ddArray[_index].classList.remove('slideUp');
            ddArray[_index].classList.add('slideDown');
            dtArray[_index].setAttribute('data-show', true);
        }else{
            ddArray[_index].classList.remove('slideDown');
            ddArray[_index].classList.add('slideUp');
            dtArray[_index].setAttribute('data-show', false);
        }
    }
    function hideAllSections(){
        for( var i = 0; i < ddArray.length; i++  ){
            ddArray[i].style.display = 'none';
        }
    }
 
    //PUBLIC INTERFACE
    return{
        showSectionByIndex: function(_index) {
            _openSection = _index;
            showSpecificSection();
        }
    };
};


var PlainSlider = function(_elSlider) {
    
    var slideTimer;
    var elSlider = document.querySelector(_elSlider);
    var slideArray = elSlider.children;
    var _currentSlide = 0;

    //constructor
    (function createSlider(){
        //set essentials styles
        elSlider.style.position = 'relative';
        for( var i = 0; i < slideArray.length; i++ ){
            slideArray[i].style.position = 'absolute';
            slideArray[i].style.zIndex = slideArray.length - i;
        }
        startTimer();
    })();
    
    function startTimer(){
        slideTimer = setInterval(updateSlider, 2000 );
    }
    
    function updateSlider(){
        nextSlide();
    }
    function showSlide(){
        if(_currentSlide >= slideArray.length){
            _currentSlide = 0;
        }
        
        
        slideArray[_currentSlide].style.zIndex = slideArray.length;
         for( var i = 0; i < slideArray.length; i++ ){
             if( i !== _currentSlide ){
                slideArray[i].style.zIndex = slideArray.length - i;
             }
        }
    }

    //helper functions
    function nextSlide() {
       _currentSlide++;
        showSlide();
    }
    function prevSlide(){
       _currentSlide--;
       showSlide();
    }
 
    //PUBLIC INTERFACE
    return{
        showSlideByIndex: function(_index) {
            _openSection = _index;
        }
    };
};










