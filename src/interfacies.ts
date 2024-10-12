import { PermissionResolvable } from "discord.js";

export interface Auth {
	token: string,
	expireAt: number
}

export interface User {
	username: string,
	avatar?: string,
	banner?: string,
	id: string
}

export interface Notify {
	(title: string, message: string, duration?: number): void;
}
interface Tickets {
	[userId: string]: {
		username: string,
		avatar: string,
		tickets: {
			[id: string]: {
				content: string,
				madeAt: number,
				updateAt?: number
			}
		}
	}
}
interface Modules {
	/**
	 * The “join” module corresponds to the welcome message sent to a server channel
	 */
	join: {
		/**
		 * This corresponds to the channel ID, it is mandatory, if there is none, the module is inactive
		 */
		channelId: string;
		/**
		 * The custom message sent in the image, "$user" will be replaced with the member's username
		 */
		message?: string;
		/**
		 * The background of the image which will be sent to the channel
		 */
		background?: string;
	};
	/**
	 * The role id that will be given to the new server member
	 */
	autoroles?: {
		type: "human" | "bot",
		role: string
	}[];
	autonick?: {
		type: "role" | "join",
		value: string,
		role?: string
	}[]
	/**
	 * The “leave” module corresponds to the message sent to a room when a member leaves the server
	 */
	leave: {
		/**
		 * This corresponds to the channel ID, it is mandatory, if there is none, the module is inactive
		 */
		channelId: string;
		/**
		 * The custom message sent in the image, "$user" will be replaced with the member's username
		 */
		message?: string;
		/**
		 * The background of the image which will be sent to the channel
		 */
		background?: string;
	};
	/**
	 * This module allows you to send messages in a room defined by the moderators, it allows you to create a history of actions carried out on the server.
	 */
	log: string;
	/**
	 * The message moderation module
	 */
	automod: {
		/**
		 * The level of moderation. In classic mode only messages are moderated. In advance mode, messages and user names are moderated and if a member is banned on a server where the bot has activated this module in advanced mode, the member will be automatically expelled from the server that has arrived.
		 */
		defaultList?: true;
		/**
		 * The list of words that must be banned, the bot converts the words into Regexp if they are not already. These words are added manually by the server moderators
		 */
		words?: Array<string>;
		/**
		 * The role id "Ignore Automod" If a member there, it will not be affected by automod
		 */
		ignore: string;
	},
	/**
	 * This module allows you to automatically delete messages containing links
	 */
	link?: {
		/**
		 * Module status
		 */
		active: boolean;
		/**
		 * The role id "allow link" If a member is there, his messages will not be deleted if he puts links there
		 */
		ignore: string;
	};
	/**
	 * The leveling module
	 */
	levels: {
		/**
		 * The status of the module
		 */
		active: boolean;
		/**
		 * Contains the role id "noExp" When a member has this role, the bot does not give exp to the member
		 */
		ignore: string,
		channel?: string
	}
}

interface Commands {
	app: Array<{
		name: string,
		description?: string,
		model?: string,
		permissions?: PermissionResolvable | "Owner",
		category: "Misc" | "Moderation" | "Games",
	}>,
	prefix: {
		name: string,
		description?: string,
		model?: string,
		permissions?: PermissionResolvable | "Owner",
		category: "Misc" | "Moderation" | "Games"
	}[],
	disabled: string[],
	custom: {
		id: string
	}
}

export interface Guild {
	id: string,
	name: string,
	icon: string | null,
	banner: string | null,
	prefix: string,
	user: {
		id: string,
		avatar: string,
		banner: string,
		username: string
	},
	owner: {
		id: string,
		avatar: string,
		banner: string,
		username: string
	},
	channels: {
		id: string,
		name: string,
		parent: string,
		type: 0 | 1 | 2,
		permissions: number
	}[],
	modules: Modules,
	tickets: Tickets,
	roles: {
		id: string,
		name: string,
		color: string,
		permissions: string,
		position: number,
		icon: string | null
	}[],
	commands: Commands
	offer: "Premiums" | "Classic"
}

export class AddImageCanvas {
	private image: HTMLImageElement;

	constructor(imageUrl: string) {
		this.image = new Image();
		this.image.src = imageUrl;
	}

	public img(): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			this.image.onload = () => {
				resolve(this.image);
			};

			this.image.onerror = reject;
		});
	}
}

export interface DiscordGuild {
	banner: string | null,
	features: string[];
	icon: string | null,
	id: string,
	name: string,
	owner: boolean,
	permissions: number,
	permissions_new: string
}