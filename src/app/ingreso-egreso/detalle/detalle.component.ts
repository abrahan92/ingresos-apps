import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { Subscription, pipe, Observable } from 'rxjs';
import { IngresoEgresoService } from '../ingreso-egreso.service';
import Swal from 'sweetalert2';
import { map, filter } from 'rxjs/operators';
import * as fromIngresoEgreso from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {

  items: IngresoEgreso[] = [];
  subscription: Subscription = new Subscription();
  subscriptionItem: Subscription = new Subscription();
  state: Observable<AppState>;

  constructor( private store: Store<fromIngresoEgreso.AppState>,
               public ingresoEgresoService: IngresoEgresoService ) { }

  ngOnInit() {
    this.subscription = this.store.select('ingresoEgreso')
              .subscribe( ingresoEgreso => {
                this.items = ingresoEgreso.items;
              });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  borrarItem(item: IngresoEgreso) {

    this.ingresoEgresoService.borrarIngresoEgreso(item.uid)
                             .then( resp => {
                              Swal.fire({
                                title: `Eliminado ${ item.descripcion }`,
                                type: 'success',
                                confirmButtonText: 'Continuar'
                              });
                             });
  }

}
