import {
    ContentChildren,
    ContentChildrenOptions,
} from './content-children';
import {
    ViewChildren,
    ViewChildrenOptions,
} from './view-children';

export type QuerySelectorAllOptions = ViewChildrenOptions & {
    target?: 'view'
} | ContentChildrenOptions & {
    target: 'content'
}

export function QuerySelectorAll<E extends Element = Element>(selector: string, options?: QuerySelectorAllOptions): any {
    if ('content' === options?.target) {
        return ContentChildren<E>(selector, options);
    }

    return ViewChildren<E>(selector, options);
}
