import { AbstractControl } from '@angular/forms';

export function DateValidator(control: AbstractControl) {
    if(control.value != null && control.value.length == 10){
        var day = Number(control.value.substr(0, 2)),
        month = Number(control.value.substr(3, 2)),
        year = Number(control.value.substr(6, 4));

        var date = new Date();
        date.setFullYear(year, month - 1, day);
        // month - 1 since the month index is 0-based (0 = January)

        if ( (date.getFullYear() == year) && (date.getMonth() == month - 1) && (date.getDate() == day) ){
            return null;
        }else{
            return {
                validate: false,
                message: 'Data Inválida'
            };
        }
    }else{
        return null;
    }
}
