import { Injectable } from "@angular/core";
import { firebaseErrorMap } from './firebase-error-map';

/**
 * This service aims to translate error codes into human readable messages
 */
@Injectable()
export class ErrorService {

    firebaseError(errorCode: string) {
        if (errorCode in firebaseErrorMap) {
            return firebaseErrorMap[errorCode];
        } else {
            return "A Network Error Occured."
        }
    }
}
