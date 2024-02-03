import { HttpHeaders } from "@angular/common/http"

export class RoleHeader {

    headers = new HttpHeaders({ 'loginType': 'moviepanda-admin' })
}