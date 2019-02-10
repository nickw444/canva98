const $ = document.querySelector.bind(document);
const clockEl = $('.t');
const startEl = $('.n');
const canvasEl = $('.h');
const taskbarEl = $('.g');
const startButtonEl = $('.f');

let zIndex = 1;
let ghost = false;

function main() {
  initClock();
  initStart();
  window.addEventListener('keydown', ({key}) => {
    if (key === 'g') {
      ghost = !ghost;
    }
  })
}

class AppWindow {
  constructor(title, content, icon) {
    this.taskbarEl = createElement('button', undefined, {});
    this.taskbarEl.innerHTML = `<img src="${icon}" /> ${title}`;

    this.el = document.createElement('div');
    this.el.classList.add('i');
    this.el.innerHTML = `<header><div>${title}</div><button>x</button></header>`;
    content && this.el.appendChild(content);

    const closeButtonEl = this.el.querySelector('button');
    addClickListener(closeButtonEl, () => this.remove());

    const headerEl = this.el.querySelector('header');
    let offsetX, offsetY;
    const onMouseMove = (e) => {
      if (ghost) {
        const bg = this.el.cloneNode(true);
        canvasEl.insertBefore(bg, this.el);
      }
      this.el.style.transform = `translate(${e.clientX - offsetX}px,${e.clientY - offsetY}px)`;
    };
    headerEl.addEventListener('mousedown', (e) => {
      const elStart = this.el.getBoundingClientRect();
      offsetX = e.clientX - elStart.left;
      offsetY = e.clientY - elStart.top;
      window.addEventListener('mousemove', onMouseMove);
    });

    window.addEventListener('mouseup', () => {
      window.removeEventListener('mousemove', onMouseMove);
    });

    this.el.addEventListener('mousedown', () => this.activate());
    window.addEventListener('mousedown', (e) => {
      if (!this.el.contains(/** @type{HTMLElement} */(e.target))) {
        this.deactivate();
      }
    });

    addClickListener(this.taskbarEl, () => this.activate());
    this.activate();
  }

  remove() {
    this.el.remove();
    this.taskbarEl.remove();
  }

  deactivate() {
    this.el.classList.add('j');
    this.taskbarEl.classList.remove('b');
  }

  activate() {
    // Push this element to top of stack when active
    this.el.style.zIndex = zIndex++;
    this.el.classList.remove('j');
    this.taskbarEl.classList.add('b');
  }
}

function initClock() {
  const updateClock = () => {
    clockEl.innerText = new Date().toLocaleTimeString('en', {hour12: true});
  };
  window.setInterval(updateClock, 1000);
  updateClock();
}

function initStart() {
  addClickListener(startButtonEl, onStartClick);
  addClickListener($('.o'), runExport);
  addClickListener($('.s'), onShutdownClick);
  addClickListener($('.r'), onShutdownClick);
  addClickListener($('.q'), onIrfanviewClick);
  addClickListener($('.p'), onNotepadClick);

  // Close the start menu on click outside
  addClickListener(window, e => {
    if (!startEl.contains(e.target) && !startButtonEl.contains(e.target)) {
      toggleStart(false);
    }
  });
}

function onStartClick() {
  toggleStart();
}

function onNotepadClick() {
  toggleStart(false);
  const w = new AppWindow('Notepad', document.createElement('textarea'), 'i/e.png');
  canvasEl.appendChild(w.el);
  taskbarEl.appendChild(w.taskbarEl);
}

function onIrfanviewClick() {
  toggleStart(false);
  requestFile()
      .then(src => {
        const img = createElement('img', undefined, {src});
        const w = new AppWindow('IrfanView', img, 'i/b.png');
        canvasEl.appendChild(w.el);
        taskbarEl.appendChild(w.taskbarEl);
      });
}

function onShutdownClick() {
  toggleStart(false);
  taskbarEl.innerHTML = '';
  canvasEl.innerHTML = '';
}

/**
 * @param {?boolean=} visibility
 */
function toggleStart(visibility) {
  if (visibility != null ? visibility : startEl.classList.contains('c')) {
    startEl.classList.remove('c');
    startButtonEl.classList.add('b');
  } else {
    startEl.classList.add('c');
    startButtonEl.classList.remove('b');
  }
}

function runExport() {
  toggleStart(false);
  // Enqueue the export task so the UI can update to hide the start menu.
  window.requestAnimationFrame(() => {
    domtoimage.toPng(document.body).then((blob) => {
      const downloadLink = createElement('a', undefined, {
        href: blob, download: 'export.png'
      }, document.body);
      downloadLink.click();
      downloadLink.remove();
    });
  });
}

/**
 * @return {!Promise<string>}
 */
function requestFile() {
  return new Promise(resolve => {
    const fileEl = createElement('input', undefined, {
      type: 'file',
      accept: 'image/*',
    }, document.body);
    fileEl.addEventListener('change', (e) => {
      resolve(URL.createObjectURL(e.target.files[0]));
    });
    fileEl.click();
    fileEl.remove()
  })
}

/**
 *
 * @param {string} tag
 * @param {?Array<string>|undefined} classes
 * @param {!Object} attrs
 * @param {?Element=} dest
 * @return {!Element}
 */
function createElement(tag, classes, attrs, dest) {
  const el = document.createElement(tag);
  classes && el.classList.add(...classes);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  dest && dest.appendChild(el);
  return el;
}

/**
 * @param {?EventTarget|undefined} el
 * @param {!function(Event)} handler
 */
function addClickListener(el, handler){
  el.addEventListener('click', handler);
}

main();
