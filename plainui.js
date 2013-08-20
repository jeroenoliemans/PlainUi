var PlainGallery = function(_elGallery) {

    var _galleryIndex = 0;
    
    //Selecting our node
    var elGallery = document.querySelector(_elGallery);

    //deactivate links in gallery
    var linksGallery = document.querySelectorAll('#galleryList a');
    for (var i = 0; i < linksGallery.length; i++) {
        linksGallery[i].addEventListener('click', function(e) {
            e.preventDefault();
        });
    }

    //Main event
    elGallery.addEventListener("click", function(e) {

        if (e.target.tagName === 'IMG' || e.target.tagName === 'SPAN') {
            e.preventDefault();

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

            centerImage(this);
            elOverlay.appendChild(largeImage);
        });
        
        //if more than one picture add controls
        if( elGallery.children.length > 1 ){
            createGalleryControls( elOverlay );
        }
        
        //overlay events
        largeImage.addEventListener('click', function() {
            if (elOverlay) {
//                window.removeEventListener('resize', window, false);
//                window.removeEventListener('scroll', window, false);
//                elOverlay.parentNode.removeChild(elOverlay);
                resetOverlay(elOverlay);
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

                centerImage(largeImage);
            }
        }, false);
    }
    //create slideshow navigation
    function createGalleryControls(_overlay){
        //add controls
        var prev = document.createElement('a');
        prev.id = "prev";
        prev.textContent = "prev";
        var next = document.createElement('a');
        next.id = "next";
        next.textContent = "next";
        _overlay.appendChild(prev);
        _overlay.appendChild(next);
        //add events
        prev.addEventListener('click', function(){
            _galleryIndex--;
            _galleryIndex = _galleryIndex === -1 ? elGallery.children.length-1 :_galleryIndex;
            resetOverlay(_overlay);
            showSpecificImage();
        }, false);
        next.addEventListener('click', function(){
            _galleryIndex++;
            _galleryIndex = _galleryIndex === elGallery.children.length ? 0 :_galleryIndex;
            resetOverlay(_overlay);
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
    function resetOverlay(_overlay){
        window.removeEventListener('resize', window, false);
        window.removeEventListener('scroll', window, false);
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