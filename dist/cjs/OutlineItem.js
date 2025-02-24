"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const Ref_js_1 = __importDefault(require("./Ref.js"));
const useCachedValue_js_1 = __importDefault(require("./shared/hooks/useCachedValue.js"));
const useDocumentContext_js_1 = __importDefault(require("./shared/hooks/useDocumentContext.js"));
const useOutlineContext_js_1 = __importDefault(require("./shared/hooks/useOutlineContext.js"));
function OutlineItem(props) {
    const documentContext = (0, useDocumentContext_js_1.default)();
    const outlineContext = (0, useOutlineContext_js_1.default)();
    (0, tiny_invariant_1.default)(outlineContext, 'Unable to find Outline context.');
    const mergedProps = Object.assign(Object.assign(Object.assign({}, documentContext), outlineContext), props);
    const { item, linkService, onItemClick, pdf } = mergedProps, otherProps = __rest(mergedProps, ["item", "linkService", "onItemClick", "pdf"]);
    (0, tiny_invariant_1.default)(pdf, 'Attempted to load an outline, but no document was specified. Wrap <Outline /> in a <Document /> or pass explicit `pdf` prop.');
    const getDestination = (0, useCachedValue_js_1.default)(() => {
        if (typeof item.dest === 'string') {
            return pdf.getDestination(item.dest);
        }
        return item.dest;
    });
    const getPageIndex = (0, useCachedValue_js_1.default)(async () => {
        const destination = await getDestination();
        if (!destination) {
            throw new Error('Destination not found.');
        }
        const [ref] = destination;
        return pdf.getPageIndex(new Ref_js_1.default(ref));
    });
    const getPageNumber = (0, useCachedValue_js_1.default)(async () => {
        const pageIndex = await getPageIndex();
        return pageIndex + 1;
    });
    function onClick(event) {
        event.preventDefault();
        (0, tiny_invariant_1.default)(onItemClick || linkService, 'Either onItemClick callback or linkService must be defined in order to navigate to an outline item.');
        if (onItemClick) {
            Promise.all([getDestination(), getPageIndex(), getPageNumber()]).then(([dest, pageIndex, pageNumber]) => {
                onItemClick({
                    dest,
                    pageIndex,
                    pageNumber,
                });
            });
        }
        else if (linkService) {
            linkService.goToDestination(item.dest);
        }
    }
    function renderSubitems() {
        if (!item.items || !item.items.length) {
            return null;
        }
        const { items: subitems } = item;
        return ((0, jsx_runtime_1.jsx)("ul", { children: subitems.map((subitem, subitemIndex) => ((0, jsx_runtime_1.jsx)(OutlineItem, Object.assign({ item: subitem, pdf: pdf }, otherProps), typeof subitem.dest === 'string' ? subitem.dest : subitemIndex))) }));
    }
    return ((0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("a", { href: "#", onClick: onClick, children: item.title }), renderSubitems()] }));
}
exports.default = OutlineItem;
