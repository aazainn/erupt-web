import {Inject, Injectable} from '@angular/core';
import {Bi, DimType} from "../model/bi.model";
import {DatePipe} from "@angular/common";
import {NzMessageService} from "ng-zorro-antd";

@Injectable({
    providedIn: 'root'
})
export class HandlerService {

    constructor(@Inject(NzMessageService)
                private msg: NzMessageService) {
    }

    private datePipe: DatePipe = new DatePipe("zh-cn");

    buildDimParam(bi: Bi, tip: boolean = true): object {
        let param = {};
        for (let dimension of bi.dimensions) {
            let val = dimension.$value;
            if (val) {
                switch (dimension.type) {
                    case DimType.DATE_RANGE:
                        val[0] = this.datePipe.transform(val[0], "yyyy-MM-dd");
                        val[1] = this.datePipe.transform(val[1], "yyyy-MM-dd");
                        break;
                    case DimType.DATETIME_RANGE:
                        val[0] = this.datePipe.transform(val[0], "yyyy-MM-dd HH:mm:ss");
                        val[1] = this.datePipe.transform(val[1], "yyyy-MM-dd HH:mm:ss");
                        break;
                    case DimType.DATE:
                        val = this.datePipe.transform(val, "yyyy-MM-dd");
                        break;
                    case DimType.DATETIME:
                        val = this.datePipe.transform(val, "yyyy-MM-dd HH:mm:ss");
                        break;
                    case DimType.TIME:
                        val = this.datePipe.transform(val, "HH:mm:ss");
                        break;
                    case DimType.YEAR:
                        val = this.datePipe.transform(val, "yyyy");
                        break;
                    case DimType.MONTH:
                        val = this.datePipe.transform(val, "yyyy-MM");
                        break;
                    case DimType.WEEK:
                        val = this.datePipe.transform(val, "yyyy-ww");
                        break;
                }
            }
            param[dimension.code] = val || null;
            if (dimension.notNull && !dimension.$value) {
                if (tip) {
                    this.msg.error(dimension.title + "必填");
                }
                return;
            }
            if (dimension.notNull && Array.isArray(dimension.$value)) {
                if (!dimension.$value[0] && !dimension.$value[1]) {
                    if (tip) {
                        this.msg.error(dimension.title + "必填");
                    }
                    return;
                }
            }
        }
        return param;
    }
}
