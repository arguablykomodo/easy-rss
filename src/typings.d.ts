declare module "*.pug" {
	const generator: (params: { [x: string]: unknown }) => string;
	export default generator;
}

interface Feed {
	name: string;
	url: string;
}

interface Entry {
	id: string;
	title: string;
	link: string;
	date: string;
	icon: string;
	author: string;
	thumbnail?: string;
}

type StorageValue = browser.storage.StorageValue;
