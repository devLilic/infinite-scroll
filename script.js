let images = [];
const clientId = '7tp6OWa5NN9yCWMkWbcXRjWHaDYXJlknhqetDMV4zuA'

let imagesToLoad = 4;
const imgContainer = document.getElementById('images-container');
const loader = document.getElementById('loader');

window.addEventListener('scroll', updateOnScroll);

let loadedImages = 0;
let firstLoad = true;

async function getImagesFromAPI() {
    // load less images on first load for a speed boost
    if (!firstLoad) {
        imagesToLoad = 15;
    }
    const apiURL = `https://api.unsplash.com/photos/random/?client_id=${clientId}&count=${imagesToLoad}`;
    try {
        const response = await fetch(apiURL);
        images = await response.json();
        generateImageDomElement();
        firstLoad = false;
    } catch (error) {
        console.log('API error: ' + error);
    }
}

function setAttributesToElement(element, attributes) {
    for (key in attributes) {

        // if data is null, do not create respective attribute
        if (!attributes[key]) {
            return;
        }

        element.setAttribute(key, attributes[key])
    }
}

function imageLoaded() {
    loadedImages++;
}

function generateImageDomElement() {
    for (let key in images) {
        let data = images[key];

        let link = createLinkTag(data);
        let image = createImgTag(data);
        image.addEventListener('load', imageLoaded);

        link.append(image);
        imgContainer.append(link);
    }
}

function createLinkTag(data) {
    const link = document.createElement('a');
    setAttributesToElement(link, {
        href: data.links.html,
        title: data.description,
        target: "_blank"
    });

    return link;
}

function createImgTag(data) {
    const image = document.createElement('img');

    setAttributesToElement(image, {
        src: data.urls.regular,
        alt: data.description,
    });

    return image;
}

function updateOnScroll() {
    if (window.innerHeight + window.scrollY > document.body.offsetHeight - 1000) {
        if (loadedImages === imagesToLoad) {
            loadedImages = 0;
            loader.hidden = true;
            getImagesFromAPI();
        }
    }
}

getImagesFromAPI();