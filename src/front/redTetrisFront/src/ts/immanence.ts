// Events & core
import { resetGamesSocket } from "./utils.ts";
import { startRouter } from "./page/router.ts";
import { language, imSetLanguage } from './imTexts/imTexts.ts';
import { loadTetrisPage } from "./tetris/tetris.ts";
import img_tetris_bkg from '/src/medias/images/zones/fond_test_tetris.png';
import { TCS } from "./TCS.ts";

export let zoneGame: HTMLElement | null = null;
export let contentTetris: HTMLElement | null = null;

export const setHtmlFront = () => {
	document.querySelectorAll('html, body').forEach((el) => {
		el.classList.add('m-0', 'h-full');
	});
	let app = document.querySelector<HTMLDivElement>('#app');
	if (app) {
		app.classList.add('h-full');

		app.innerHTML = `
<div name="zoneTetris" id="zoneTetris" class="${TCS.zoneTetris} ${TCS.zoneTetrisShadow}">
    <div id="contentTetris" class="w-full h-full absolute z-10 flex items-center justify-center"></div>
    <div id="bkgTetris" class="w-full h-full absolute z-0 flex items-start justify-center">
        <img src="${img_tetris_bkg}" class="w-[1024px] h-[1024px] object-none" />
    </div>
</div>

<div name="zoneGame" id="zoneGame" class="${TCS.zoneGame} hidden"></div>
  `
	}
}

// MAIN
export const main = () => {
	resetGamesSocket();
	imSetLanguage(language);
	startRouter();
	setHtmlFront();
	zoneGame = document.getElementById("zoneGame");
	contentTetris = document.getElementById("contentTetris");
	loadTetrisPage("idle")
}

main();
