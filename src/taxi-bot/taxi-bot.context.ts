import { Context } from 'telegraf';
import { SceneContextScene } from 'telegraf/scenes';

export interface TaxiBotContext extends Context {
	session: TaxiSession;
	scene: SceneContextScene<TaxiBotContext>;
}

export interface TaxiSession {}

export interface TaxiScenes {}
