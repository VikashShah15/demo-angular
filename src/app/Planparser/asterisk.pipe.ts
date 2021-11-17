import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'asterisk'
})
export class AsteriskPipe implements PipeTransform {

  transform(value: string, ...args: any[]): unknown {
    if (value === undefined) {
      return value;
    }
    if (args[0] === true) {
      return value;
    }
    else {
      const stringLength = value.length;
      return chunk('*'.repeat(stringLength), 5).join(' ');

    }
  }

}
function chunk(str, n): any {
  const ret = [];
  let i;
  let len;

  for (i = 0, len = str.length; i < len; i += n) {
    ret.push(str.substr(i, n));
  }

  return ret;
}
