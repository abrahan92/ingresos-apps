import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import * as firebase from 'firebase';
import { User } from './user.model';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';
import { SetUserAction, UnsetUserAction } from './auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubscription: Subscription = new Subscription();
  private usuario: User;

  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private afDB: AngularFirestore,
              private store: Store<AppState> ) { }

  crearUsuario( nombre: string, email: string, password: string ) {

    this.store.dispatch(new ActivarLoadingAction());

    this.afAuth.auth
        .createUserWithEmailAndPassword(email, password)
        .then( resp => {

          const user: User = {
            uid: resp.user.uid,
            nombre: nombre,
            email: resp.user.email
          };

          this.afDB.doc(`${ user.uid }/usuario`)
              .set( user )
              .then( () => {
                this.router.navigate(['/']);
                this.store.dispatch(new DesactivarLoadingAction());
              });

          this.router.navigate(['/']);

        }).catch( error => {
          this.store.dispatch(new ActivarLoadingAction());
          Swal.fire({
            title: 'Error en el registro!',
            type: 'error',
            confirmButtonText: 'Continuar'
          });
        });

  }

  logIn( email: string, password: string) {

    this.store.dispatch(new ActivarLoadingAction());

    this.afAuth.auth
        .signInWithEmailAndPassword( email, password )
        .then( resp => {
            this.router.navigate(['/']);
            this.store.dispatch(new DesactivarLoadingAction());
        }).catch( error => {
            this.store.dispatch(new DesactivarLoadingAction());
            Swal.fire({
              title: 'Error en el login!',
              type: 'error',
              confirmButtonText: 'Continuar'
            });
        });
  }

  logOut() {
    this.router.navigate(['/login']);
    this.afAuth.auth.signOut();
    this.store.dispatch(new UnsetUserAction());
  }

  initAuthListener() {
    this.afAuth.authState.subscribe( (fbUser: firebase.User) => {
      if ( fbUser ) {
        this.userSubscription = this.afDB.doc(`${ fbUser.uid }/usuario`)
            .valueChanges()
            .subscribe( (userFirebase: any) => {
              const newUser = new User( userFirebase );
              this.store.dispatch(new SetUserAction(newUser));
              this.usuario = newUser;
            });
      } else {
        this.usuario = null;
        this.userSubscription.unsubscribe();
      }
    });
  }

  isAuth() {
    return this.afAuth.authState
               .pipe(
                  map( fbUser => {
                    if ( fbUser == null ) {
                      this.router.navigate(['/login']);
                    }
                    return fbUser != null;
                  })
               );
  }

  getUsuario() {
    return { ...this.usuario };
  }
}
