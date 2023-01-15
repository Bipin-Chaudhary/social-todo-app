export default (obj) => {
  let { limit = 10, page = 1, search = '' } = obj || {}

  limit = parseInt(limit)
  page = parseInt(page)

  search = search.replace(/\\/g, '\\\\')
    .replace(/\$/g, '\\$')
    .replace(/\*/g, '\\*')
    .replace(/\+/g, '\\+')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\)/g, '\\)')
    .replace(/\(/g, '\\(')
    .replace(/'/g, '\\\'')
    .replace(/"/g, '\\"')

  let regSearch:any = ''
  if (search) regSearch = { $regex: new RegExp('^.*' + search + '.*', 'i') }

  if (!limit || limit === 'undefined' || limit === 1) limit = 10
  const skip = page > 0 ? ((page - 1) * limit) : 0

  return { limit, skip, page, search: regSearch }
}
