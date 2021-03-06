var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/*
 * Copyright (C) 2015 Apple Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * 1. Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE INC. AND ITS CONTRIBUTORS ``AS IS''
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL APPLE INC. OR ITS CONTRIBUTORS
 * BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF
 * THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.ObjectTreeSetIndexTreeElement = (function (_WebInspector$ObjectTreeBaseTreeElement) {
    _inherits(ObjectTreeSetIndexTreeElement, _WebInspector$ObjectTreeBaseTreeElement);

    function ObjectTreeSetIndexTreeElement(object, propertyPath) {
        _classCallCheck(this, ObjectTreeSetIndexTreeElement);

        console.assert(object instanceof WebInspector.RemoteObject);

        // Treat the same as an array-index just with different strings and widths.
        _get(Object.getPrototypeOf(ObjectTreeSetIndexTreeElement.prototype), "constructor", this).call(this, object, propertyPath);

        this._object = object;

        this.mainTitle = this._titleFragment();
        this.addClassName("object-tree-array-index");
    }

    // Public

    _createClass(ObjectTreeSetIndexTreeElement, [{
        key: "resolvedValue",

        // Protected

        value: function resolvedValue() {
            return this._object;
        }
    }, {
        key: "resolvedValuePropertyPath",
        value: function resolvedValuePropertyPath() {
            return this.propertyPath.appendSetIndex(this._object);
        }

        // Private

    }, {
        key: "_titleFragment",
        value: function _titleFragment() {
            var container = document.createDocumentFragment();

            var propertyPath = this.resolvedValuePropertyPath();

            // Set bullet.
            var nameElement = container.appendChild(document.createElement("span"));
            nameElement.className = "index-name";
            nameElement.textContent = "•";
            nameElement.title = WebInspector.UIString("Unable to determine path to property from root");

            // Value.
            var valueElement = container.appendChild(document.createElement("span"));
            valueElement.className = "index-value";
            valueElement.appendChild(WebInspector.FormattedValue.createObjectTreeOrFormattedValueForRemoteObject(this._object, propertyPath));

            return container;
        }
    }, {
        key: "object",
        get: function get() {
            return this._object;
        }
    }]);

    return ObjectTreeSetIndexTreeElement;
})(WebInspector.ObjectTreeBaseTreeElement);
