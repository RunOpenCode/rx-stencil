import { ComponentInterface } from '../../stencil-public-runtime';
import { Observable } from 'rxjs';
export type AsyncValue = Promise<unknown> | Observable<unknown> | null | undefined;
export declare class Async implements ComponentInterface {
  value: AsyncValue;
  private _value;
  connectedCallback(): void;
  disconnectedCallback(): void;
  render(): any;
}
