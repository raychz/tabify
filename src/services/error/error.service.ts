import { Injectable } from "@angular/core";
import { authErrorMap, forgotPasswordErrorMap } from './error-maps';

/**
 * This service aims to translate error codes into human readable messages
 */
@Injectable({ providedIn: 'root' })
export class ErrorService {

    authError(error: any) {
        if (error.code in authErrorMap) {
            return authErrorMap[error.code];
        } else {
            return "A Network Error Occurred."
        }
    }

    forgotPasswordError(error: any) {
        if (error.code in forgotPasswordErrorMap) {
            return forgotPasswordErrorMap[error.code];
        } else {
            return "A Network Error Occurred."
        }
    }
}
