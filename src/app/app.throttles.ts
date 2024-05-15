import {
	Resolvable,
	ThrottlerGenerateKeyFunction,
	ThrottlerGetTrackerFunction,
} from '@nestjs/throttler/dist/throttler-module-options.interface';

export const throttles: ThrottlesType = {
	send_message: {
		send_message: {
			ttl: 15,
			limit: 50,
		},
	},
	send_animation: {
		send_animation: {
			ttl: 300_000,
			limit: 10,
		},
	},

	send_photo: {
		send_photo: {
			ttl: 15,
			limit: 10,
		},
	},
	send_video: {
		send_video: {
			ttl: 60_000,
			limit: 35,
		},
	},
	send_audio: {
		send_audio: {
			ttl: 60_000,
			limit: 40,
		},
	},
	edit_message_text: {
		edit_message_text: {
			ttl: 30_000,
			limit: 100,
		},
	},
	edit_message_reply_markup: {
		edit_message_reply_markup: {
			ttl: 30_000,
			limit: 100,
		},
	},
};

export type ThrottlesType = Record<
	| 'send_message'
	| 'send_animation'
	| 'send_photo'
	| 'send_video'
	| 'send_audio'
	| 'edit_message_text'
	| 'edit_message_reply_markup',
	Record<string, ThrottlerMethodOrControllerOptions>
>;

interface ThrottlerMethodOrControllerOptions {
	limit?: Resolvable<number>;
	ttl?: Resolvable<number>;
	getTracker?: ThrottlerGetTrackerFunction;
	generateKey?: ThrottlerGenerateKeyFunction;
}
