import { Observable } from 'rxjs';
export declare function mutationObservable(target: Node, options?: MutationObserverInit): Observable<MutationRecord[]>;
