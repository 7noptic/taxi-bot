import { Context } from 'telegraf';
import { SceneContextScene } from 'telegraf/scenes';
import { Passenger } from '../passenger/passenger.model';
import { Driver } from '../driver/driver.model';
import { UserType } from '../types/user.type';

export interface TaxiBotContext extends Context {
	session: TaxiSession;
	scene: SceneContextScene<Context>;
}

export interface TaxiSession {
	user: Passenger | Driver;
	userType: UserType;
}

export interface TaxiScenes {}
