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

    let showMenu = false;

    // Wait until the page is fully ready to add stuff
    window.addEventListener('load', () => {
        makeMenu(); // make the menu button initially
    });

    function makeMenu() {
        let div = document.createElement('div');
        div.id = "main-menu";
        Object.assign(div.style, {
            position: 'fixed',
            top: '80px',
            left: '20px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '1px',
            cursor: 'move', // Make the whole group feel draggable
            userSelect: 'none',
        });

        let mover = document.createElement('div');
        Object.assign(mover.style, {
            width: '50px',
            height: '50px',
            backgroundColor: '#444',  // make it visible
            marginLeft: '10px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
        });
        mover.textContent = 'Move';

        let main_menu_btn = document.createElement('button');
        main_menu_btn.id = 'main-menu-btn'

        main_menu_btn.textContent = 'Show menu?';

        Object.assign(main_menu_btn.style, {
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

        mover.onmousedown = (e) => {
            if(!menuHeld) {
                menuHeld = true;
                menuOx = e.clientX - div.offsetLeft;
                menuOy = e.clientY - div.offsetTop;
                document.body.style.userSelect = 'none';
            }
        }

        document.onmouseup = () => { // add the event listener to the body because there is a possibility for the mouse to move away from the button
            menuHeld = false;
        }

        document.onmousemove = (e) => {
            if(menuHeld) {
                div.style.left = (e.clientX - menuOx) + 'px';
                div.style.top = (e.clientY - menuOy) + 'px';
            }
        }

        main_menu_btn.onclick = () => {
            showMenu = true;
        };

        div.appendChild(mover);
        div.appendChild(main_menu_btn);
        document.body.appendChild(div);
    }
})();
