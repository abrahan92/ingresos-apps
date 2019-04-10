
import * as fromUI from './shared/ui.reducer';
import * as fromAuth from '../app/auth/auth.reducer';
// import * as fromIngresoEgreso from './ingreso-egreso/ingreso-egreso.reducer';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {
    ui: fromUI.State;
    auth: fromAuth.AuthState;
    // ingresoEgreso: fromIngresoEgreso.IngresoEgresoState;
}

export const appReducers: ActionReducerMap<AppState> = {
    ui: fromUI.uiReducer,
    auth: fromAuth.AuthReducer,
    // ingresoEgreso: fromIngresoEgreso.ingresoEgresoReducer
};


