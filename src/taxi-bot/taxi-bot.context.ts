import { Context } from 'telegraf';
import { SceneContextScene, SceneSession, SceneSessionData } from 'telegraf/scenes';
import { SessionContext } from 'telegraf/session';

export interface TaxiBotContext extends Context {
	session: TaxiSession;
	scene: SceneContextScene<SessionContext<SceneSession<TaxiScenes>>>;
}

export interface TaxiSession {
	acceptedOrder: {
		orderId: string;
		passengerId: number;
	};
}

export interface TaxiScenes extends SceneSessionData {
	acceptedOrder: {
		orderId: string;
		passengerId: number;
	};
}
