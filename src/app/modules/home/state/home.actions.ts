import { createAction } from "@ngrx/store";

export const showAuthPopup = createAction(
    "[Home] show auth popup"
)

export const hideAuthPopup = createAction(
    "[Home] hide auth popup"
)

export const showLoginForm = createAction(
    "[Home] show login form"
)

export const showRegisterForm = createAction(
    "[Home] show register form"
)

export const toggleAuthForm = createAction(
    "[Home] switch between auth forms"
)