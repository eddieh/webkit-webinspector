/*
 * Copyright (C) 2013 University of Washington. All rights reserved.
 * Copyright (C) 2014 Apple Inc. All rights reserved.
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
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
 * TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 * PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.ProbeSetDataTable = function (probeSet) {
    WebInspector.Object.call(this);

    this._probeSet = probeSet;
    this._frames = [];
    this._previousBatchIdentifier = WebInspector.ProbeSetDataTable.SentinelValue;
};

WebInspector.ProbeSetDataTable.Event = {
    FrameInserted: "probe-set-data-table-frame-inserted",
    SeparatorInserted: "probe-set-data-table-separator-inserted",
    WillRemove: "probe-set-data-table-will-remove"
};

WebInspector.ProbeSetDataTable.SentinelValue = -1;
WebInspector.ProbeSetDataTable.UnknownValue = "?";

WebInspector.ProbeSetDataTable.prototype = Object.defineProperties({
    constructor: WebInspector.ProbeSetDataTable,
    __proto__: WebInspector.Object.prototype,

    willRemove: function willRemove() {
        this.dispatchEventToListeners(WebInspector.ProbeSetDataTable.Event.WillRemove);
        this._frames = [];
        delete this._probeSet;
    },

    mainResourceChanged: function mainResourceChanged() {
        this.addSeparator();
    },

    addSampleForProbe: function addSampleForProbe(probe, sample) {
        // Eagerly save the frame if the batch identifier differs, or we know the frame is full.
        // Create a new frame when the batch identifier differs.
        if (sample.batchId !== this._previousBatchIdentifier) {
            if (this._openFrame) {
                this._openFrame.fillMissingValues(this._probeSet);
                this.addFrame(this._openFrame);
            }
            this._openFrame = this.createFrame();
            this._previousBatchIdentifier = sample.batchId;
        }

        console.assert(this._openFrame, "Should always have an open frame before adding sample.", this, probe, sample);
        this._openFrame.addSampleForProbe(probe, sample);
        if (this._openFrame.count === this._probeSet.probes.length) {
            this.addFrame(this._openFrame);
            this._openFrame = null;
        }
    },

    addProbe: function addProbe(probe) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = this.frames[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var frame = _step.value;

                if (!frame[probe.id]) frame[probe.id] = WebInspector.ProbeSetDataTable.UnknownValue;
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator["return"]) {
                    _iterator["return"]();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    },

    removeProbe: function removeProbe(probe) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = this.frames[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var frame = _step2.value;

                delete frame[probe.id];
            }
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                    _iterator2["return"]();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }
    },

    // Protected - can be overridden by subclasses.

    createFrame: function createFrame() {
        return new WebInspector.ProbeSetDataFrame(this._frames.length);
    },

    addFrame: function addFrame(frame) {
        this._frames.push(frame);
        this.dispatchEventToListeners(WebInspector.ProbeSetDataTable.Event.FrameInserted, frame);
    },

    addSeparator: function addSeparator() {
        // Separators must be associated with a frame.
        if (!this._frames.length) return;

        var previousFrame = this._frames.lastValue;
        // Don't send out duplicate events for adjacent separators.
        if (previousFrame.isSeparator) return;

        previousFrame.isSeparator = true;
        this.dispatchEventToListeners(WebInspector.ProbeSetDataTable.Event.SeparatorInserted, previousFrame);
    }
}, {
    frames: { // Public

        get: function get() {
            return this._frames.slice();
        },
        configurable: true,
        enumerable: true
    },
    separators: {
        get: function get() {
            return this._frames.filter(function (frame) {
                return frame.isSeparator;
            });
        },
        configurable: true,
        enumerable: true
    }
});