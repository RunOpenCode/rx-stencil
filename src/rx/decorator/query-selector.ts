import {
    ContentChild,
    ContentChildOptions,
}                      from './content-child';
import {
    ViewChild,
    ViewChildOptions,
} from './view-child';

export type QuerySelectorOptions = ViewChildOptions & {
    target?: 'view'
} | ContentChildOptions & {
    target: 'content'
}

export function QuerySelector<E extends Element = Element>(selector: string, options?: QuerySelectorOptions): any {
    if ('content' === options?.target) {
        return ContentChild<E>(selector, options);
    }
    
    return ViewChild<E>(selector, options);
}
