import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of, take } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';

@Injectable({
  providedIn: 'root',
})
export class MembersService {
  baseUrl = environment.apiUrl;
  members: Member[] = [];
  paginatedResult: PaginatedResult<Member[]> = new PaginatedResult<Member[]>();

  constructor(private http: HttpClient) {}
  getMembers(page?:number, itemPerPage?:number) {
    let params = new HttpParams();
    if(page !== null && itemPerPage !== null){
    params = params.append('pageNumber', page.toString());
    params = params.append('pageSize', itemPerPage.toString());
    }

    return this.http
    .get<Member[]>(this.baseUrl + 'users', { observe: 'response', params })
    .pipe(
      map((response) => {
        this.paginatedResult.result = response.body;
        if (response.headers.get('Pagination') !== null) {
          this.paginatedResult.pagination = JSON.parse(
            response.headers.get('Pagination')
          );
        }
        return this.paginatedResult;
      })
    );
  }
  
  getMember(username: string) {
    const member = this.members.find((x) => x.username === username);
    if (member !== undefined) return of(member);
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }
  updateMember(member: Member) {
    return this.http.put(this.baseUrl + 'users', member).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = member;
      })
    );
  }
  setMainPhoto(photoId: number) {
    return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
  }
  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }
  // private getPaginatedResult<T>(url, params) {
  
  //     return this.http
  //       .get<Member[]>(this.baseUrl + 'users', { observe: 'response', params })
  //       .pipe(
  //         map((response) => {
  //           this.paginatedResult.result = response.body;
  //           if (response.headers.get('Pagination') != null) {
  //             this.paginatedResult.pagination = JSON.parse(
  //               response.headers.get('Pagination')
  //             );
  //           }
  //           return this.paginatedResult;
  //         })
  //       );
  //   }
  
    private getPaginationHeaders(pageNumber: number, pageSize: number) {
      let params = new HttpParams();
      params = params.append('pageNumber', pageNumber.toString());
      params = params.append('pageSize', pageSize.toString());
      return params;
    }
}
