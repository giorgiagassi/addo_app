import {DatePipe} from "@angular/common";
import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: "customDate",
  standalone: true
})
export class CustomDatePipe implements PipeTransform {
  constructor(private datePipe: DatePipe) {
  }

  transform(value: string | null): string {
    let dateAsString: string = "";
    try {
      dateAsString = value ? this.datePipe.transform(value?.toString()!.split("T")[0], "dd-MM-yyyy")!.toString() : "";
    } catch (e) {
      dateAsString = value ? this.datePipe.transform(new Date(value).toISOString()!.split("T")[0], "dd-MM-yyyy")!.toString() : "";
    }
    return dateAsString;
  }
}
