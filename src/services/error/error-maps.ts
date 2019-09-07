const authErrorMap: any = {
    'auth/user-not-found': 'You have entered an invalid username or password.',
    'auth/wrong-password': 'You have entered an invalid username or password.',
    'auth/email-already-in-use': 'This email address is already in use. Please use another one.'
}

const forgotPasswordErrorMap: any = {
    'auth/user-not-found': 'An account with that email does not exist.',
}

export { authErrorMap, forgotPasswordErrorMap };