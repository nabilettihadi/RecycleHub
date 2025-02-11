import { HomeStateInterface } from "../models/home.models";

export const initialHomeState : HomeStateInterface = { 
    authPopupShown : false ,
    activeAuthForm : "register",
    authErrors : {}
}