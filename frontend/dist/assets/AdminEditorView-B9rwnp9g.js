import { _ as _export_sfc, l as tx, o as ny, m as lS, r as r9, c as ii, a as ir, b as id, e as ea, g as i_, p as r2, q as lj, A as sd, B as nO, M as adminApi, I as tu, i as iH, T as ut, w as lw, n as na, D as Dt, E as Et, Y, h as ip, t as tA, d as _t, j as iv, f as formatShortDate, x as nu, y as o7, G, R as sn, Q as se, O as sl, C as t8, s as setPageMeta } from './index-Dz5M3SeI.js';
import { A as AdminLayout } from './AdminLayout-D1aO2TbO.js';
import { _ as _sfc_main$2 } from './StateBlock-S-hHniVX.js';
import { u as uploadImageFile, c as copyText } from './media-CaEVXEFp.js';

const _hoisted_1$1 = ["aria-label"];
const _hoisted_2$1 = { class: "media-picker__panel" };
const _hoisted_3$1 = { class: "media-picker__head" };
const _hoisted_4$1 = { class: "media-picker__actions" };
const _hoisted_5$1 = ["disabled"];
const _hoisted_6$1 = {
  key: 0,
  class: "alert alert--error"
};
const _hoisted_7$1 = {
  key: 1,
  class: "media-picker__empty"
};
const _hoisted_8$1 = {
  key: 2,
  class: "media-picker__grid"
};
const _hoisted_9$1 = ["title", "onClick"];
const _hoisted_10$1 = ["src", "alt"];
const _hoisted_11$1 = {
  key: 3,
  class: "media-picker__empty"
};


const _sfc_main$1 = {
  __name: 'MediaPicker',
  props: {
  open: { type: Boolean, default: false },
  title: { type: String, default: '选择图片' },
},
  emits: ['select', 'close'],
  setup(__props, { emit: __emit }) {

const props = __props;
const emit = __emit;
const items = tx([]);
const loading = tx(false);
const error = tx('');
const uploading = tx(false);
const uploadInput = tx(null);

async function loadMedia() {
  loading.value = true;
  error.value = '';
  try {
    const data = await adminApi.listMedia();
    items.value = data.media || [];
  } catch (requestError) {
    error.value = requestError.message || '媒体库加载失败。';
  } finally {
    loading.value = false;
  }
}

async function upload(event) {
  const file = event.target.files?.[0];
  event.target.value = '';
  if (!file) return
  uploading.value = true;
  error.value = '';
  try {
    const item = await uploadImageFile(file);
    items.value.unshift(item);
    emit('select', item);
  } catch (requestError) {
    error.value = requestError.message || '上传失败。';
  } finally {
    uploading.value = false;
  }
}

function select(item) {
  emit('select', item);
}

ny(
  () => props.open,
  (open) => {
    if (open) loadMedia();
  },
);

lS(() => {
  if (props.open) loadMedia();
});

return (_ctx, _cache) => {
  return (r9(), ii(nO, { to: "body" }, [
    (__props.open)
      ? (r9(), ir("div", {
          key: 0,
          class: "media-picker",
          role: "dialog",
          "aria-modal": "true",
          "aria-label": __props.title,
          onClick: _cache[2] || (_cache[2] = sd($event => (emit('close')), ["self"]))
        }, [
          id("div", _hoisted_2$1, [
            id("header", _hoisted_3$1, [
              id("div", null, [
                _cache[3] || (_cache[3] = id("p", { class: "eyebrow" }, "MEDIA LIBRARY", -1)),
                id("h2", null, ea(__props.title), 1)
              ]),
              id("div", _hoisted_4$1, [
                id("input", {
                  ref_key: "uploadInput",
                  ref: uploadInput,
                  class: "visually-hidden",
                  type: "file",
                  accept: "image/jpeg,image/png,image/webp,image/gif",
                  onChange: upload
                }, null, 544),
                id("button", {
                  type: "button",
                  class: "btn btn--small",
                  disabled: uploading.value,
                  onClick: _cache[0] || (_cache[0] = $event => (uploadInput.value?.click()))
                }, ea(uploading.value ? '上传中…' : '上传图片'), 9, _hoisted_5$1),
                id("button", {
                  type: "button",
                  class: "text-link bare-button",
                  onClick: _cache[1] || (_cache[1] = $event => (emit('close')))
                }, "关闭")
              ])
            ]),
            (error.value)
              ? (r9(), ir("p", _hoisted_6$1, ea(error.value), 1))
              : i_("", true),
            (loading.value)
              ? (r9(), ir("p", _hoisted_7$1, "正在整理图片…"))
              : (items.value.length)
                ? (r9(), ir("div", _hoisted_8$1, [
                    (r9(true), ir(r2, null, lj(items.value, (item) => {
                      return (r9(), ir("button", {
                        key: item.id,
                        type: "button",
                        class: "media-picker__item",
                        title: item.alt || item.original_name,
                        onClick: $event => (select(item))
                      }, [
                        id("img", {
                          src: item.url,
                          alt: item.alt || item.original_name,
                          loading: "lazy"
                        }, null, 8, _hoisted_10$1),
                        id("span", null, ea(item.alt || item.original_name), 1)
                      ], 8, _hoisted_9$1))
                    }), 128))
                  ]))
                : (r9(), ir("p", _hoisted_11$1, "媒体库还是空的，先上传一张图片。"))
          ])
        ], 8, _hoisted_1$1))
      : i_("", true)
  ]))
}
}

};
const MediaPicker = /*#__PURE__*/_export_sfc(_sfc_main$1, [['__scopeId',"data-v-b3b520d3"]]);

class Diff {
    diff(oldStr, newStr, 
    // Type below is not accurate/complete - see above for full possibilities - but it compiles
    options = {}) {
        let callback;
        if (typeof options === 'function') {
            callback = options;
            options = {};
        }
        else if ('callback' in options) {
            callback = options.callback;
        }
        // Allow subclasses to massage the input prior to running
        const oldString = this.castInput(oldStr, options);
        const newString = this.castInput(newStr, options);
        const oldTokens = this.removeEmpty(this.tokenize(oldString, options));
        const newTokens = this.removeEmpty(this.tokenize(newString, options));
        return this.diffWithOptionsObj(oldTokens, newTokens, options, callback);
    }
    diffWithOptionsObj(oldTokens, newTokens, options, callback) {
        var _a;
        const done = (value) => {
            value = this.postProcess(value, options);
            if (callback) {
                setTimeout(function () { callback(value); }, 0);
                return undefined;
            }
            else {
                return value;
            }
        };
        const newLen = newTokens.length, oldLen = oldTokens.length;
        let editLength = 1;
        let maxEditLength = newLen + oldLen;
        if (options.maxEditLength != null) {
            maxEditLength = Math.min(maxEditLength, options.maxEditLength);
        }
        const maxExecutionTime = (_a = options.timeout) !== null && _a !== void 0 ? _a : Infinity;
        const abortAfterTimestamp = Date.now() + maxExecutionTime;
        const bestPath = [{ oldPos: -1, lastComponent: undefined }];
        // Seed editLength = 0, i.e. the content starts with the same values
        let newPos = this.extractCommon(bestPath[0], newTokens, oldTokens, 0, options);
        if (bestPath[0].oldPos + 1 >= oldLen && newPos + 1 >= newLen) {
            // Identity per the equality and tokenizer
            return done(this.buildValues(bestPath[0].lastComponent, newTokens, oldTokens));
        }
        // Once we hit the right edge of the edit graph on some diagonal k, we can
        // definitely reach the end of the edit graph in no more than k edits, so
        // there's no point in considering any moves to diagonal k+1 any more (from
        // which we're guaranteed to need at least k+1 more edits).
        // Similarly, once we've reached the bottom of the edit graph, there's no
        // point considering moves to lower diagonals.
        // We record this fact by setting minDiagonalToConsider and
        // maxDiagonalToConsider to some finite value once we've hit the edge of
        // the edit graph.
        // This optimization is not faithful to the original algorithm presented in
        // Myers's paper, which instead pointlessly extends D-paths off the end of
        // the edit graph - see page 7 of Myers's paper which notes this point
        // explicitly and illustrates it with a diagram. This has major performance
        // implications for some common scenarios. For instance, to compute a diff
        // where the new text simply appends d characters on the end of the
        // original text of length n, the true Myers algorithm will take O(n+d^2)
        // time while this optimization needs only O(n+d) time.
        let minDiagonalToConsider = -Infinity, maxDiagonalToConsider = Infinity;
        // Main worker method. checks all permutations of a given edit length for acceptance.
        const execEditLength = () => {
            for (let diagonalPath = Math.max(minDiagonalToConsider, -editLength); diagonalPath <= Math.min(maxDiagonalToConsider, editLength); diagonalPath += 2) {
                let basePath;
                const removePath = bestPath[diagonalPath - 1], addPath = bestPath[diagonalPath + 1];
                if (removePath) {
                    // No one else is going to attempt to use this value, clear it
                    // @ts-expect-error - perf optimisation. This type-violating value will never be read.
                    bestPath[diagonalPath - 1] = undefined;
                }
                let canAdd = false;
                if (addPath) {
                    // what newPos will be after we do an insertion:
                    const addPathNewPos = addPath.oldPos - diagonalPath;
                    canAdd = addPath && 0 <= addPathNewPos && addPathNewPos < newLen;
                }
                const canRemove = removePath && removePath.oldPos + 1 < oldLen;
                if (!canAdd && !canRemove) {
                    // If this path is a terminal then prune
                    // @ts-expect-error - perf optimisation. This type-violating value will never be read.
                    bestPath[diagonalPath] = undefined;
                    continue;
                }
                // Select the diagonal that we want to branch from. We select the prior
                // path whose position in the old string is the farthest from the origin
                // and does not pass the bounds of the diff graph
                if (!canRemove || (canAdd && removePath.oldPos < addPath.oldPos)) {
                    basePath = this.addToPath(addPath, true, false, 0, options);
                }
                else {
                    basePath = this.addToPath(removePath, false, true, 1, options);
                }
                newPos = this.extractCommon(basePath, newTokens, oldTokens, diagonalPath, options);
                if (basePath.oldPos + 1 >= oldLen && newPos + 1 >= newLen) {
                    // If we have hit the end of both strings, then we are done
                    return done(this.buildValues(basePath.lastComponent, newTokens, oldTokens)) || true;
                }
                else {
                    bestPath[diagonalPath] = basePath;
                    if (basePath.oldPos + 1 >= oldLen) {
                        maxDiagonalToConsider = Math.min(maxDiagonalToConsider, diagonalPath - 1);
                    }
                    if (newPos + 1 >= newLen) {
                        minDiagonalToConsider = Math.max(minDiagonalToConsider, diagonalPath + 1);
                    }
                }
            }
            editLength++;
        };
        // Performs the length of edit iteration. Is a bit fugly as this has to support the
        // sync and async mode which is never fun. Loops over execEditLength until a value
        // is produced, or until the edit length exceeds options.maxEditLength (if given),
        // in which case it will return undefined.
        if (callback) {
            (function exec() {
                setTimeout(function () {
                    if (editLength > maxEditLength || Date.now() > abortAfterTimestamp) {
                        return callback(undefined);
                    }
                    if (!execEditLength()) {
                        exec();
                    }
                }, 0);
            }());
        }
        else {
            while (editLength <= maxEditLength && Date.now() <= abortAfterTimestamp) {
                const ret = execEditLength();
                if (ret) {
                    return ret;
                }
            }
        }
    }
    addToPath(path, added, removed, oldPosInc, options) {
        const last = path.lastComponent;
        if (last && !options.oneChangePerToken && last.added === added && last.removed === removed) {
            return {
                oldPos: path.oldPos + oldPosInc,
                lastComponent: { count: last.count + 1, added: added, removed: removed, previousComponent: last.previousComponent }
            };
        }
        else {
            return {
                oldPos: path.oldPos + oldPosInc,
                lastComponent: { count: 1, added: added, removed: removed, previousComponent: last }
            };
        }
    }
    extractCommon(basePath, newTokens, oldTokens, diagonalPath, options) {
        const newLen = newTokens.length, oldLen = oldTokens.length;
        let oldPos = basePath.oldPos, newPos = oldPos - diagonalPath, commonCount = 0;
        while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(oldTokens[oldPos + 1], newTokens[newPos + 1], options)) {
            newPos++;
            oldPos++;
            commonCount++;
            if (options.oneChangePerToken) {
                basePath.lastComponent = { count: 1, previousComponent: basePath.lastComponent, added: false, removed: false };
            }
        }
        if (commonCount && !options.oneChangePerToken) {
            basePath.lastComponent = { count: commonCount, previousComponent: basePath.lastComponent, added: false, removed: false };
        }
        basePath.oldPos = oldPos;
        return newPos;
    }
    equals(left, right, options) {
        if (options.comparator) {
            return options.comparator(left, right);
        }
        else {
            return left === right
                || (!!options.ignoreCase && left.toLowerCase() === right.toLowerCase());
        }
    }
    removeEmpty(array) {
        const ret = [];
        for (let i = 0; i < array.length; i++) {
            if (array[i]) {
                ret.push(array[i]);
            }
        }
        return ret;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    castInput(value, options) {
        return value;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tokenize(value, options) {
        return Array.from(value);
    }
    join(chars) {
        // Assumes ValueT is string, which is the case for most subclasses.
        // When it's false, e.g. in diffArrays, this method needs to be overridden (e.g. with a no-op)
        // Yes, the casts are verbose and ugly, because this pattern - of having the base class SORT OF
        // assume tokens and values are strings, but not completely - is weird and janky.
        return chars.join('');
    }
    postProcess(changeObjects, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    options) {
        return changeObjects;
    }
    get useLongestToken() {
        return false;
    }
    buildValues(lastComponent, newTokens, oldTokens) {
        // First we convert our linked list of components in reverse order to an
        // array in the right order:
        const components = [];
        let nextComponent;
        while (lastComponent) {
            components.push(lastComponent);
            nextComponent = lastComponent.previousComponent;
            delete lastComponent.previousComponent;
            lastComponent = nextComponent;
        }
        components.reverse();
        const componentLen = components.length;
        let componentPos = 0, newPos = 0, oldPos = 0;
        for (; componentPos < componentLen; componentPos++) {
            const component = components[componentPos];
            if (!component.removed) {
                if (!component.added && this.useLongestToken) {
                    let value = newTokens.slice(newPos, newPos + component.count);
                    value = value.map(function (value, i) {
                        const oldValue = oldTokens[oldPos + i];
                        return oldValue.length > value.length ? oldValue : value;
                    });
                    component.value = this.join(value);
                }
                else {
                    component.value = this.join(newTokens.slice(newPos, newPos + component.count));
                }
                newPos += component.count;
                // Common case
                if (!component.added) {
                    oldPos += component.count;
                }
            }
            else {
                component.value = this.join(oldTokens.slice(oldPos, oldPos + component.count));
                oldPos += component.count;
            }
        }
        return components;
    }
}

class LineDiff extends Diff {
    constructor() {
        super(...arguments);
        this.tokenize = tokenize;
    }
    equals(left, right, options) {
        // If we're ignoring whitespace, we need to normalise lines by stripping
        // whitespace before checking equality. (This has an annoying interaction
        // with newlineIsToken that requires special handling: if newlines get their
        // own token, then we DON'T want to trim the *newline* tokens down to empty
        // strings, since this would cause us to treat whitespace-only line content
        // as equal to a separator between lines, which would be weird and
        // inconsistent with the documented behavior of the options.)
        if (options.ignoreWhitespace) {
            if (!options.newlineIsToken || !left.includes('\n')) {
                left = left.trim();
            }
            if (!options.newlineIsToken || !right.includes('\n')) {
                right = right.trim();
            }
        }
        else if (options.ignoreNewlineAtEof && !options.newlineIsToken) {
            if (left.endsWith('\n')) {
                left = left.slice(0, -1);
            }
            if (right.endsWith('\n')) {
                right = right.slice(0, -1);
            }
        }
        return super.equals(left, right, options);
    }
}
const lineDiff = new LineDiff();
function diffLines(oldStr, newStr, options) {
    return lineDiff.diff(oldStr, newStr, options);
}
// Exported standalone so it can be used from jsonDiff too.
function tokenize(value, options) {
    if (options.stripTrailingCr) {
        // remove one \r before \n to match GNU diff's --strip-trailing-cr behavior
        value = value.replace(/\r\n/g, '\n');
    }
    const retLines = [], linesAndNewlines = value.split(/(\n|\r\n)/);
    // Ignore the final empty token that occurs if the string ends with a new line
    if (!linesAndNewlines[linesAndNewlines.length - 1]) {
        linesAndNewlines.pop();
    }
    // Merge the content and line separators into single tokens
    for (let i = 0; i < linesAndNewlines.length; i++) {
        const line = linesAndNewlines[i];
        if (i % 2 && !options.newlineIsToken) {
            retLines[retLines.length - 1] += line;
        }
        else {
            retLines.push(line);
        }
    }
    return retLines;
}

const _hoisted_1 = { class: "editor-head" };
const _hoisted_2 = { class: "editor-head__copy" };
const _hoisted_3 = { class: "editor-head__actions" };
const _hoisted_4 = ["href"];
const _hoisted_5 = ["disabled"];
const _hoisted_6 = {
  key: 0,
  class: "alert alert--success editor-toast",
  role: "status"
};
const _hoisted_7 = {
  key: 1,
  class: "alert alert--error",
  role: "alert"
};
const _hoisted_8 = {
  key: 2,
  class: "preview-link-banner",
  role: "status"
};
const _hoisted_9 = ["href"];
const _hoisted_10 = {
  key: 3,
  class: "local-draft-banner",
  role: "status"
};
const _hoisted_11 = { class: "local-draft-banner__actions" };
const _hoisted_12 = { class: "editor-layout" };
const _hoisted_13 = { class: "editor-main" };
const _hoisted_14 = {
  class: "title-block",
  "aria-labelledby": "editor-title-label"
};
const _hoisted_15 = { class: "title-meta" };
const _hoisted_16 = {
  key: 0,
  class: "auto-save-label"
};
const _hoisted_17 = {
  key: 1,
  class: "dirty-dot",
  "aria-label": "有未保存的修改"
};
const _hoisted_18 = { key: 2 };
const _hoisted_19 = { class: "excerpt-block" };
const _hoisted_20 = { class: "field-hint" };
const _hoisted_21 = {
  class: "writing-desk",
  "aria-labelledby": "writing-label"
};
const _hoisted_22 = { class: "writing-desk__head" };
const _hoisted_23 = { class: "split-control" };
const _hoisted_24 = ["value"];
const _hoisted_25 = {
  class: "mobile-tabs",
  role: "tablist",
  "aria-label": "写作与预览"
};
const _hoisted_26 = ["aria-selected"];
const _hoisted_27 = ["aria-selected"];
const _hoisted_28 = {
  class: "editor-toolbar",
  role: "toolbar",
  "aria-label": "Markdown 快捷输入"
};
const _hoisted_29 = ["title", "aria-label", "onClick"];
const _hoisted_30 = ["disabled"];
const _hoisted_31 = {
  key: 0,
  class: "editor-media-note alert alert--error"
};
const _hoisted_32 = {
  key: 1,
  class: "editor-media-note alert alert--success",
  role: "status"
};
const _hoisted_33 = { class: "editor-pane editor-pane--write" };
const _hoisted_34 = { class: "editor-pane__foot" };
const _hoisted_35 = {
  class: "editor-pane editor-pane--preview",
  role: "tabpanel",
  "aria-label": "文章预览"
};
const _hoisted_36 = { class: "preview-head" };
const _hoisted_37 = {
  key: 0,
  class: "preview-time"
};
const _hoisted_38 = { class: "preview-scroll" };
const _hoisted_39 = {
  key: 0,
  class: "alert alert--error"
};
const _hoisted_40 = {
  key: 1,
  class: "preview-empty"
};
const _hoisted_41 = ["innerHTML"];
const _hoisted_42 = {
  key: 3,
  class: "preview-empty"
};
const _hoisted_43 = {
  class: "editor-side",
  "aria-label": "文章设置"
};
const _hoisted_44 = { class: "editor-side__scroll" };
const _hoisted_45 = { class: "meta-card" };
const _hoisted_46 = { class: "status-options" };
const _hoisted_47 = {
  key: 0,
  class: "field schedule-field"
};
const _hoisted_48 = { class: "meta-card" };
const _hoisted_49 = {
  key: 0,
  class: "cover-preview"
};
const _hoisted_50 = ["src"];
const _hoisted_51 = { class: "cover-preview__actions" };
const _hoisted_52 = { class: "featured-toggle" };
const _hoisted_53 = { class: "meta-card link-card" };
const _hoisted_54 = { class: "seo-card__summary" };
const _hoisted_55 = { class: "seo-card__body" };
const _hoisted_56 = { class: "field" };
const _hoisted_57 = { class: "slug-line" };
const _hoisted_58 = { class: "field" };
const _hoisted_59 = { class: "field-hint" };
const _hoisted_60 = { class: "field" };
const _hoisted_61 = {
  key: 0,
  class: "field"
};
const _hoisted_62 = { class: "meta-card repair-editor" };
const _hoisted_63 = { class: "seo-card__body" };
const _hoisted_64 = { class: "field" };
const _hoisted_65 = { class: "field" };
const _hoisted_66 = { class: "field" };
const _hoisted_67 = { class: "field" };
const _hoisted_68 = { class: "field" };
const _hoisted_69 = { class: "meta-card seo-card" };
const _hoisted_70 = { class: "seo-card__body" };
const _hoisted_71 = { class: "field" };
const _hoisted_72 = { class: "field" };
const _hoisted_73 = { class: "field" };
const _hoisted_74 = { class: "field" };
const _hoisted_75 = { class: "meta-card faq-editor" };
const _hoisted_76 = { class: "seo-card__summary" };
const _hoisted_77 = { class: "seo-card__body" };
const _hoisted_78 = { class: "field" };
const _hoisted_79 = ["for"];
const _hoisted_80 = ["id", "onUpdate:modelValue"];
const _hoisted_81 = { class: "field" };
const _hoisted_82 = ["for"];
const _hoisted_83 = ["id", "onUpdate:modelValue"];
const _hoisted_84 = ["onClick"];
const _hoisted_85 = { class: "meta-card meta-card--stats" };
const _hoisted_86 = { class: "meta-stats" };
const _hoisted_87 = { key: 0 };
const _hoisted_88 = { class: "editor-save-sticky" };
const _hoisted_89 = { class: "save-state" };
const _hoisted_90 = ["disabled"];
const _hoisted_91 = { class: "command-panel" };
const _hoisted_92 = { class: "command-list" };
const _hoisted_93 = ["onMouseenter", "onClick"];
const _hoisted_94 = {
  key: 0,
  class: "command-empty"
};
const _hoisted_95 = { class: "compare-panel" };
const _hoisted_96 = { class: "revision-head" };
const _hoisted_97 = { class: "compare-picks" };
const _hoisted_98 = ["src"];
const _hoisted_99 = { key: 1 };
const _hoisted_100 = ["src"];
const _hoisted_101 = { key: 1 };
const _hoisted_102 = {
  key: 0,
  class: "alert alert--error"
};
const _hoisted_103 = { class: "form-grid" };
const _hoisted_104 = { class: "field" };
const _hoisted_105 = { class: "field" };
const _hoisted_106 = { class: "field" };
const _hoisted_107 = { class: "field" };
const _hoisted_108 = { class: "button-row" };
const _hoisted_109 = { class: "revision-panel" };
const _hoisted_110 = { class: "revision-head" };
const _hoisted_111 = {
  key: 0,
  class: "alert alert--error"
};
const _hoisted_112 = { class: "revision-layout" };
const _hoisted_113 = { class: "revision-list" };
const _hoisted_114 = { key: 0 };
const _hoisted_115 = ["onClick"];
const _hoisted_116 = { key: 1 };
const _hoisted_117 = { class: "revision-diff" };
const _hoisted_118 = { class: "revision-diff__actions" };
const _hoisted_119 = ["disabled"];
const _hoisted_120 = {
  key: 1,
  class: "revision-empty"
};


const _sfc_main = {
  __name: 'AdminEditorView',
  setup(__props) {

const route = Dt();
const router = Et();

const form = tu({
  title: '',
  slug: '',
  excerpt: '',
  tagsText: '',
  content_md: '',
  status: 'draft',
  scheduledAt: '',
  series: '',
  seriesOrder: 0,
  seoTitle: '',
  seoDescription: '',
  seoKeywords: '',
  coverImage: '',
  featured: false,
  canonicalUrl: '',
  repairRisk: 'low',
  repairTime: '',
  repairTools: '',
  repairModels: '',
  repairSafety: '',
  faq: [],
});

const postId = tx(null);
const loading = tx(true);
const loadError = tx('');
const loadNotFound = tx(false);
const saving = tx(false);
const saveError = tx('');
const savedNotice = tx('');
const lastSavedAt = tx('');
const loadedAt = tx('');
const previewHtml = tx('');
const previewBody = tx(null);
const previewMinutes = tx(1);
const previewLoading = tx(false);
const previewError = tx('');
const activeTab = tx('write');
const textarea = tx(null);
const titleInput = tx(null);
const editorPanesStyle = iH(() => ({
  '--editor-split': `${splitPercent.value}%`,
}));
const imageInput = tx(null);
const savedSnapshot = tx('');
const uploadingImage = tx(false);
const mediaError = tx('');
const mediaNotice = tx('');
const localDraft = tx(null);
const autoSavedAt = tx('');
const postViews = tx(0);
const focusMode = tx(false);
const splitPercent = tx(58);
const commandOpen = tx(false);
const commandQuery = tx('');
const commandIndex = tx(0);
const previewUrl = tx('');
const mediaPickerOpen = tx(false);
const mediaPickerMode = tx('cover');
const revisionsOpen = tx(false);
const revisions = tx([]);
const revisionLoading = tx(false);
const revisionError = tx('');
const selectedRevision = tx(null);
const revisionDiff = tx([]);
const revisionBusy = tx(false);
const compareOpen = tx(false);
const compareDraft = tu({
  before: '',
  after: '',
  beforeLabel: '之前',
  afterLabel: '之后',
  label: '维修前后',
  caption: '',
});
let previewTimer = null;
let noticeTimer = null;
let previewSequence = 0;
let suppressNextLoad = false;
let localDraftTimer = null;
let autoSaveTimer = null;
let mediaNoticeTimer = null;
let formRevision = 0;
let applyingResult = false;

const routeId = iH(() => {
  const raw = route.params.id;
  if (raw === undefined || raw === '') return null
  const value = Number(raw);
  return Number.isInteger(value) && value > 0 ? value : Number.NaN
});

const isNew = iH(() => postId.value === null);
const dirty = iH(() => snapshot() !== savedSnapshot.value);
const tags = iH(() => parseTags().tags);
const contentLength = iH(() => form.content_md.length);
const pageTitle = iH(() =>
  isNew.value ? '写新文章 · 管理后台' : '编辑文章 · 管理后台',
);

const toolbar = [
  { label: 'H2', title: '二级标题', before: '\n## ', after: '\n', placeholder: '小标题' },
  { label: 'B', title: '加粗', before: '**', after: '**', placeholder: '加粗的文字' },
  { label: 'I', title: '斜体', before: '*', after: '*', placeholder: '斜体的文字' },
  { label: '“”', title: '引用', before: '\n> ', after: '\n', placeholder: '想引用的一句话' },
  { label: '—', title: '分隔线', before: '\n\n---\n\n', after: '', placeholder: '' },
  { label: '•', title: '无序列表', before: '\n- ', after: '\n', placeholder: '列表项' },
  { label: '</>', title: '代码块', before: '\n```\n', after: '\n```\n', placeholder: 'code here' },
  { label: 'a↗', title: '链接', before: '[', after: '](https://)', placeholder: '链接文字' },
];

function snapshot() {
  return JSON.stringify({
    title: form.title,
    slug: form.slug,
    excerpt: form.excerpt,
    tagsText: form.tagsText,
    content_md: form.content_md,
    status: form.status,
    scheduledAt: form.scheduledAt,
    series: form.series,
    seriesOrder: form.seriesOrder,
    seoTitle: form.seoTitle,
    seoDescription: form.seoDescription,
    seoKeywords: form.seoKeywords,
    coverImage: form.coverImage,
    featured: form.featured,
    canonicalUrl: form.canonicalUrl,
    repairRisk: form.repairRisk,
    repairTime: form.repairTime,
    repairTools: form.repairTools,
    repairModels: form.repairModels,
    repairSafety: form.repairSafety,
    faq: JSON.parse(JSON.stringify(form.faq)),
  })
}

function localDraftKey() {
  return postId.value ? `markblog:draft:${postId.value}` : 'markblog:draft:new'
}

function toLocalInput(value) {
  if (!value) return ''
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return ''
  const pad = (number) => String(number).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function toUtcIso(value) {
  if (!value) return null
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function draftPayload() {
  return {
    title: form.title,
    slug: form.slug,
    excerpt: form.excerpt,
    tagsText: form.tagsText,
    content_md: form.content_md,
    status: form.status,
    scheduledAt: form.scheduledAt,
    series: form.series,
    seriesOrder: form.seriesOrder,
    seoTitle: form.seoTitle,
    seoDescription: form.seoDescription,
    seoKeywords: form.seoKeywords,
    coverImage: form.coverImage,
    featured: form.featured,
    canonicalUrl: form.canonicalUrl,
    repairRisk: form.repairRisk,
    repairTime: form.repairTime,
    repairTools: form.repairTools,
    repairModels: form.repairModels,
    repairSafety: form.repairSafety,
    faq: JSON.parse(JSON.stringify(form.faq)),
    savedAt: new Date().toISOString(),
  }
}

function readLocalDraft() {
  try {
    const raw = window.localStorage.getItem(localDraftKey());
    if (!raw) return null
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

function writeLocalDraft() {
  window.clearTimeout(localDraftTimer);
  localDraftTimer = window.setTimeout(() => {
    if (!dirty.value) return
    try {
      window.localStorage.setItem(localDraftKey(), JSON.stringify(draftPayload()));
    } catch {
      // The server autosave still protects saved posts.
    }
  }, 1200);
}

function applyLocalDraft(draft) {
  Object.assign(form, {
    title: draft.title || '',
    slug: draft.slug || '',
    excerpt: draft.excerpt || '',
    tagsText: draft.tagsText || '',
    content_md: draft.content_md || '',
    status: ['draft', 'published', 'scheduled'].includes(draft.status)
      ? draft.status
      : 'draft',
    scheduledAt: draft.scheduledAt || '',
    series: draft.series || '',
    seriesOrder: draft.seriesOrder || 0,
    seoTitle: draft.seoTitle || '',
    seoDescription: draft.seoDescription || '',
    seoKeywords: draft.seoKeywords || '',
    coverImage: draft.coverImage || '',
    featured: Boolean(draft.featured),
    canonicalUrl: draft.canonicalUrl || '',
    repairRisk: draft.repairRisk || 'low',
    repairTime: draft.repairTime || '',
    repairTools: draft.repairTools || '',
    repairModels: draft.repairModels || '',
    repairSafety: draft.repairSafety || '',
    faq: Array.isArray(draft.faq) ? JSON.parse(JSON.stringify(draft.faq)) : [],
  });
  localDraft.value = null;
}

function discardLocalDraft() {
  try {
    window.localStorage.removeItem(localDraftKey());
  } catch {
    // Ignore storage failures.
  }
  localDraft.value = null;
}

function checkLocalDraft() {
  const draft = readLocalDraft();
  if (!draft) return
  const draftSnapshot = JSON.stringify({
    title: draft.title || '',
    slug: draft.slug || '',
    excerpt: draft.excerpt || '',
    tagsText: draft.tagsText || '',
    content_md: draft.content_md || '',
    status: draft.status || 'draft',
    scheduledAt: draft.scheduledAt || '',
    series: draft.series || '',
    seriesOrder: draft.seriesOrder || 0,
    seoTitle: draft.seoTitle || '',
    seoDescription: draft.seoDescription || '',
    seoKeywords: draft.seoKeywords || '',
    coverImage: draft.coverImage || '',
    featured: Boolean(draft.featured),
    canonicalUrl: draft.canonicalUrl || '',
    repairRisk: draft.repairRisk || 'low',
    repairTime: draft.repairTime || '',
    repairTools: draft.repairTools || '',
    repairModels: draft.repairModels || '',
    repairSafety: draft.repairSafety || '',
    faq: Array.isArray(draft.faq) ? JSON.parse(JSON.stringify(draft.faq)) : [],
  });
  if (draftSnapshot !== snapshot() && (draft.title || draft.content_md)) {
    localDraft.value = draft;
  }
}

function clearLocalDraft() {
  try {
    window.localStorage.removeItem('markblog:draft:new');
    if (postId.value) window.localStorage.removeItem(`markblog:draft:${postId.value}`);
  } catch {
    // Ignore.
  }
  localDraft.value = null;
}

function showMediaNotice(message) {
  mediaNotice.value = message;
  window.clearTimeout(mediaNoticeTimer);
  mediaNoticeTimer = window.setTimeout(() => (mediaNotice.value = ''), 3600);
}

function insertTextAtCursor(text) {
  const element = textarea.value;
  if (!element) {
    form.content_md += text;
    return
  }
  const start = element.selectionStart ?? form.content_md.length;
  const end = element.selectionEnd ?? start;
  form.content_md =
    form.content_md.slice(0, start) + text + form.content_md.slice(end);
  t8(() => {
    element.focus();
    const cursor = start + text.length;
    element.setSelectionRange(cursor, cursor);
  });
}

async function uploadAndInsert(file) {
  if (!file || uploadingImage.value) return
  uploadingImage.value = true;
  mediaError.value = '';
  try {
    const item = await uploadImageFile(file);
    insertTextAtCursor(`\n![${item.alt || item.original_name}](${item.url})\n`);
    showMediaNotice(`已上传并插入 ${item.filename}`);
  } catch (error) {
    mediaError.value = error.message || '图片上传失败。';
  } finally {
    uploadingImage.value = false;
  }
}

function handleImageInput(event) {
  const file = event.target.files?.[0];
  event.target.value = '';
  uploadAndInsert(file);
}

function handlePaste(event) {
  const files = Array.from(event.clipboardData?.files || []).filter((file) =>
    file.type.startsWith('image/'),
  );
  if (!files.length) return
  event.preventDefault();
  uploadAndInsert(files[0]);
}

function openMediaPicker(mode) {
  mediaPickerMode.value = mode;
  mediaPickerOpen.value = true;
}

function handleMediaSelected(item) {
  mediaPickerOpen.value = false;
  if (mediaPickerMode.value === 'cover') {
    form.coverImage = item.url;
  } else if (mediaPickerMode.value === 'compare-before') {
    compareDraft.before = item.url;
  } else if (mediaPickerMode.value === 'compare-after') {
    compareDraft.after = item.url;
  } else {
    insertTextAtCursor(`\n![${item.alt || item.original_name}](${item.url})\n`);
  }
}

function openCompare() {
  compareOpen.value = true;
}

function insertCompare() {
  if (!compareDraft.before || !compareDraft.after) {
    mediaError.value = '对比图需要选择两张图片。';
    return
  }
  const lines = [
    '',
    ':::compare',
    `before: ${compareDraft.before}`,
    `after: ${compareDraft.after}`,
    `label: ${compareDraft.label || '维修前后'}`,
    `before_label: ${compareDraft.beforeLabel || '之前'}`,
    `after_label: ${compareDraft.afterLabel || '之后'}`,
  ];
  if (compareDraft.caption) lines.push(`caption: ${compareDraft.caption}`);
  lines.push(':::', '');
  insertTextAtCursor(lines.join('\n'));
  compareOpen.value = false;
}

function applyRepairTemplate() {
  if (form.content_md.includes('## 适用机型与症状')) {
    savedNotice.value = '正文里已经有维修模板了。';
    return
  }
  const skeleton = `\n\n## 适用机型与症状\n\n- 适用：\n- 症状：\n\n## 风险与准备\n\n> 动手前先断电并备份数据。\n\n## 工具与材料\n\n- \n\n## 排查步骤\n\n1. \n2. \n\n## 修复与验证\n\n- \n\n## 收尾\n\n- \n`;
  insertTextAtCursor(skeleton);
  form.repairRisk = form.repairRisk || 'medium';
}

async function openRevisions() {
  if (!postId.value) return
  revisionsOpen.value = true;
  revisionLoading.value = true;
  revisionError.value = '';
  selectedRevision.value = null;
  revisionDiff.value = [];
  try {
    const data = await adminApi.getRevisions(postId.value);
    revisions.value = data.items || [];
  } catch (error) {
    revisionError.value = error.message || '历史版本加载失败。';
  } finally {
    revisionLoading.value = false;
  }
}

function selectRevision(rev) {
  selectedRevision.value = rev;
  const parts = [];
  if (form.title !== rev.title) {
    parts.push({ removed: true, value: `标题：${form.title}\n` });
    parts.push({ added: true, value: `标题：${rev.title}\n` });
  }
  parts.push(...diffLines(form.content_md, rev.content_md || ''));
  revisionDiff.value = parts;
}

async function restoreSelectedRevision() {
  if (!selectedRevision.value || revisionBusy.value) return
  if (!window.confirm('恢复这一版会覆盖当前正文，确定继续吗？')) return
  revisionBusy.value = true;
  revisionError.value = '';
  try {
    const result = await adminApi.restoreRevision(postId.value, selectedRevision.value.id);
    applyingResult = true;
    Object.assign(form, {
      title: result.title,
      excerpt: result.excerpt,
      content_md: result.content_md,
      tagsText: result.tags.join(', '),
      series: result.series || '',
      seriesOrder: result.series_order || 0,
      seoTitle: result.seo_title || '',
      seoDescription: result.seo_description || '',
      seoKeywords: result.seo_keywords || '',
      coverImage: result.cover_image || '',
      featured: Boolean(result.featured),
      canonicalUrl: result.canonical_url || '',
      repairRisk: result.repair?.risk || 'low',
      repairTime: result.repair?.time || '',
      repairTools: result.repair?.tools || '',
      repairModels: result.repair?.models || '',
      repairSafety: result.repair?.safety || '',
      faq: Array.isArray(result.faq) ? JSON.parse(JSON.stringify(result.faq)) : [],
    });
    await t8();
    applyingResult = false;
    savedSnapshot.value = snapshot();
    lastSavedAt.value = result.updated_at;
    revisionsOpen.value = false;
    savedNotice.value = '已恢复选中的历史版本。';
    schedulePreview(30);
  } catch (error) {
    revisionError.value = error.message || '恢复失败。';
  } finally {
    revisionBusy.value = false;
  }
}

function addFaq() {
  if (form.faq.length >= 12) return
  form.faq.push({ question: '', answer: '' });
}

function removeFaq(index) {
  form.faq.splice(index, 1);
}

async function sharePreview() {
  if (!postId.value) return
  try {
    const data = await adminApi.createPreviewToken(postId.value);
    previewUrl.value = data.url;
    try {
      await copyText(data.url);
      savedNotice.value = '预览链接已生成并复制。';
    } catch {
      savedNotice.value = '预览链接已生成。';
    }
    window.open(data.url, '_blank', 'noopener');
  } catch (error) {
    saveError.value = error.message || '预览链接生成失败。';
  }
}

async function revokePreview() {
  if (!postId.value) return
  try {
    await adminApi.revokePreviewToken(postId.value);
    previewUrl.value = '';
    savedNotice.value = '预览链接已撤销。';
  } catch (error) {
    saveError.value = error.message || '撤销失败。';
  }
}

async function duplicateCurrent() {
  if (!postId.value || saving.value) return
  try {
    const copy = await adminApi.duplicatePost(postId.value);
    await router.push({ name: 'admin-post-edit', params: { id: copy.id } });
  } catch (error) {
    saveError.value = error.message || '复制失败。';
  }
}

function parseTags() {
  const seen = new Set();
  const values = form.tagsText
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean)
    .filter((tag) => {
      if (seen.has(tag)) return false
      seen.add(tag);
      return true
    });
  return { tags: values.slice(0, 8), tooMany: values.length > 8 }
}

function scheduleMeta() {
  setPageMeta({ title: pageTitle.value, noindex: true });
}

function resetForNew() {
  postId.value = null;
  Object.assign(form, {
    title: '',
    slug: '',
    excerpt: '',
    tagsText: '',
    content_md: '',
    status: 'draft',
    scheduledAt: '',
    series: '',
    seriesOrder: 0,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    coverImage: '',
    featured: false,
    canonicalUrl: '',
    repairRisk: 'low',
    repairTime: '',
    repairTools: '',
    repairModels: '',
    repairSafety: '',
    faq: [],
  });
  loadedAt.value = '';
  lastSavedAt.value = '';
  autoSavedAt.value = '';
  previewHtml.value = '';
  previewMinutes.value = 1;
  loadError.value = '';
  loadNotFound.value = false;
  loading.value = false;
  savedSnapshot.value = snapshot();
  scheduleMeta();
  checkLocalDraft();
  t8(() => titleInput.value?.focus());
}

async function loadPost(id) {
  loading.value = true;
  loadError.value = '';
  loadNotFound.value = false;
  saveError.value = '';
  previewUrl.value = '';
  try {
    const data = await adminApi.getPost(id);
    postId.value = data.id;
    Object.assign(form, {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      tagsText: data.tags.join(', '),
      content_md: data.content_md,
      status: data.status,
      scheduledAt: toLocalInput(data.scheduled_at),
      series: data.series || '',
      seriesOrder: data.series_order || 0,
      seoTitle: data.seo_title || '',
      seoDescription: data.seo_description || '',
      seoKeywords: data.seo_keywords || '',
      coverImage: data.cover_image || '',
      featured: Boolean(data.featured),
      canonicalUrl: data.canonical_url || '',
      repairRisk: data.repair?.risk || 'low',
      repairTime: data.repair?.time || '',
      repairTools: data.repair?.tools || '',
      repairModels: data.repair?.models || '',
      repairSafety: data.repair?.safety || '',
      faq: Array.isArray(data.faq) ? JSON.parse(JSON.stringify(data.faq)) : [],
    });
    loadedAt.value = data.created_at;
    lastSavedAt.value = data.updated_at;
    postViews.value = data.views || 0;
    autoSavedAt.value = '';
    savedSnapshot.value = snapshot();
    scheduleMeta();
    checkLocalDraft();
    schedulePreview(30);
  } catch (requestError) {
    if (requestError.status === 404) {
      loadNotFound.value = true;
    } else {
      loadError.value = requestError.message || '文章加载失败。';
    }
  } finally {
    loading.value = false;
  }
}

ny(
  routeId,
  async (id) => {
    if (suppressNextLoad) {
      suppressNextLoad = false;
      return
    }
    if (Number.isNaN(id)) {
      loading.value = false;
      loadError.value = '文章地址无效。';
      return
    }
    if (id === null) resetForNew();
    else await loadPost(id);
  },
  { immediate: true },
);

function schedulePreview(delay = 420) {
  window.clearTimeout(previewTimer);
  const sequence = ++previewSequence;
  if (!form.content_md.trim()) {
    previewHtml.value = '';
    previewError.value = '';
    previewLoading.value = false;
    previewMinutes.value = 1;
    return
  }
  previewLoading.value = true;
  previewTimer = window.setTimeout(() => requestPreview(sequence), delay);
}

async function requestPreview(sequence) {
  const content = form.content_md;
  if (!content.trim() || sequence !== previewSequence) return
  previewLoading.value = true;
  previewError.value = '';
  try {
    const data = await adminApi.preview(content);
    if (sequence !== previewSequence) return
    previewHtml.value = data.html || '';
    t8(() => {
      const figures = previewBody.value?.querySelectorAll('[data-image-compare]') || [];
      figures.forEach((figure) => {
        const range = figure.querySelector('.image-compare__range');
        const frame = figure.querySelector('.image-compare__frame');
        if (!range || !frame) return
        const update = () => frame.style.setProperty('--compare', `${range.value}%`);
        range.addEventListener('input', update);
        update();
      });
    });
    previewMinutes.value = data.reading_minutes || 1;
  } catch (requestError) {
    if (sequence !== previewSequence) return
    previewError.value = requestError.message || '预览暂时不可用。';
  } finally {
    if (sequence === previewSequence) previewLoading.value = false;
  }
}

ny(
  () => form.content_md,
  () => schedulePreview(),
);

ny(
  () => savedNotice.value,
  (notice) => {
    window.clearTimeout(noticeTimer);
    if (notice) {
      noticeTimer = window.setTimeout(() => {
        savedNotice.value = '';
      }, 4200);
    }
  },
);

function insertSnippet(item) {
  const element = textarea.value;
  if (!element) return
  const start = element.selectionStart ?? form.content_md.length;
  const end = element.selectionEnd ?? start;
  const selected = form.content_md.slice(start, end) || item.placeholder;
  const before = item.before || '';
  const after = item.after || '';
  form.content_md =
    form.content_md.slice(0, start) + before + selected + after + form.content_md.slice(end);
  t8(() => {
    element.focus();
    const cursorStart = start + before.length;
    element.setSelectionRange(cursorStart, cursorStart + selected.length);
  });
}

function validate() {
  if (!form.title.trim()) {
    saveError.value = '标题不能为空。';
    titleInput.value?.focus();
    return false
  }
  const parsed = parseTags();
  if (parsed.tooMany) {
    saveError.value = '每篇文章最多 8 个标签。';
    return false
  }
  if (form.status === 'scheduled') {
    const when = new Date(form.scheduledAt);
    if (!form.scheduledAt || Number.isNaN(when.getTime())) {
      saveError.value = '请选择定时发布的时间。';
      return false
    }
    if (when.getTime() <= Date.now() + 30_000) {
      saveError.value = '定时发布时间需要晚于现在。';
      return false
    }
  }
  return true
}

async function save({ silent = false } = {}) {
  if (saving.value) return
  saveError.value = '';
  if (!silent) savedNotice.value = '';
  if (!validate()) return

  saving.value = true;
  const beforeSave = snapshot();
  const revisionAtStart = formRevision;
  try {
    const parsed = parseTags();
    const scheduledAt =
      form.status === 'scheduled' ? toUtcIso(form.scheduledAt) : null;
    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || null,
      excerpt: form.excerpt.trim(),
      content_md: form.content_md,
      tags: parsed.tags,
      status: form.status === 'scheduled' ? 'draft' : form.status,
      scheduled_at: scheduledAt,
      series: form.series.trim(),
      series_order: Number(form.seriesOrder) || 0,
      seo_title: form.seoTitle.trim(),
      seo_description: form.seoDescription.trim(),
      seo_keywords: form.seoKeywords.trim(),
      cover_image: form.coverImage,
      featured: Boolean(form.featured),
      canonical_url: form.canonicalUrl.trim(),
      repair: {
        risk: form.repairRisk,
        time: form.repairTime.trim(),
        tools: form.repairTools.trim(),
        models: form.repairModels.trim(),
        safety: form.repairSafety.trim(),
      },
      faq: form.faq
        .map((item) => ({
          question: (item.question || '').trim(),
          answer: (item.answer || '').trim(),
        }))
        .filter((item) => item.question && item.answer),
    };
    const wasNew = postId.value === null;
    const result = postId.value
      ? await adminApi.updatePost(postId.value, payload)
      : await adminApi.createPost(payload);

    postId.value = result.id;
    applyingResult = true;
    form.slug = result.slug;
    form.excerpt = result.excerpt;
    form.tagsText = result.tags.join(', ');
    form.status = result.status;
    form.scheduledAt = toLocalInput(result.scheduled_at);
    form.series = result.series || '';
    form.seriesOrder = result.series_order || 0;
    form.seoTitle = result.seo_title || '';
    form.seoDescription = result.seo_description || '';
    form.seoKeywords = result.seo_keywords || '';
    form.coverImage = result.cover_image || '';
    form.featured = Boolean(result.featured);
    form.canonicalUrl = result.canonical_url || '';
    form.repairRisk = result.repair?.risk || 'low';
    form.repairTime = result.repair?.time || '';
    form.repairTools = result.repair?.tools || '';
    form.repairModels = result.repair?.models || '';
    form.repairSafety = result.repair?.safety || '';
    form.faq = Array.isArray(result.faq) ? JSON.parse(JSON.stringify(result.faq)) : [];
    postViews.value = result.views || postViews.value;
    await t8();
    applyingResult = false;
    lastSavedAt.value = result.updated_at;
    // If the author typed while the request was in flight, those newer edits
    // must stay marked as unsaved. A brand-new post follows the server route
    // after its first save, so its generated slug/excerpt should count as saved.
    savedSnapshot.value =
      wasNew || formRevision === revisionAtStart ? snapshot() : beforeSave;
    if (wasNew || formRevision === revisionAtStart) clearLocalDraft();
    else writeLocalDraft();
    scheduleMeta();

    if (silent) {
      autoSavedAt.value = new Date().toISOString();
    } else {
      savedNotice.value =
        result.status === 'scheduled'
          ? '定时发布已设置。'
          : result.status === 'published'
            ? '已经发布到公开页面。'
            : '草稿已保存。';
    }

    if (wasNew && !silent) {
      suppressNextLoad = true;
      await router.replace({
        name: 'admin-post-edit',
        params: { id: result.id },
      });
    }
  } catch (requestError) {
    saveError.value = requestError.message || '保存没有完成，请稍后再试。';
  } finally {
    saving.value = false;
  }
}

function scheduleAutoSave() {
  window.clearTimeout(autoSaveTimer);
  autoSaveTimer = window.setTimeout(async () => {
    if (
      postId.value &&
      dirty.value &&
      !saving.value &&
      !uploadingImage.value &&
      form.title.trim() &&
      !(form.status === 'scheduled' && !form.scheduledAt)
    ) {
      await save({ silent: true });
    }
    scheduleAutoSave();
  }, 28_000);
}

const commands = iH(() => [
  { label: '保存文章', hint: 'Ctrl / ⌘ + S', run: () => save() },
  { label: '切换写作 / 预览', hint: '写作与预览', run: () => (activeTab.value = activeTab.value === 'write' ? 'preview' : 'write') },
  { label: '历史版本', hint: '恢复旧稿', run: openRevisions },
  { label: '生成预览链接', hint: '草稿私有链接', run: sharePreview },
  { label: '切换专注模式', hint: '隐藏设置栏', run: toggleFocus },
  { label: '插入对比图', hint: '前后两张图', run: openCompare },
  { label: '添加 FAQ', hint: '常见问题', run: addFaq },
  { label: '从媒体库插入图片', hint: '选择图片', run: () => openMediaPicker('insert') },
  { label: '跳到正文', hint: '开始写作', run: () => textarea.value?.focus() },
]);

const filteredCommands = iH(() => {
  const needle = commandQuery.value.trim().toLowerCase();
  return commands.value.filter(
    (item) => !needle || item.label.toLowerCase().includes(needle) || item.hint.toLowerCase().includes(needle),
  )
});

function toggleFocus() {
  focusMode.value = !focusMode.value;
  try {
    window.localStorage.setItem('markblog:editor:focus', focusMode.value ? '1' : '0');
  } catch {
    // Ignore private-mode storage failures.
  }
}

function setSplit(event) {
  splitPercent.value = Number(event.target.value);
  try {
    window.localStorage.setItem('markblog:editor:split', String(splitPercent.value));
  } catch {
    // Ignore private-mode storage failures.
  }
}

ny(commandQuery, () => {
  commandIndex.value = 0;
});

function openCommand() {
  commandQuery.value = '';
  commandIndex.value = 0;
  commandOpen.value = true;
  t8(() => document.querySelector('#command-input')?.focus());
}

function runCommand(command) {
  if (!command) return
  commandOpen.value = false;
  command.run();
}

function handleCommandKey(event) {
  if (event.key === 'Escape') {
    commandOpen.value = false;
    return
  }
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    commandIndex.value = Math.min(filteredCommands.value.length - 1, commandIndex.value + 1);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    commandIndex.value = Math.max(0, commandIndex.value - 1);
  } else if (event.key === 'Enter') {
    event.preventDefault();
    runCommand(filteredCommands.value[commandIndex.value]);
  }
}

function handleKeydown(event) {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
    event.preventDefault();
    save();
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    openCommand();
  }
  if (event.key === 'Escape' && commandOpen.value) commandOpen.value = false;
}

function handleBeforeUnload(event) {
  if (!dirty.value) return
  event.preventDefault();
  event.returnValue = '';
}

ut(() => {
  if (!dirty.value) return true
  return window.confirm('还有没有保存的修改，确定离开吗？')
});

ny(
  snapshot,
  () => {
    if (applyingResult) return
    formRevision += 1;
    if (!loading.value) writeLocalDraft();
  },
  { flush: 'sync' },
);

lS(() => {
  try {
    focusMode.value = window.localStorage.getItem('markblog:editor:focus') === '1';
    const savedSplit = Number(window.localStorage.getItem('markblog:editor:split'));
    if (Number.isFinite(savedSplit) && savedSplit >= 35 && savedSplit <= 75) {
      splitPercent.value = savedSplit;
    }
  } catch {
    // Ignore private-mode storage failures.
  }
  scheduleMeta();
  scheduleAutoSave();
  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('beforeunload', handleBeforeUnload);
});

lw(() => {
  window.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('beforeunload', handleBeforeUnload);
  window.clearTimeout(previewTimer);
  window.clearTimeout(noticeTimer);
  window.clearTimeout(localDraftTimer);
  window.clearTimeout(autoSaveTimer);
  window.clearTimeout(mediaNoticeTimer);
});

return (_ctx, _cache) => {
  return (r9(), ii(AdminLayout, null, {
    default: na(() => [
      id("div", {
        class: Y(["container admin-page editor-page", { 'is-focus': focusMode.value }])
      }, [
        id("header", _hoisted_1, [
          id("div", _hoisted_2, [
            ip(tA(_t), {
              to: "/admin/posts",
              class: "editor-back"
            }, {
              default: na(() => [...(_cache[44] || (_cache[44] = [
                id("span", { "aria-hidden": "true" }, "←", -1),
                iv(" 所有文章 ", -1)
              ]))]),
              _: 1
            }),
            _cache[45] || (_cache[45] = id("p", { class: "eyebrow" }, "WRITING DESK / 写作台", -1)),
            id("h1", null, ea(isNew.value ? '写新文章' : '编辑文章'), 1)
          ]),
          id("div", _hoisted_3, [
            id("button", {
              type: "button",
              class: "text-link bare-button",
              onClick: toggleFocus
            }, ea(focusMode.value ? '退出专注' : '专注模式'), 1),
            id("button", {
              type: "button",
              class: "text-link bare-button",
              onClick: openCommand
            }, " 命令 "),
            (postId.value && form.status === 'published')
              ? (r9(), ir("a", {
                  key: 0,
                  href: `/posts/${encodeURIComponent(form.slug || '')}`,
                  target: "_blank",
                  rel: "noopener",
                  class: "editor-preview-link"
                }, " 查看公开页面 ↗ ", 8, _hoisted_4))
              : i_("", true),
            (postId.value)
              ? (r9(), ir("button", {
                  key: 1,
                  type: "button",
                  class: "text-link bare-button",
                  onClick: sharePreview
                }, " 预览链接 "))
              : i_("", true),
            (postId.value)
              ? (r9(), ir("button", {
                  key: 2,
                  type: "button",
                  class: "text-link bare-button",
                  onClick: openRevisions
                }, " 历史版本 "))
              : i_("", true),
            (postId.value)
              ? (r9(), ir("button", {
                  key: 3,
                  type: "button",
                  class: "text-link bare-button",
                  onClick: duplicateCurrent
                }, " 复制一份 "))
              : i_("", true),
            id("button", {
              type: "button",
              class: "btn",
              disabled: saving.value,
              onClick: save
            }, ea(saving.value ? '正在保存…' : '保存'), 9, _hoisted_5)
          ])
        ]),
        (loading.value)
          ? (r9(), ii(_sfc_main$2, {
              key: 0,
              tone: "loading",
              message: "正在把稿子摊开。"
            }))
          : (loadNotFound.value)
            ? (r9(), ii(_sfc_main$2, {
                key: 1,
                tone: "search",
                title: "这篇文章不在这里",
                message: "它可能已经被删除了。回到文章列表再找找。"
              }, {
                default: na(() => [
                  ip(tA(_t), {
                    to: "/admin/posts",
                    class: "btn btn--small"
                  }, {
                    default: na(() => [...(_cache[46] || (_cache[46] = [
                      iv("回到文章列表", -1)
                    ]))]),
                    _: 1
                  })
                ]),
                _: 1
              }))
            : (loadError.value)
              ? (r9(), ii(_sfc_main$2, {
                  key: 2,
                  tone: "error",
                  title: "文章没有打开",
                  message: loadError.value
                }, {
                  default: na(() => [
                    ip(tA(_t), {
                      to: "/admin/posts",
                      class: "btn btn--small"
                    }, {
                      default: na(() => [...(_cache[47] || (_cache[47] = [
                        iv("回到文章列表", -1)
                      ]))]),
                      _: 1
                    }),
                    (routeId.value && !Number.isNaN(routeId.value))
                      ? (r9(), ir("button", {
                          key: 0,
                          type: "button",
                          class: "btn btn--small",
                          onClick: _cache[0] || (_cache[0] = $event => (loadPost(routeId.value)))
                        }, " 重试 "))
                      : i_("", true)
                  ]),
                  _: 1
                }, 8, ["message"]))
              : (r9(), ir(r2, { key: 3 }, [
                  (savedNotice.value)
                    ? (r9(), ir("div", _hoisted_6, ea(savedNotice.value), 1))
                    : i_("", true),
                  (saveError.value)
                    ? (r9(), ir("p", _hoisted_7, ea(saveError.value), 1))
                    : i_("", true),
                  (previewUrl.value)
                    ? (r9(), ir("div", _hoisted_8, [
                        id("span", null, [
                          _cache[48] || (_cache[48] = iv("草稿预览：", -1)),
                          id("a", {
                            href: previewUrl.value,
                            target: "_blank",
                            rel: "noopener"
                          }, ea(previewUrl.value), 9, _hoisted_9)
                        ]),
                        id("button", {
                          type: "button",
                          class: "text-link bare-button is-danger",
                          onClick: revokePreview
                        }, "撤销链接")
                      ]))
                    : i_("", true),
                  (localDraft.value)
                    ? (r9(), ir("div", _hoisted_10, [
                        id("div", null, [
                          _cache[49] || (_cache[49] = id("strong", null, "发现本地草稿", -1)),
                          id("p", null, "保存于 " + ea(tA(formatShortDate)(localDraft.value.savedAt)) + "，比服务器上的版本更新。", 1)
                        ]),
                        id("div", _hoisted_11, [
                          id("button", {
                            type: "button",
                            class: "btn btn--small",
                            onClick: _cache[1] || (_cache[1] = $event => (applyLocalDraft(localDraft.value)))
                          }, "恢复草稿"),
                          id("button", {
                            type: "button",
                            class: "text-link bare-button",
                            onClick: discardLocalDraft
                          }, "丢弃")
                        ])
                      ]))
                    : i_("", true),
                  id("div", _hoisted_12, [
                    id("div", _hoisted_13, [
                      id("section", _hoisted_14, [
                        _cache[50] || (_cache[50] = id("label", {
                          id: "editor-title-label",
                          for: "post-title",
                          class: "visually-hidden"
                        }, "文章标题", -1)),
                        nu(id("input", {
                          id: "post-title",
                          ref_key: "titleInput",
                          ref: titleInput,
                          "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((form.title) = $event)),
                          type: "text",
                          class: "title-input",
                          maxlength: "120",
                          placeholder: "写下一个标题…",
                          autocomplete: "off"
                        }, null, 512), [
                          [o7, form.title]
                        ]),
                        id("div", _hoisted_15, [
                          id("span", null, ea(form.title.length) + " / 120", 1),
                          (autoSavedAt.value)
                            ? (r9(), ir("span", _hoisted_16, "自动保存于 " + ea(tA(formatShortDate)(autoSavedAt.value)), 1))
                            : i_("", true),
                          (dirty.value)
                            ? (r9(), ir("span", _hoisted_17, "未保存"))
                            : (lastSavedAt.value)
                              ? (r9(), ir("span", _hoisted_18, "上次保存 " + ea(tA(formatShortDate)(lastSavedAt.value)), 1))
                              : i_("", true)
                        ])
                      ]),
                      id("section", _hoisted_19, [
                        _cache[51] || (_cache[51] = id("label", {
                          for: "post-excerpt",
                          class: "field-label"
                        }, [
                          iv("摘要 "),
                          id("span", { class: "label-optional" }, "选填")
                        ], -1)),
                        nu(id("textarea", {
                          id: "post-excerpt",
                          "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((form.excerpt) = $event)),
                          class: "textarea excerpt-input",
                          rows: "2",
                          maxlength: "300",
                          placeholder: "留空会根据正文自动生成，也可以写一两句，让文章在列表里更好认。"
                        }, null, 512), [
                          [o7, form.excerpt]
                        ]),
                        id("p", _hoisted_20, ea(form.excerpt.length) + " / 300", 1)
                      ]),
                      id("section", _hoisted_21, [
                        id("div", _hoisted_22, [
                          _cache[53] || (_cache[53] = id("h2", { id: "writing-label" }, "正文", -1)),
                          id("label", _hoisted_23, [
                            _cache[52] || (_cache[52] = id("span", null, "分栏", -1)),
                            id("input", {
                              type: "range",
                              min: "35",
                              max: "75",
                              step: "1",
                              value: splitPercent.value,
                              onInput: setSplit
                            }, null, 40, _hoisted_24),
                            id("small", null, ea(splitPercent.value) + " / " + ea(100 - splitPercent.value), 1)
                          ]),
                          id("div", _hoisted_25, [
                            id("button", {
                              type: "button",
                              role: "tab",
                              "aria-selected": activeTab.value === 'write',
                              class: Y({ 'is-active': activeTab.value === 'write' }),
                              onClick: _cache[4] || (_cache[4] = $event => (activeTab.value = 'write'))
                            }, " 写作 ", 10, _hoisted_26),
                            id("button", {
                              type: "button",
                              role: "tab",
                              "aria-selected": activeTab.value === 'preview',
                              class: Y({ 'is-active': activeTab.value === 'preview' }),
                              onClick: _cache[5] || (_cache[5] = $event => (activeTab.value = 'preview'))
                            }, " 预览 ", 10, _hoisted_27)
                          ])
                        ]),
                        id("div", _hoisted_28, [
                          (r9(), ir(r2, null, lj(toolbar, (item) => {
                            return id("button", {
                              key: item.title,
                              type: "button",
                              class: "toolbar-button",
                              title: item.title,
                              "aria-label": item.title,
                              onClick: $event => (insertSnippet(item))
                            }, ea(item.label), 9, _hoisted_29)
                          }), 64)),
                          id("button", {
                            type: "button",
                            class: "toolbar-button toolbar-button--image",
                            disabled: uploadingImage.value,
                            title: "上传图片",
                            "aria-label": "上传图片",
                            onClick: _cache[6] || (_cache[6] = $event => (imageInput.value?.click()))
                          }, ea(uploadingImage.value ? '上传中…' : '图片'), 9, _hoisted_30),
                          id("button", {
                            type: "button",
                            class: "toolbar-button toolbar-button--image",
                            onClick: _cache[7] || (_cache[7] = $event => (openMediaPicker('insert')))
                          }, " 媒体库 "),
                          id("button", {
                            type: "button",
                            class: "toolbar-button toolbar-button--image",
                            onClick: openCompare
                          }, " 对比图 "),
                          _cache[54] || (_cache[54] = id("span", { class: "toolbar-hint" }, "Markdown", -1))
                        ]),
                        id("input", {
                          ref_key: "imageInput",
                          ref: imageInput,
                          class: "visually-hidden",
                          type: "file",
                          accept: "image/jpeg,image/png,image/webp,image/gif",
                          onChange: handleImageInput
                        }, null, 544),
                        (mediaError.value)
                          ? (r9(), ir("p", _hoisted_31, ea(mediaError.value), 1))
                          : i_("", true),
                        (mediaNotice.value)
                          ? (r9(), ir("p", _hoisted_32, ea(mediaNotice.value), 1))
                          : i_("", true),
                        id("div", {
                          class: Y(["editor-panes", `is-${activeTab.value}`]),
                          style: G(editorPanesStyle.value)
                        }, [
                          id("div", _hoisted_33, [
                            _cache[56] || (_cache[56] = id("label", {
                              for: "post-content",
                              class: "visually-hidden"
                            }, "Markdown 正文", -1)),
                            nu(id("textarea", {
                              id: "post-content",
                              ref_key: "textarea",
                              ref: textarea,
                              "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => ((form.content_md) = $event)),
                              class: "markdown-input",
                              maxlength: "200000",
                              spellcheck: "false",
                              placeholder: "在这里写正文。支持 Markdown：## 标题、**加粗**、> 引用、``` 代码块…… 也可以直接粘贴截图上传。",
                              onPaste: handlePaste
                            }, null, 544), [
                              [o7, form.content_md]
                            ]),
                            id("div", _hoisted_34, [
                              id("span", null, ea(contentLength.value.toLocaleString('zh-CN')) + " 字符", 1),
                              _cache[55] || (_cache[55] = id("span", null, "Ctrl / ⌘ + S 保存", -1))
                            ])
                          ]),
                          id("div", _hoisted_35, [
                            id("div", _hoisted_36, [
                              _cache[57] || (_cache[57] = id("span", null, "预览", -1)),
                              (previewMinutes.value)
                                ? (r9(), ir("span", _hoisted_37, "约 " + ea(previewMinutes.value) + " 分钟", 1))
                                : i_("", true)
                            ]),
                            id("div", _hoisted_38, [
                              (previewError.value)
                                ? (r9(), ir("p", _hoisted_39, ea(previewError.value), 1))
                                : (previewLoading.value && !previewHtml.value)
                                  ? (r9(), ir("p", _hoisted_40, " 正在排版… "))
                                  : (previewHtml.value)
                                    ? (r9(), ir("div", {
                                        key: 2,
                                        ref_key: "previewBody",
                                        ref: previewBody,
                                        class: "prose preview-prose",
                                        innerHTML: previewHtml.value
                                      }, null, 8, _hoisted_41))
                                    : (r9(), ir("p", _hoisted_42, " 写下第一段，右边就会出现排好版的纸页。 "))
                            ])
                          ])
                        ], 6)
                      ])
                    ]),
                    id("aside", _hoisted_43, [
                      id("div", _hoisted_44, [
                        id("section", _hoisted_45, [
                          _cache[65] || (_cache[65] = id("div", { class: "meta-card__head" }, [
                            id("h2", null, "发布状态")
                          ], -1)),
                          id("div", _hoisted_46, [
                            id("label", {
                              class: Y(["status-option", { 'is-active': form.status === 'draft' }])
                            }, [
                              nu(id("input", {
                                "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => ((form.status) = $event)),
                                type: "radio",
                                value: "draft",
                                name: "status"
                              }, null, 512), [
                                [sn, form.status]
                              ]),
                              _cache[58] || (_cache[58] = id("span", {
                                class: "status-option__dot",
                                "aria-hidden": "true"
                              }, null, -1)),
                              _cache[59] || (_cache[59] = id("span", null, [
                                id("strong", null, "草稿"),
                                id("small", null, "仅自己可见")
                              ], -1))
                            ], 2),
                            id("label", {
                              class: Y(["status-option", { 'is-active': form.status === 'published' }])
                            }, [
                              nu(id("input", {
                                "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => ((form.status) = $event)),
                                type: "radio",
                                value: "published",
                                name: "status"
                              }, null, 512), [
                                [sn, form.status]
                              ]),
                              _cache[60] || (_cache[60] = id("span", {
                                class: "status-option__dot",
                                "aria-hidden": "true"
                              }, null, -1)),
                              _cache[61] || (_cache[61] = id("span", null, [
                                id("strong", null, "发布"),
                                id("small", null, "公开到文章列表")
                              ], -1))
                            ], 2),
                            id("label", {
                              class: Y(["status-option", { 'is-active': form.status === 'scheduled' }])
                            }, [
                              nu(id("input", {
                                "onUpdate:modelValue": _cache[11] || (_cache[11] = $event => ((form.status) = $event)),
                                type: "radio",
                                value: "scheduled",
                                name: "status"
                              }, null, 512), [
                                [sn, form.status]
                              ]),
                              _cache[62] || (_cache[62] = id("span", {
                                class: "status-option__dot",
                                "aria-hidden": "true"
                              }, null, -1)),
                              _cache[63] || (_cache[63] = id("span", null, [
                                id("strong", null, "定时发布"),
                                id("small", null, "到点自动上线")
                              ], -1))
                            ], 2)
                          ]),
                          (form.status === 'scheduled')
                            ? (r9(), ir("div", _hoisted_47, [
                                _cache[64] || (_cache[64] = id("label", { for: "post-scheduled-at" }, "上线时间", -1)),
                                nu(id("input", {
                                  id: "post-scheduled-at",
                                  "onUpdate:modelValue": _cache[12] || (_cache[12] = $event => ((form.scheduledAt) = $event)),
                                  class: "input",
                                  type: "datetime-local"
                                }, null, 512), [
                                  [o7, form.scheduledAt]
                                ])
                              ]))
                            : i_("", true),
                          _cache[66] || (_cache[66] = id("p", { class: "meta-card__note" }, " 切换为草稿后保存，会从公开页面移除。自动保存每 28 秒检查一次。 ", -1))
                        ]),
                        id("section", _hoisted_48, [
                          _cache[68] || (_cache[68] = id("div", { class: "meta-card__head" }, [
                            id("h2", null, "封面与推荐")
                          ], -1)),
                          (form.coverImage)
                            ? (r9(), ir("div", _hoisted_49, [
                                id("img", {
                                  src: form.coverImage,
                                  alt: "文章封面"
                                }, null, 8, _hoisted_50),
                                id("div", _hoisted_51, [
                                  id("button", {
                                    type: "button",
                                    class: "text-link bare-button",
                                    onClick: _cache[13] || (_cache[13] = $event => (openMediaPicker('cover')))
                                  }, "更换"),
                                  id("button", {
                                    type: "button",
                                    class: "text-link bare-button is-danger",
                                    onClick: _cache[14] || (_cache[14] = $event => (form.coverImage = ''))
                                  }, "移除")
                                ])
                              ]))
                            : (r9(), ir("button", {
                                key: 1,
                                type: "button",
                                class: "btn btn--small",
                                onClick: _cache[15] || (_cache[15] = $event => (openMediaPicker('cover')))
                              }, " 选择封面 ")),
                          id("label", _hoisted_52, [
                            nu(id("input", {
                              "onUpdate:modelValue": _cache[16] || (_cache[16] = $event => ((form.featured) = $event)),
                              type: "checkbox"
                            }, null, 512), [
                              [se, form.featured]
                            ]),
                            _cache[67] || (_cache[67] = id("span", null, "推荐 / 置顶到首页前面", -1))
                          ])
                        ]),
                        id("details", _hoisted_53, [
                          id("summary", _hoisted_54, [
                            _cache[69] || (_cache[69] = id("span", null, "链接与标签", -1)),
                            id("small", null, ea(tags.value.length) + " 个标签 · " + ea(form.series || '未归系列'), 1)
                          ]),
                          id("div", _hoisted_55, [
                            id("div", _hoisted_56, [
                              _cache[71] || (_cache[71] = id("label", { for: "post-slug" }, "文章地址", -1)),
                              id("div", _hoisted_57, [
                                _cache[70] || (_cache[70] = id("span", { class: "slug-prefix" }, "/posts/", -1)),
                                nu(id("input", {
                                  id: "post-slug",
                                  "onUpdate:modelValue": _cache[17] || (_cache[17] = $event => ((form.slug) = $event)),
                                  class: "input",
                                  type: "text",
                                  maxlength: "100",
                                  placeholder: "留空自动生成",
                                  autocomplete: "off",
                                  spellcheck: "false"
                                }, null, 512), [
                                  [o7, form.slug]
                                ])
                              ]),
                              _cache[72] || (_cache[72] = id("p", { class: "field-hint" }, "建议使用简短的英文或数字，留空会根据标题生成。", -1))
                            ]),
                            id("div", _hoisted_58, [
                              _cache[73] || (_cache[73] = id("label", { for: "post-tags" }, "标签", -1)),
                              nu(id("input", {
                                id: "post-tags",
                                "onUpdate:modelValue": _cache[18] || (_cache[18] = $event => ((form.tagsText) = $event)),
                                class: "input",
                                type: "text",
                                maxlength: "240",
                                placeholder: "写作, 技术, 日常",
                                autocomplete: "off"
                              }, null, 512), [
                                [o7, form.tagsText]
                              ]),
                              id("p", _hoisted_59, "用逗号分隔，最多 8 个。当前 " + ea(tags.value.length) + " 个。", 1)
                            ]),
                            id("div", _hoisted_60, [
                              _cache[74] || (_cache[74] = id("label", { for: "post-series" }, "系列", -1)),
                              nu(id("input", {
                                id: "post-series",
                                "onUpdate:modelValue": _cache[19] || (_cache[19] = $event => ((form.series) = $event)),
                                class: "input",
                                type: "text",
                                maxlength: "60",
                                placeholder: "例如：开机故障排查",
                                autocomplete: "off"
                              }, null, 512), [
                                [o7, form.series]
                              ]),
                              _cache[75] || (_cache[75] = id("p", { class: "field-hint" }, "同系列文章会出现在文章底部的系列导航中，并生成系列页。", -1))
                            ]),
                            (form.series.trim())
                              ? (r9(), ir("div", _hoisted_61, [
                                  _cache[76] || (_cache[76] = id("label", { for: "post-series-order" }, "系列顺序", -1)),
                                  nu(id("input", {
                                    id: "post-series-order",
                                    "onUpdate:modelValue": _cache[20] || (_cache[20] = $event => ((form.seriesOrder) = $event)),
                                    class: "input",
                                    type: "number",
                                    min: "0",
                                    max: "999"
                                  }, null, 512), [
                                    [
                                      o7,
                                      form.seriesOrder,
                                      void 0,
                                      { number: true }
                                    ]
                                  ]),
                                  _cache[77] || (_cache[77] = id("p", { class: "field-hint" }, "数字小的排在前面，同序号按发布时间。", -1))
                                ]))
                              : i_("", true)
                          ])
                        ]),
                        id("details", _hoisted_62, [
                          _cache[84] || (_cache[84] = id("summary", { class: "seo-card__summary" }, [
                            id("span", null, "维修速览"),
                            id("small", null, "显示在文章正文前")
                          ], -1)),
                          id("div", _hoisted_63, [
                            id("button", {
                              type: "button",
                              class: "text-link bare-button repair-template",
                              onClick: applyRepairTemplate
                            }, " 套用维修教程模板 "),
                            id("div", _hoisted_64, [
                              _cache[79] || (_cache[79] = id("label", { for: "repair-risk" }, "风险等级", -1)),
                              nu(id("select", {
                                id: "repair-risk",
                                "onUpdate:modelValue": _cache[21] || (_cache[21] = $event => ((form.repairRisk) = $event)),
                                class: "select"
                              }, [...(_cache[78] || (_cache[78] = [
                                id("option", { value: "low" }, "低风险", -1),
                                id("option", { value: "medium" }, "中等风险", -1),
                                id("option", { value: "high" }, "高风险", -1)
                              ]))], 512), [
                                [sl, form.repairRisk]
                              ])
                            ]),
                            id("div", _hoisted_65, [
                              _cache[80] || (_cache[80] = id("label", { for: "repair-time" }, "预计耗时", -1)),
                              nu(id("input", {
                                id: "repair-time",
                                "onUpdate:modelValue": _cache[22] || (_cache[22] = $event => ((form.repairTime) = $event)),
                                class: "input",
                                maxlength: "40",
                                placeholder: "例如 30 分钟"
                              }, null, 512), [
                                [o7, form.repairTime]
                              ])
                            ]),
                            id("div", _hoisted_66, [
                              _cache[81] || (_cache[81] = id("label", { for: "repair-models" }, "适用机型", -1)),
                              nu(id("input", {
                                id: "repair-models",
                                "onUpdate:modelValue": _cache[23] || (_cache[23] = $event => ((form.repairModels) = $event)),
                                class: "input",
                                maxlength: "300",
                                placeholder: "例如 ThinkPad T480 / 通用台式机"
                              }, null, 512), [
                                [o7, form.repairModels]
                              ])
                            ]),
                            id("div", _hoisted_67, [
                              _cache[82] || (_cache[82] = id("label", { for: "repair-tools" }, "工具与材料", -1)),
                              nu(id("textarea", {
                                id: "repair-tools",
                                "onUpdate:modelValue": _cache[24] || (_cache[24] = $event => ((form.repairTools) = $event)),
                                class: "textarea",
                                rows: "2",
                                maxlength: "300"
                              }, null, 512), [
                                [o7, form.repairTools]
                              ])
                            ]),
                            id("div", _hoisted_68, [
                              _cache[83] || (_cache[83] = id("label", { for: "repair-safety" }, "安全提醒", -1)),
                              nu(id("textarea", {
                                id: "repair-safety",
                                "onUpdate:modelValue": _cache[25] || (_cache[25] = $event => ((form.repairSafety) = $event)),
                                class: "textarea",
                                rows: "3",
                                maxlength: "600"
                              }, null, 512), [
                                [o7, form.repairSafety]
                              ])
                            ])
                          ])
                        ]),
                        id("details", _hoisted_69, [
                          _cache[89] || (_cache[89] = id("summary", { class: "seo-card__summary" }, [
                            id("span", null, "SEO 设置"),
                            id("small", null, "每篇文章的标题、描述与关键词")
                          ], -1)),
                          id("div", _hoisted_70, [
                            id("div", _hoisted_71, [
                              _cache[85] || (_cache[85] = id("label", { for: "post-seo-title" }, "SEO 标题", -1)),
                              nu(id("input", {
                                id: "post-seo-title",
                                "onUpdate:modelValue": _cache[26] || (_cache[26] = $event => ((form.seoTitle) = $event)),
                                class: "input",
                                maxlength: "120",
                                placeholder: "留空使用文章标题"
                              }, null, 512), [
                                [o7, form.seoTitle]
                              ])
                            ]),
                            id("div", _hoisted_72, [
                              _cache[86] || (_cache[86] = id("label", { for: "post-seo-description" }, "SEO 描述", -1)),
                              nu(id("textarea", {
                                id: "post-seo-description",
                                "onUpdate:modelValue": _cache[27] || (_cache[27] = $event => ((form.seoDescription) = $event)),
                                class: "textarea",
                                rows: "3",
                                maxlength: "300",
                                placeholder: "留空使用摘要"
                              }, null, 512), [
                                [o7, form.seoDescription]
                              ])
                            ]),
                            id("div", _hoisted_73, [
                              _cache[87] || (_cache[87] = id("label", { for: "post-seo-keywords" }, "SEO 关键词", -1)),
                              nu(id("input", {
                                id: "post-seo-keywords",
                                "onUpdate:modelValue": _cache[28] || (_cache[28] = $event => ((form.seoKeywords) = $event)),
                                class: "input",
                                maxlength: "300",
                                placeholder: "留空使用站点关键词"
                              }, null, 512), [
                                [o7, form.seoKeywords]
                              ])
                            ]),
                            id("div", _hoisted_74, [
                              _cache[88] || (_cache[88] = id("label", { for: "post-canonical" }, "Canonical 地址", -1)),
                              nu(id("input", {
                                id: "post-canonical",
                                "onUpdate:modelValue": _cache[29] || (_cache[29] = $event => ((form.canonicalUrl) = $event)),
                                class: "input",
                                maxlength: "400",
                                placeholder: "留空使用本站文章地址"
                              }, null, 512), [
                                [o7, form.canonicalUrl]
                              ])
                            ])
                          ])
                        ]),
                        id("details", _hoisted_75, [
                          id("summary", _hoisted_76, [
                            _cache[90] || (_cache[90] = id("span", null, "FAQ / 常见问题", -1)),
                            id("small", null, ea(form.faq.length) + " 条 · 生成 FAQPage", 1)
                          ]),
                          id("div", _hoisted_77, [
                            id("button", {
                              type: "button",
                              class: "text-link bare-button repair-template",
                              onClick: addFaq
                            }, " ＋ 添加一条问答 "),
                            (r9(true), ir(r2, null, lj(form.faq, (item, index) => {
                              return (r9(), ir("div", {
                                key: index,
                                class: "faq-editor__item"
                              }, [
                                id("div", _hoisted_78, [
                                  id("label", {
                                    for: `faq-q-${index}`
                                  }, "问题 " + ea(index + 1), 9, _hoisted_79),
                                  nu(id("input", {
                                    id: `faq-q-${index}`,
                                    "onUpdate:modelValue": $event => ((item.question) = $event),
                                    class: "input",
                                    maxlength: "200"
                                  }, null, 8, _hoisted_80), [
                                    [o7, item.question]
                                  ])
                                ]),
                                id("div", _hoisted_81, [
                                  id("label", {
                                    for: `faq-a-${index}`
                                  }, "回答", 8, _hoisted_82),
                                  nu(id("textarea", {
                                    id: `faq-a-${index}`,
                                    "onUpdate:modelValue": $event => ((item.answer) = $event),
                                    class: "textarea",
                                    rows: "3",
                                    maxlength: "1200"
                                  }, null, 8, _hoisted_83), [
                                    [o7, item.answer]
                                  ])
                                ]),
                                id("button", {
                                  type: "button",
                                  class: "text-link bare-button is-danger",
                                  onClick: $event => (removeFaq(index))
                                }, "删除这一条", 8, _hoisted_84)
                              ]))
                            }), 128))
                          ])
                        ]),
                        id("section", _hoisted_85, [
                          _cache[95] || (_cache[95] = id("div", { class: "meta-card__head" }, [
                            id("h2", null, "这一页")
                          ], -1)),
                          id("dl", _hoisted_86, [
                            id("div", null, [
                              _cache[91] || (_cache[91] = id("dt", null, "创建", -1)),
                              id("dd", null, ea(loadedAt.value ? tA(formatShortDate)(loadedAt.value) : '还没保存'), 1)
                            ]),
                            id("div", null, [
                              _cache[92] || (_cache[92] = id("dt", null, "最近保存", -1)),
                              id("dd", null, ea(lastSavedAt.value ? tA(formatShortDate)(lastSavedAt.value) : '还没保存'), 1)
                            ]),
                            id("div", null, [
                              _cache[93] || (_cache[93] = id("dt", null, "正文字符", -1)),
                              id("dd", null, ea(contentLength.value.toLocaleString('zh-CN')), 1)
                            ]),
                            (postId.value)
                              ? (r9(), ir("div", _hoisted_87, [
                                  _cache[94] || (_cache[94] = id("dt", null, "阅读量", -1)),
                                  id("dd", null, ea(postViews.value.toLocaleString('zh-CN')), 1)
                                ]))
                              : i_("", true)
                          ])
                        ])
                      ]),
                      id("div", _hoisted_88, [
                        id("span", _hoisted_89, [
                          (saving.value)
                            ? (r9(), ir(r2, { key: 0 }, [
                                iv("正在保存…")
                              ], 64))
                            : (dirty.value)
                              ? (r9(), ir(r2, { key: 1 }, [
                                  iv("有未保存的修改")
                                ], 64))
                              : (r9(), ir(r2, { key: 2 }, [
                                  iv("已保存")
                                ], 64))
                        ]),
                        id("button", {
                          type: "button",
                          class: "btn btn--small",
                          disabled: saving.value,
                          onClick: save
                        }, ea(saving.value ? '保存中…' : '保存'), 9, _hoisted_90)
                      ])
                    ])
                  ])
                ], 64))
      ], 2),
      (r9(), ii(nO, { to: "body" }, [
        (commandOpen.value)
          ? (r9(), ir("div", {
              key: 0,
              class: "command-dialog",
              role: "dialog",
              "aria-modal": "true",
              "aria-label": "命令面板",
              onClick: _cache[31] || (_cache[31] = sd($event => (commandOpen.value = false), ["self"]))
            }, [
              id("div", _hoisted_91, [
                nu(id("input", {
                  id: "command-input",
                  "onUpdate:modelValue": _cache[30] || (_cache[30] = $event => ((commandQuery).value = $event)),
                  class: "command-input",
                  placeholder: "搜索命令…  ↑↓ 选择，Enter 执行",
                  autocomplete: "off",
                  onKeydown: handleCommandKey
                }, null, 544), [
                  [o7, commandQuery.value]
                ]),
                id("div", _hoisted_92, [
                  (r9(true), ir(r2, null, lj(filteredCommands.value, (command, index) => {
                    return (r9(), ir("button", {
                      key: command.label,
                      type: "button",
                      class: Y(["command-item", { 'is-active': index === commandIndex.value }]),
                      onMouseenter: $event => (commandIndex.value = index),
                      onClick: $event => (runCommand(command))
                    }, [
                      id("span", null, ea(command.label), 1),
                      id("small", null, ea(command.hint), 1)
                    ], 42, _hoisted_93))
                  }), 128)),
                  (!filteredCommands.value.length)
                    ? (r9(), ir("p", _hoisted_94, "没有匹配的命令。"))
                    : i_("", true)
                ])
              ])
            ]))
          : i_("", true)
      ])),
      ip(MediaPicker, {
        open: mediaPickerOpen.value,
        title: mediaPickerMode.value === 'cover' ? '选择文章封面' : mediaPickerMode.value === 'compare-before' ? '选择对比前图片' : mediaPickerMode.value === 'compare-after' ? '选择对比后图片' : '从媒体库插入图片',
        onSelect: handleMediaSelected,
        onClose: _cache[32] || (_cache[32] = $event => (mediaPickerOpen.value = false))
      }, null, 8, ["open", "title"]),
      (r9(), ii(nO, { to: "body" }, [
        (compareOpen.value)
          ? (r9(), ir("div", {
              key: 0,
              class: "compare-dialog",
              role: "dialog",
              "aria-modal": "true",
              "aria-label": "插入对比图",
              onClick: _cache[41] || (_cache[41] = sd($event => (compareOpen.value = false), ["self"]))
            }, [
              id("div", _hoisted_95, [
                id("header", _hoisted_96, [
                  _cache[96] || (_cache[96] = id("div", null, [
                    id("p", { class: "eyebrow" }, "BEFORE / AFTER"),
                    id("h2", null, "插入维修对比图")
                  ], -1)),
                  id("button", {
                    type: "button",
                    class: "text-link bare-button",
                    onClick: _cache[33] || (_cache[33] = $event => (compareOpen.value = false))
                  }, "关闭")
                ]),
                id("div", _hoisted_97, [
                  id("button", {
                    type: "button",
                    class: "compare-pick",
                    onClick: _cache[34] || (_cache[34] = $event => (openMediaPicker('compare-before')))
                  }, [
                    (compareDraft.before)
                      ? (r9(), ir("img", {
                          key: 0,
                          src: compareDraft.before,
                          alt: ""
                        }, null, 8, _hoisted_98))
                      : (r9(), ir("span", _hoisted_99, "选择「之前」图片"))
                  ]),
                  id("button", {
                    type: "button",
                    class: "compare-pick",
                    onClick: _cache[35] || (_cache[35] = $event => (openMediaPicker('compare-after')))
                  }, [
                    (compareDraft.after)
                      ? (r9(), ir("img", {
                          key: 0,
                          src: compareDraft.after,
                          alt: ""
                        }, null, 8, _hoisted_100))
                      : (r9(), ir("span", _hoisted_101, "选择「之后」图片"))
                  ])
                ]),
                (mediaError.value)
                  ? (r9(), ir("p", _hoisted_102, ea(mediaError.value), 1))
                  : i_("", true),
                id("div", _hoisted_103, [
                  id("div", _hoisted_104, [
                    _cache[97] || (_cache[97] = id("label", { for: "compare-label" }, "标题", -1)),
                    nu(id("input", {
                      id: "compare-label",
                      "onUpdate:modelValue": _cache[36] || (_cache[36] = $event => ((compareDraft.label) = $event)),
                      class: "input"
                    }, null, 512), [
                      [o7, compareDraft.label]
                    ])
                  ]),
                  id("div", _hoisted_105, [
                    _cache[98] || (_cache[98] = id("label", { for: "compare-before-label" }, "前标签", -1)),
                    nu(id("input", {
                      id: "compare-before-label",
                      "onUpdate:modelValue": _cache[37] || (_cache[37] = $event => ((compareDraft.beforeLabel) = $event)),
                      class: "input"
                    }, null, 512), [
                      [o7, compareDraft.beforeLabel]
                    ])
                  ]),
                  id("div", _hoisted_106, [
                    _cache[99] || (_cache[99] = id("label", { for: "compare-after-label" }, "后标签", -1)),
                    nu(id("input", {
                      id: "compare-after-label",
                      "onUpdate:modelValue": _cache[38] || (_cache[38] = $event => ((compareDraft.afterLabel) = $event)),
                      class: "input"
                    }, null, 512), [
                      [o7, compareDraft.afterLabel]
                    ])
                  ]),
                  id("div", _hoisted_107, [
                    _cache[100] || (_cache[100] = id("label", { for: "compare-caption" }, "说明", -1)),
                    nu(id("input", {
                      id: "compare-caption",
                      "onUpdate:modelValue": _cache[39] || (_cache[39] = $event => ((compareDraft.caption) = $event)),
                      class: "input"
                    }, null, 512), [
                      [o7, compareDraft.caption]
                    ])
                  ])
                ]),
                id("div", _hoisted_108, [
                  id("button", {
                    type: "button",
                    class: "btn btn--small",
                    onClick: _cache[40] || (_cache[40] = $event => (compareOpen.value = false))
                  }, "取消"),
                  id("button", {
                    type: "button",
                    class: "btn btn--small btn--solid",
                    onClick: insertCompare
                  }, "插入到正文")
                ])
              ])
            ]))
          : i_("", true)
      ])),
      (r9(), ii(nO, { to: "body" }, [
        (revisionsOpen.value)
          ? (r9(), ir("div", {
              key: 0,
              class: "revision-dialog",
              role: "dialog",
              "aria-modal": "true",
              "aria-label": "历史版本",
              onClick: _cache[43] || (_cache[43] = sd($event => (revisionsOpen.value = false), ["self"]))
            }, [
              id("div", _hoisted_109, [
                id("header", _hoisted_110, [
                  _cache[101] || (_cache[101] = id("div", null, [
                    id("p", { class: "eyebrow" }, "HISTORY / 历史版本"),
                    id("h2", null, "历史版本")
                  ], -1)),
                  id("button", {
                    type: "button",
                    class: "text-link bare-button",
                    onClick: _cache[42] || (_cache[42] = $event => (revisionsOpen.value = false))
                  }, "关闭")
                ]),
                (revisionError.value)
                  ? (r9(), ir("p", _hoisted_111, ea(revisionError.value), 1))
                  : i_("", true),
                id("div", _hoisted_112, [
                  id("div", _hoisted_113, [
                    (revisionLoading.value)
                      ? (r9(), ir("p", _hoisted_114, "正在读取版本…"))
                      : i_("", true),
                    (r9(true), ir(r2, null, lj(revisions.value, (rev) => {
                      return (r9(), ir("button", {
                        key: rev.id,
                        type: "button",
                        class: Y(["revision-item", { 'is-active': selectedRevision.value?.id === rev.id }]),
                        onClick: $event => (selectRevision(rev))
                      }, [
                        id("span", null, ea(tA(formatShortDate)(rev.created_at)), 1),
                        id("strong", null, ea(rev.title), 1)
                      ], 10, _hoisted_115))
                    }), 128)),
                    (!revisionLoading.value && !revisions.value.length)
                      ? (r9(), ir("p", _hoisted_116, "还没有历史版本。下一次保存后会开始记录。"))
                      : i_("", true)
                  ]),
                  id("div", _hoisted_117, [
                    (selectedRevision.value)
                      ? (r9(), ir(r2, { key: 0 }, [
                          id("div", _hoisted_118, [
                            _cache[102] || (_cache[102] = id("span", null, "与当前稿对比", -1)),
                            id("button", {
                              type: "button",
                              class: "btn btn--small",
                              disabled: revisionBusy.value,
                              onClick: restoreSelectedRevision
                            }, ea(revisionBusy.value ? '恢复中…' : '恢复这一版'), 9, _hoisted_119)
                          ]),
                          id("pre", null, [
                            (r9(true), ir(r2, null, lj(revisionDiff.value, (part, index) => {
                              return (r9(), ir("span", {
                                key: index,
                                class: Y({ 'is-added': part.added, 'is-removed': part.removed })
                              }, ea(part.value), 3))
                            }), 128))
                          ])
                        ], 64))
                      : (r9(), ir("p", _hoisted_120, "从左侧选择一个版本，看看它改了什么。"))
                  ])
                ])
              ])
            ]))
          : i_("", true)
      ]))
    ]),
    _: 1
  }))
}
}

};
const AdminEditorView = /*#__PURE__*/_export_sfc(_sfc_main, [['__scopeId',"data-v-74020e39"]]);

export { AdminEditorView as default };
