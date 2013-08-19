var PlainGallery = function(_elGallery) {

	//Selecting our node
	var elGallery = document.querySelector(_elGallery);
        
        //deactivate links in gallery
        var linksGallery = document.querySelectorAll('#galleryList a');
        for( var i = 0; i <  linksGallery.length; i++ ){
            linksGallery[i].addEventListener('click', function(e){
                e.preventDefault();
            });
        }
        
	elGallery.addEventListener("click", function(e) {

		if(e.target.tagName === 'IMG' || e.target.tagName === 'SPAN') { 
                        console.log( e.target.tagName );
                        e.preventDefault();
                    
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

			//Create image element
                        
			var linkSrc = e.target.parentNode.href;
			var largeImage = document.createElement('img');
			largeImage.id = 'largeImage';
			largeImage.src = linkSrc;
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

			}); //image has loaded

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

		} // target is an image

	}, false); //image is clicked

	function centerImage(theImage) {
		var myDifX = (window.innerWidth - theImage.width)/2;
		var myDifY = (window.innerHeight - theImage.height)/2;

		theImage.style.top = myDifY + 'px';
		theImage.style.left = myDifX + 'px';

		return theImage;
	}

};