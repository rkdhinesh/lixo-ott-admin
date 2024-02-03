import { HttpHeaders } from "@angular/common/http";

export class BoxOfficeHeader {

    headers = new HttpHeaders({ 'loginType': 'moviepanda-box-office' })
}