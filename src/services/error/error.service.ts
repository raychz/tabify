import { Injectable } from "@angular/core";
import { firebaseErrorMap } from './firebase-error-map';

/**
 * This service aims to translate error codes into human readable messages
 */
@Injectable()
export class ErrorService {

    firebaseError(error: any) {
        if (error.code in firebaseErrorMap) {
            return firebaseErrorMap[error.code];
        } else {
            return "A Network Error Occured."
        }
    }
}
