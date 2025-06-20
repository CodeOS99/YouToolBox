// ==UserScript==
// @name        YouToolBox
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/watch*
// @version     1.0
// @author      -
// @description A userscript with many utility functions!
// @grant       none
// ==/UserScript==

(function () {
    'use strict';

    let menuHeld = false; // if the menu is held
    let menuOx = 0, menuOy = 0; // menu offset x and y

    // Wait until the page is fully ready to add stuff
    window.addEventListener('load', () => {
        makeMenuButton(); // make the menu button initially
    });

    function makeMenuButton() {
        let div = document.createElement('div');
        div.id = "main-menu"
        let btn = document.createElement('button');
        btn.id = 'main-menu-btn'

        btn.textContent = 'Show menu?';

        Object.assign(btn.style, {
            position: 'fixed',
            top: '80px',
            left: '20px',
            zIndex: 9999,
            padding: '10px',
            fontSize: '14px',
            background: '#f33',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'move',
        });

        btn.onmousedown = (e) => {
            menuHeld = true;
            menuOx = e.clientX - btn.offsetLeft;
            menuOy = e.clientY - btn.offsetTop;
            document.body.style.userSelect = 'none';
        }

        btn.onmouseup = () => {
            menuHeld = false;
        }

        btn.onmousemove = (e) => {
            if(menuHeld) {
                btn.style.left = (e.clientX - menuOx) + 'px';
                btn.style.top = (e.clientY - menuOy) + 'px';
            }
        }

        btn.onclick = () => {
            alert('You clicked the button!');
        };

        div.appendChild(btn);
        document.body.appendChild(div);

    }
})();
