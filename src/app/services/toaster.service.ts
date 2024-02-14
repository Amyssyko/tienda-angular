import { ToastrService } from 'ngx-toastr';

export class Toast {
  messageType = {
    success: 'Ha sido agregado con éxito',
    error: 'Se ha eliminado con éxito',
    info: 'Se ha actualizado con éxito',
    warning: 'Se requiere que todos los campos estén llenos',
  };
  constructor(private toastr: ToastrService) {}

  showSuccess(name: string) {
    this.toastr.success(name ? name : this.messageType.success);
  }

  showDelete(name: string) {
    this.toastr.error(name ? name : this.messageType.error);
  }

  showUpdate(name: string) {
    this.toastr.info(name ? name : this.messageType.info);
  }

  showError(name: string) {
    this.toastr.error(name ? name : this.messageType.error);
  }

  showWarning(name: string) {
    this.toastr.warning(name ? name : this.messageType.warning);
  }
}
