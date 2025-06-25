// IMPORTS ////////////////
// @ts-ignore
import  page from 'page';
// TETRIS
import { loadTetrisPage } from "../tetris/tetris.ts";

// Start the router
export const startRouter = () => {

	// ROOT
	page('/', () => loadTetrisPage("idle"));

	page("/settings", () => {
		loadTetrisPage("setting");
	});

	// 404
	page('*', () => {
		console.log("404 Not Found: " + document.location.pathname);
		page.show("/")
	});

	// start the router
	page();
}
