import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatFileSize'
})
export class FormatFileSizePipe implements PipeTransform {
    transform(sizeInKB: number, longForm: boolean): string {


        let formattedUnit = 'KB';
        let formattedSize = Math.round(sizeInKB / 1024);

        if (formattedSize > 1024) {
            formattedSize = Math.round(formattedSize / 1024);
            formattedUnit = 'MB';
        }

        return `${formattedSize} ${formattedUnit}`;
    }
}
