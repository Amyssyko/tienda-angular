import { ToastrService } from 'ngx-toastr';

export class Toast {
  messageType = {
    success: 'Ha sido agregado con éxito',
    delete: 'Se ha eliminado con éxito',
    error: 'Ha ocurrido algo, vuelve a intentarlo más tarde',
    update: 'Se ha actualizado con éxito',
    info: 'Datos obtenidos con éxito',
    warning: 'Se requiere que todos los campos estén llenos',
  };
  constructor(private toastr: ToastrService) {}

  showInfo(name: string) {
    this.toastr.info(name ? name : this.messageType.info);
  }

  showSuccess(name: string) {
    this.toastr.success(name ? name : this.messageType.success);
  }

  showDelete(name: string) {
    this.toastr.error(name ? name : this.messageType.delete);
  }

  showUpdate(name: string) {
    this.toastr.info(name ? name : this.messageType.update);
  }

  showError(name: string) {
    this.toastr.error(name ? name : this.messageType.error);
  }

  showWarning(name: string) {
    this.toastr.warning(name ? name : this.messageType.warning);
  }
}
