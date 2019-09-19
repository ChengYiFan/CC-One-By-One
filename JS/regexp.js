/* 得到输入的字符串的字节长度 */
export const getByteLength = value => {
  const str = value.replace(/\w/g,'').length;
  const abcnum = value.length - str;
  return str * 2 + abcnum;
}
