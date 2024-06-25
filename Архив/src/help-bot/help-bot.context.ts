import { Context } from 'telegraf';
import { SceneContextScene } from 'telegraf/scenes';

export interface HelpBotContext extends Context {
	session: HelpBotSession;
	scene: SceneContextScene<Context>;
}

export interface HelpBotSession {}

export interface TaxiScenes {}
