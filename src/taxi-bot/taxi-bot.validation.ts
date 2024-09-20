import { ConstantsService } from '../constants/constants.service';
import { errorEmail, errorNumber } from './constatnts/message.constants';

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
		// const phoneRegex = /^(?:(?:\+?7|8)[- ]?)?(\(?\d{3}\)?[- ]?)?[\d\- ]{7,10}$/;
		const phoneRegex = /^((\+7)+([0-9]){10})$/;
		if (phoneRegex.test(phoneNumber)) {
			return true;
		}
		return errorNumber + ConstantsService.repeatInputText;
	}

	isEmail(email: string): true | string {
		const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;
		if (emailRegex.test(email)) {
			return true;
		}
		return errorEmail + ConstantsService.repeatInputText;
	}
}
