import { ConstantsService } from '../constants/constants.service';
import { errorNumber } from './constatnts/message.constants';

export class TaxiBotValidation {
	checkMaxMinLengthString(value: string, min: number, max: number): true | string {
		const validate = value.length <= max && value.length >= min;
		if (validate) {
			return true;
		}
		return (
			ConstantsService.STRING_LENGTH_ERROR('строки', min, max) + ConstantsService.repeatInputText
		);
	}

	isPhone(phoneNumber: string): true | string {
		const phoneRegex = /^(?:(?:\+?7|8)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d\- ]{7,10}$/;
		if (phoneRegex.test(phoneNumber)) {
			return true;
		}
		return errorNumber + ConstantsService.repeatInputText;
	}
}
