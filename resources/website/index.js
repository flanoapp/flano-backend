/**
 * define metrics for different window sizes
 */
const imageBottom = document.querySelector('#features').offsetTop;
const bigWindow = {
  header: { topHeight: 130, bottomHeight: 50, topMargin: 30, bottomMargin: 0, topScroll: 0, bottomScroll: 500 },
  image: { topHeight: 100, bottomHeight: 80, topMargin: 25, bottomMargin: 10, topScroll: 0, bottomScroll: imageBottom },
};
const mediumWindow = {
  header: { topHeight: 100, bottomHeight: 50, topMargin: 30, bottomMargin: 0, topScroll: 0, bottomScroll: 500 },
  image: { topHeight: 100, bottomHeight: 80, topMargin: 25, bottomMargin: 10, topScroll: 0, bottomScroll: imageBottom },
};
const smallWindow = {
  header: { topHeight: 40, bottomHeight: 40, topMargin: 0, bottomMargin: 0, topScroll: 0, bottomScroll: 200 },
  image: { topHeight: 80, bottomHeight: 50, topMargin: -20, bottomMargin: 0, topScroll: 0, bottomScroll: imageBottom },
};

const WIDTH = window.innerWidth;

/**
 * states
 * sizes: state for header and preview image based on windowSize
 * sections: state for section heights to calculate active section
 */
let sizes;
const getSizes = () => {
  sizes = WIDTH > 1200 ? bigWindow : WIDTH > 600 ? mediumWindow : smallWindow;
};

let navs, sections;
const getSections = () => {
  navs = Array.from(document.querySelectorAll('header a'));
  sections = Array.from(document.querySelectorAll('section')).map(e => ({
    id: e.id == 'hero' ? '' : e.id,
    top: e.offsetTop,
    bottom: e.offsetHeight + e.offsetTop,
  }));
};

/**
 * Event listeners for FAQ items
 */
const addFaqEventListeners = () => {
  const listItems = document.querySelectorAll('.list-header');

  for (let listItem of listItems) {
    listItem.addEventListener('click', function () {
      for (let li of listItems) {
        const content = li.nextElementSibling;

        if (li.isSameNode(this) && !li.classList.contains('active-about')) {
          li.classList.add('active-about');
          content.style.maxHeight = `${content.scrollHeight}px`;
        } else {
          li.classList.remove('active-about');
          content.style.maxHeight = null;
        }
      }
    });
  }
};

/**
 * hamburger menu
 */
const addHamburgerEventListeners = () => {
  const menuBtn = document.querySelector('.menu-btn');
  const header = document.querySelector('.header-wrapper');
  const nav = document.querySelector('nav');
  let menuOpen = false;

  const closeMenu = () => {
    menuBtn.classList.remove('open');
    header.classList.remove('nav-open');
    nav.style.maxHeight = null;
    menuOpen = false;
  };

  const hamburgerClick = () => {
    if (!menuOpen) {
      menuBtn.classList.add('open');
      header.classList.add('nav-open');
      nav.style.maxHeight = `${nav.scrollHeight}px`;
      menuOpen = true;
    } else {
      closeMenu();
    }
  };

  menuBtn.addEventListener('click', hamburgerClick);
  const navPoints = document.querySelectorAll('nav a, #logo');
  console.log(navPoints);

  for (let navPoint of navPoints) {
    navPoint.addEventListener('click', closeMenu);
  }
};

/**
 * Event listeners for features onhover
 */
const addPreviewImageEventlisteners = () => {
  const previewImagePath = 'images/preview/';
  const featureToImage = {
    entdecke: `${previewImagePath}preview_list_map.png`,
    erfahre: `${previewImagePath}preview_details_map.png`,
    teile: `${previewImagePath}preview_share.png`,
    touren: `${previewImagePath}preview_tours.png`,
  };

  const features = document.querySelectorAll('#features .grid p');
  const previewImage = document.querySelector('#features img');

  for (let feature of features) {
    feature.addEventListener('mouseover', function () {
      for (let p of features) {
        if (p.isSameNode(this)) {
          previewImage.setAttribute('src', featureToImage[this.id]);
          p.classList.add('active-preview');
        } else {
          p.classList.remove('active-preview');
        }
      }
    });
  }
};

/**
 * resizing of header and flano logo
 */
const resizeHeader = () => {
  const { topHeight, bottomHeight, topMargin, bottomMargin, topScroll, bottomScroll } = sizes.header;

  if (window.scrollY <= topScroll) {
    document.querySelector('header img').style.height = `${topHeight}px`;
    document.querySelector('header img').style.margin = `${topMargin}px 0`;
    document.querySelector('header').classList.remove('scrolling');
  } else if (window.scrollY <= bottomScroll) {
    const height = topHeight - ((window.scrollY - topScroll) / bottomScroll) * (topHeight - bottomHeight);
    const margin = topMargin - ((window.scrollY - topScroll) / bottomScroll) * (topMargin - bottomMargin);
    document.querySelector('header img').style.height = `${height}px`;
    document.querySelector('header img').style.margin = `${margin}px 0`;
    document.querySelector('header').classList.add('scrolling');
  } else {
    document.querySelector('header img').style.height = `${bottomHeight}px`;
    document.querySelector('header img').style.margin = `${bottomMargin}px 0`;
    document.querySelector('header').classList.add('scrolling');
  }
};

/**
 * resizing of preview image
 */

const resizePreviewImage = () => {
  const { topHeight, bottomHeight, topMargin, bottomMargin, topScroll, bottomScroll } = sizes.image;

  if (window.scrollY <= topScroll) {
    document.querySelector('#features img').style.height = `${topHeight}vh`;
    document.querySelector('#features img').style.top = `${topMargin}vh`;
    document.querySelector('#features img').classList.add('scrolling');
  } else if (window.scrollY < bottomScroll) {
    const height = topHeight - ((window.scrollY - topScroll) / bottomScroll) * (topHeight - bottomHeight);
    const margin = topMargin - ((window.scrollY - topScroll) / bottomScroll) * (topMargin - bottomMargin);
    document.querySelector('#features img').style.height = `${height}vh`;
    document.querySelector('#features img').style.top = `${margin}vh`;
    document.querySelector('#features img').classList.add('scrolling');
  } else {
    document.querySelector('#features img').style.height = `${bottomHeight}vh`;
    document.querySelector('#features img').style.top = 0;
    document.querySelector('#features img').classList.remove('scrolling');
  }
};

/**
 * highliting active section
 */
const toggleActiveSection = () => {
  let currentSection;
  if (window.innerHeight + window.scrollY >= document.body.height) {
    currentSection = sections[sections.length - 1].id;
  } else {
    const scroll = window.scrollY + window.innerHeight / 2;
    currentSection = sections
      .map(s => ({ id: s.id, inside: scroll >= s.top && scroll < s.bottom }))
      .filter(s => s.inside)[0].id;
  }
  for (let nav of navs) {
    if (nav.getAttribute('href') == `#${currentSection}`) {
      nav.classList.add('active-section');
    } else {
      nav.classList.remove('active-section');
    }
  }
};

// set states
getSizes();
getSections();

// add event listeners to FAQs, hamburger menu and preview image
addFaqEventListeners();
addHamburgerEventListeners();
addPreviewImageEventlisteners();

// update sizes and section heights on resize
window.addEventListener('resize', () => {
  getSizes();
  getSections();
});

window.addEventListener('scroll', () => {
  resizeHeader();
  resizePreviewImage();
  toggleActiveSection();
});
