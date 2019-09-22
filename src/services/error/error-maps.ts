const authErrorMap: any = {
    'auth/user-not-found': 'You have entered an invalid email address.',
    'auth/wrong-password': 'You have entered an invalid password.',
    'auth/email-already-in-use': 'This email address already exists. Please login.'
}

const forgotPasswordErrorMap: any = {
    'auth/user-not-found': 'An account with that email does not exist.',
}

export { authErrorMap, forgotPasswordErrorMap };