import { createSelector } from "@ngrx/store";
import { AppState } from "../../../core/store/app.state";


export const selectHomeState = (state : AppState) => state.home;

export const selectShownAuthPopup = createSelector(
    selectHomeState , 
    (state) => state.authPopupShown
)

export const selectActiveAuthForm = createSelector(
    selectHomeState , 
    (state) => state.activeAuthForm
)