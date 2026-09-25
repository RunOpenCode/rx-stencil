import { ComponentInterface } from '@stencil/core';
import {
    describe,
    it,
    expect,
}                             from '@stencil/vitest';
import { Subject }            from 'rxjs';
import { toProperty }         from '../../../rx';

describe('toProperty()', (): void => {

    it('Streams value into property.', async (): Promise<void> => {
        let cmp: ComponentMockWithProperty = new ComponentMockWithProperty();
        let subject: Subject<string>       = new Subject<string>();

        subject.pipe(toProperty(cmp, 'foo')).subscribe();

        expect(cmp.foo).toBe('');

        subject.next('bar');

        expect(cmp.foo).toBe('bar');
    });

    it('Streams value into property which is not defined.', (): void => {

        let cmp: ComponentMockWithoutProperty = new ComponentMockWithoutProperty();
        let subject: Subject<string>          = new Subject<string>();

        subject.pipe(toProperty(cmp, 'foo')).subscribe();

        expect((cmp as any).foo).toBe(undefined);

        subject.next('bar');

        expect((cmp as any).foo).toBe('bar');
    });
});

class ComponentMockWithoutProperty implements ComponentInterface {
    // noop.
}

class ComponentMockWithProperty implements ComponentInterface {
    public foo: string = '';
}