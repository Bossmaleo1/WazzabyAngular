import {NativeDateAdapter} from '@angular/material';


export class MyDateAdapter extends NativeDateAdapter {
  parse(value: any): Date | null {
    if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
      const str = value.split('/');
      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);
      return new Date(year, month, date);
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }

  format(date: Date, displayFormat: any): string {
    if (displayFormat == "input") {
      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      console.log(day);
      return day + '/' + month + '/' + year;
    } else {
      const mois = +date.getMonth()+1;
      const stringdate = date.getDate() +"-"+ mois+ "-" +date.getFullYear();
      return stringdate;
    }
  }
}
