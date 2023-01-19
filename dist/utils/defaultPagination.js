"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (obj) => {
    let { limit = 10, skip = 0, search = '' } = obj || {};
    limit = parseInt(limit);
    skip = parseInt(skip);
    search = search.replace(/\\/g, '\\\\')
        .replace(/\$/g, '\\$')
        .replace(/\*/g, '\\*')
        .replace(/\+/g, '\\+')
        .replace(/\[/g, '\\[')
        .replace(/\]/g, '\\]')
        .replace(/\)/g, '\\)')
        .replace(/\(/g, '\\(')
        .replace(/'/g, '\\\'')
        .replace(/"/g, '\\"');
    let regSearch = '';
    if (search)
        regSearch = { $regex: new RegExp('^.*' + search + '.*', 'i') };
    if (!limit)
        limit = 10;
    return { limit, skip, search: regSearch };
};
