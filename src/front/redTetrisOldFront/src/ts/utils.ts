import { tetrisGameInformation } from "./tetris/tetris.ts";
import { username } from "./tetris/gameManagement.ts";

// adress
export const	address = import.meta.env.VITE_API_ADDRESS;

export const    postToApi = async (url: string, data: any) => {
	data.username = username;
	const fetched = await fetch(url, {
		method: 'POST', // Specify the HTTP method
		headers: {
			'Content-Type': 'application/json', // Set the content type to JSON
			'username': username || "", // Include the username
		},
		body: JSON.stringify(data), // Convert the data to a JSON string
	})

	if (!fetched.ok)
	{
		let errorData = await fetched.json();
		if (fetched.status === 401 && errorData.disconnect) {
			localStorage.clear();
		}
		throw {
			status: fetched.status,
			message: errorData.message || 'An error occurred',
		};
	}
	return fetched.json(); // Parse the JSON response if successful
}


export const    getFromApi = async (url: string) => {
	const   response = await fetch(url, {
		method: "GET", // Specify the HTTP method
		headers: {
			'username': username || "", // Include the username
		}
	});
	if (!response.ok) {
		const   errorData = await response.json();
		if (response.status === 401 && errorData.disconnect) {
			localStorage.clear();
		}
		throw new Error(response.statusText);
	}
	return response.json();
}

export const    resetGamesSocket = () => {
	tetrisGameInformation.getSocket()?.close();
	window.onbeforeunload = null;
}
