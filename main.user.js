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
    console.log("YTB Active!");

    // COLOURS
    const lightGray = '#A9A9A9';
    const darkRed = '#8B0000';
    const darkerRed = '#900C3F';

    let menuHeld = false; // if the menu is held
    let menuOx = 0, menuOy = 0; // menu offset x and y

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

        let topMenuDiv = document.createElement('div');
        Object.assign(topMenuDiv.style, {
            width: '200px',
            height: '50px',
            backgroundColor: '#444',  // make it visible
            marginLeft: '10px',
            borderRadius: '8px',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
        });

        let closeMenuBtn = document.createElement('button');
        closeMenuBtn.innerText = "X"
        Object.assign(closeMenuBtn.style, {
            top: '20px',
            left: '20px',
            width: '20px',
            zIndex: 9999,
            marginLeft: '10px',
            fontSize: '14px',
            background: 'red',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'move',
            fontSize: '10px',
        });

        let noteModeButton = document.createElement('button');
        noteModeButton.innerText = "NOTES"
        Object.assign(noteModeButton.style, {
            top: '80px',
            left: '20px',
            width: '50px',
            zIndex: 9999,
            marginLeft: '10px',
            fontSize: '14px',
            background: lightGray,
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'move',
            fontSize: '10px'
        });

        let calculatorModeBtn = document.createElement('button');
        calculatorModeBtn.innerText = "CALC."
        Object.assign(calculatorModeBtn.style, {
            top: '80px',
            left: '20px',
            width: '50px',
            zIndex: 9999,
            marginLeft: '10px',
            fontSize: '14px',
            background: lightGray,
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'move',
            fontSize: '10px'
        });

        let codeSandboxBtn = document.createElement('button');
        codeSandboxBtn.innerText = "CODE"
        Object.assign(codeSandboxBtn.style, {
            top: '80px',
            left: '20px',
            width: '50px',
            zIndex: 9999,
            marginLeft: '10px',
            marginRight: '10px',
            fontSize: '14px',
            background: lightGray,
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'move',
            fontSize: '10px'
        });

        topMenuDiv.appendChild(closeMenuBtn);
        topMenuDiv.appendChild(noteModeButton);
        topMenuDiv.appendChild(calculatorModeBtn);
        topMenuDiv.appendChild(codeSandboxBtn);

        let menuBtns = [noteModeButton, calculatorModeBtn, codeSandboxBtn];
        menuBtns.forEach(btn => {
            btn.addEventListener('mouseover', () => {
                btn.style.backgroundColor = 'gray';
            });            
            btn.addEventListener('mouseleave', () => {
                btn.style.backgroundColor = lightGray;
            });
        });

        closeMenuBtn.onmouseover = () => {
            closeMenuBtn.style.backgroundColor = darkRed;
        };            
        closeMenuBtn.onmouseleave = () => {
            closeMenuBtn.style.backgroundColor = 'red';
        };
        closeMenuBtn.onmousedown = () => {
            closeMenuBtn.style.backgroundColor = darkerRed;
        }

        let bottomMenuDiv = document.createElement('div');        
        Object.assign(bottomMenuDiv.style, {
            width: '200px',
            height: '50px',
            backgroundColor: '#444',
            marginLeft: '10px',
            borderRadius: '8px',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontFamily: 'sans-serif',
            resize: 'both',
            overflow: 'auto'
        });

        let noteInput = document.createElement('textarea');
        
        const buttonLabels = [
            '7', '8', '9', '/',
            '4', '5', '6', '*',
            '1', '2', '3', '-',
            '0', '.', '=', '+',
            'CLR', 'DEL'
        ];
        let calculatorBtns = [];

        let calculatorExpr = '';

        let calculatorDiv = document.createElement('div');
        Object.assign(calculatorDiv.style, {
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
        });

        let calcExprH1 = document.createElement('h1');
        calcExprH1.innerText = "0";
        Object.assign(calcExprH1.style, {
            backgroundColor: 'gray',
            borderRadius: '5px',
        })

        calculatorDiv.appendChild(calcExprH1);

        let calculatorBtnDiv = document.createElement('div');
        Object.assign(calculatorBtnDiv.style, {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 50px)',
            gap: '6px',
            padding: '10px',
            justifyContent: 'center',
            alignItems: 'center'
        });

        calculatorDiv.appendChild(calculatorBtnDiv);

        bottomMenuDiv.appendChild(calculatorDiv);

        for (let i = 0; i < buttonLabels.length; i++) {
            let btn  = document.createElement('button');
            btn.innerText = buttonLabels[i];

            Object.assign(btn.style, {
                backgroundColor: lightGray,
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                padding: '15px',
                fontSize: '16px',
                cursor: 'pointer',
                width: '50px',
                height: '50px',
            });

            btn.onmouseenter = () => {
                btn.style.backgroundColor = 'gray';
            }

            btn.onmouseleave = () => {
                btn.style.backgroundColor = lightGray
            }

            btn.onmouseup = () => {
                updateCalcExpr(btn.innerText);
            }

            calculatorBtnDiv.appendChild(btn);

            calculatorBtns.push(btn);
        }

        function updateCalcExpr(val) {
            if(val !== 'CLR' && val !== 'DEL' && val !== '=') {
                if(calculatorExpr !== '0') calculatorExpr += val;
                else calculatorExpr = val;
            }
            else if(val === 'CLR') calculatorExpr = '0';
            else if(val === 'DEL') {
                calculatorExpr = calculatorExpr.substring(0, calculatorExpr.length-1)
                if(calculatorExpr === '') {
                    calculatorExpr = '0';
                }
            }
            else if(val === '=') {
                if(!'+-/*.'.includes(calculatorExpr[calculatorExpr.length - 1])) {
                    try {
                        calculatorExpr = eval(calculatorExpr);
                    } catch(e) {
                        alert("You made an error in the expression!");
                        calculatorExpr = '0';
                    }
                }
            }

            calcExprH1.innerText = calculatorExpr;
        }

        let showCalculator = () => {
            calculatorDiv.style.display = 'flex'

            noteInput.style.display = 'none';
        }

        bottomMenuDiv.appendChild(noteInput);

        calculatorModeBtn.onmousedown = () => {
            showCalculator();
        }

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
            main_menu_btn.style.display = 'none';
            //mover.style.display = 'none';

            topMenuDiv.style.display = 'flex';
            bottomMenuDiv.style.display = 'flex';
            div.style.flexDirection = 'column';
        };

        div.appendChild(mover);
        div.appendChild(main_menu_btn);

        div.appendChild(topMenuDiv);
        div.appendChild(bottomMenuDiv);

        document.body.appendChild(div);
    }
})();
