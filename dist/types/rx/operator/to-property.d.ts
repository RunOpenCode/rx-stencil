import { ComponentInterface } from '../../stencil-public-runtime';
import { MonoTypeOperatorFunction } from 'rxjs';
/**
 * Use this function to tap into a value stream and flush value to
 * component property. You may also use this function as subscription
 * function (function will detect that value is passed instead of
 * observable).
 */
export declare function toProperty<T = any>(cmp: ComponentInterface, property: string): MonoTypeOperatorFunction<T>;
