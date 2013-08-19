var PlainGallery = function(_elGallery) {

    //Selecting our node
    var elGallery = document.querySelector(_elGallery);

    //deactivate links in gallery
    var linksGallery = document.querySelectorAll('#galleryList a');
    for (var i = 0; i < linksGallery.length; i++) {
        linksGallery[i].addEventListener('click', function(e) {
            e.preventDefault();
        });
    }

    //main event
    elGallery.addEventListener("click", function(e) {

        if (e.target.tagName === 'IMG' || e.target.tagName === 'SPAN') {
            e.preventDefault();

            var linkSrc = e.target.parentNode.href;

            createGalleryOverlay(linkSrc);
        }

    }, false);

    //helper functions
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

        largeImage.addEventListener('click', function() {
            if (elOverlay) {
                window.removeEventListener('resize', window, false);
                window.removeEventListener('scroll', window, false);
                elOverlay.parentNode.removeChild(elOverlay);
            }
        }, false)

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

    function showSpecificImage(_index) {
        createGalleryOverlay( extractImageUrl( _index ) );
    }
    function centerImage(_image) {
        var myDivX = (window.innerWidth - _image.width) / 2;
        var myDivY = (window.innerHeight - _image.height) / 2;

        _image.style.top = myDivY + 'px';
        _image.style.left = myDivX + 'px';

        return _image;
    }
    function extractImageUrl( _index ){
        var link = elGallery.children[_index].children[0];
        return link.href;
    }

    //PUBLIC INTERFACE
    return{
        showImageByIndex: function(_index) {
            showSpecificImage(_index);
        }
    };



};