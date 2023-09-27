import { ComponentInterface } from '../../stencil-public-runtime';
export type SetPropertyOptions = {
  /**
   * Whether to schedule a render of the component after the
   * property is updated. By default, this value is set to
   * `false`, assuming that the property is annotated with
   * either @State or @Prop decorator.
   */
  scheduleRender?: boolean;
  /**
   * Whether to schedule a render of the component on the next
   * tick. By default, this value is set to `true`.
   */
  nextTick?: boolean;
};
export declare function setProperty<T = any>(cmp: ComponentInterface, property: string, options?: SetPropertyOptions): (value: T) => void;
