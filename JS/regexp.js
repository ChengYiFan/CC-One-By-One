/**
 * eslint no-useless-escape:0 import/prefer-default-export:0
 * 是否URL
 */
const reg1 = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg1.test(path);
}

/**
 * 匹配字母汉字数字
 * 其实[A-Za-z0-9]可以用\w来代替，只是\w还可以匹配一个下划线，如果必须要求只有数字和字母那还是用[A-Za-z0-9]这个好了
 * [\u4e00-\u9fa5] //匹配中文字符
 * ^[1-9]\d*$ //匹配正整数
 * ^[A-Za-z]+$ //匹配由26个英文字母组成的字符串
 * ^[A-Z]+$ //匹配由26个英文字母的大写组成的字符串
 * ^[a-z]+$ //匹配由26个英文字母的小写组成的字符串
 * ^[A-Za-z0-9]+$ //匹配由数字和26个英文字母组成的字符串
 */
const reg2 = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;

/* 得到输入的字符串的字节长度 */
export const getByteLength = value => {
  const str = value.replace(/\w/g,'').length;
  const abcnum = value.length - str;
  return str * 2 + abcnum;
}
