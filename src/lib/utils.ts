import { init } from "@paralleldrive/cuid2";

export const createId = init({ length: 10 });

export const jsonToUrlEncoded = (body: { [key: string]: string }) => {
	let formBody:string[] = [];
	Object.keys(body).forEach((key) => {
		const encodedKey = encodeURIComponent(key);
		const encodedValue = encodeURIComponent(body[key]);
		formBody.push(`${encodedKey}=${encodedValue}`);
	})
	return formBody.join("&");
};
