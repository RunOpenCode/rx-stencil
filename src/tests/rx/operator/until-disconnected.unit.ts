import { ComponentInterface } from '@stencil/core';
import {
    describe,
    it,
    expect,
}                             from '@stencil/vitest';
import { Subject }           from 'rxjs';
import { untilDisconnected }  from '../../../rx';

describe('untilDisconnected()', (): void => {

    it('Emits until disconnected.', async (): Promise<void> => {
        let cmp: ComponentMock          = new ComponentMock();
        let observable: Subject<number> = new Subject();
        let values: number[]            = [];

        observable
            .pipe(untilDisconnected(cmp))
            .subscribe((value: number): void => {
                values.push(value);
            });

        observable.next(1);
        observable.next(2);

        cmp.disconnectedCallback();

        observable.next(3);


        expect(values).toStrictEqual([1, 2]);
    });

});

class ComponentMock implements ComponentInterface {

    public disconnectedCallback(): void {
        // noop.
    }
}
