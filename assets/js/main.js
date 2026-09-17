import { load } from './lib/store.js';
import { render } from './app/render.js';
import { bindEvents } from './app/events.js';
import { bootHash } from './app/router.js';

load();
bindEvents();
bootHash();
render();
