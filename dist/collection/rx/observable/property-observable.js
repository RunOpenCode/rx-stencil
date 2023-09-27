import { BehaviorSubject, distinctUntilChanged, } from "rxjs";
import { getPropertyDescriptor } from "../../utils";
/**
 * Returns an observable that emits property value when the component property value changes.
 */
export function propertyObservable(cmp, property) {
  let subjectProperty = `__rx__subject_for_property__${property}__`;
  if (!cmp[subjectProperty]) {
    let descriptor = getPropertyDescriptor(cmp, property);
    let previousSetter = descriptor.set;
    let previousGetter = descriptor.get;
    // we have to invoke previous getter on component instance to get the current value
    let currentValue = undefined !== previousGetter ? previousGetter.call(cmp) : descriptor.value;
    let subject = new BehaviorSubject(currentValue);
    descriptor.set = function (value) {
      if (previousSetter) {
        previousSetter.call(this, value);
      }
      subject.next(value);
    };
    Object.defineProperty(cmp, property, descriptor);
    cmp[subjectProperty] = subject;
  }
  return cmp[subjectProperty]
    .asObservable()
    .pipe(distinctUntilChanged());
}
//# sourceMappingURL=property-observable.js.map
