import { AuthStateInterface } from "../../modules/auth/models/auth.models";
import { HomeStateInterface } from "../../modules/home/models/home.models";

export interface AppState {
    home : HomeStateInterface,
    auth : AuthStateInterface
}