import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { SetItemAction, UnsetItemAction } from './ingreso-egreso.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  ingresoEgresoListenerSubscription: Subscription = new Subscription();
  ingresoEgresoItemSubscription: Subscription = new Subscription();

  constructor( private afDB: AngularFirestore,
               public authService: AuthService,
               private store: Store<AppState>) { }

  initIngresoEgresoListener() {

    this.ingresoEgresoListenerSubscription = this.store.select('auth')
        .pipe(
          filter( auth => auth.user != null )
        )
        .subscribe( auth => this.ingresoEgresoItems(auth.user.uid));
  }

  cancelarSubscriptions() {
    this.ingresoEgresoListenerSubscription.unsubscribe();
    this.ingresoEgresoItemSubscription.unsubscribe();
    this.store.dispatch(new UnsetItemAction());
  }

  crearIngresoEgreso( ingresoEgreso: IngresoEgreso ) {

    const user = this.authService.getUsuario();
    return this.afDB.doc(`${ user.uid }/ingreso-egresos`)
             .collection('items').add({...ingresoEgreso});
  }

  borrarIngresoEgreso( uid: string ) {
    const user = this.authService.getUsuario();
    return this.afDB.doc(`${ user.uid }/ingreso-egresos/items/${ uid }`)
             .delete();
  }

  private ingresoEgresoItems( uid: string) {
    this.ingresoEgresoItemSubscription = this.afDB.collection(`${ uid }/ingreso-egresos/items`)
             .snapshotChanges()
             .pipe(
               map( docData => {
                 return docData.map( doc => {
                   return {
                     uid: doc.payload.doc.id,
                     ...doc.payload.doc.data()
                   };
                 });
               })
             )
             .subscribe( (coleccion: any[]) => {
               this.store.dispatch(new SetItemAction(coleccion));
             });
  }
}
