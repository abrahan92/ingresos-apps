import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { User } from 'src/app/auth/user.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styles: []
})
export class NavbarComponent implements OnInit, OnDestroy {

  subscription: Subscription = new Subscription();
  nombre: string;

  constructor( private store: Store<AppState> ) { }

  ngOnInit() {
    this.subscription = this.store.select('auth')
              .pipe(
                filter( auth => auth.user != null )
              )
              .subscribe( auth => {
                this.nombre = auth.user.nombre;
              });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
