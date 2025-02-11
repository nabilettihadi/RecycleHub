export interface HomeStateInterface{
   authPopupShown : boolean;
   activeAuthForm : string;
   authErrors : { [key : string] : string}
}