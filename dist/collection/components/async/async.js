import { h, Host, } from "@stencil/core";
import { from, isObservable, of, switchMap, } from "rxjs";
import { propertyObservable, setProperty, } from "../../rx";
export class Async {
  constructor() {
    this._value = null;
    this.value = null;
  }
  connectedCallback() {
    propertyObservable(this, 'value').pipe(switchMap((value) => {
      if (isObservable(value)) {
        return value;
      }
      if (value instanceof Promise) {
        return from(value);
      }
      return of(value);
    })).subscribe(setProperty(this, '_value', {
      scheduleRender: true,
      nextTick: false,
    }));
  }
  disconnectedCallback() {
    // noop
  }
  render() {
    return (h(Host, null, this._value));
  }
  static get is() { return "rx-async"; }
  static get originalStyleUrls() {
    return {
      "$": ["async.scss"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["async.css"]
    };
  }
  static get properties() {
    return {
      "value": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "AsyncValue",
          "resolved": "Observable<unknown> | Promise<unknown>",
          "references": {
            "AsyncValue": {
              "location": "local",
              "path": "/Users/thecelavi/Sites/RunOpenCode/stencil-libs/rx-stencil/src/components/async/async.tsx",
              "id": "src/components/async/async.tsx::AsyncValue"
            }
          }
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        },
        "defaultValue": "null"
      }
    };
  }
}
//# sourceMappingURL=async.js.map
