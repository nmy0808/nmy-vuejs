const arr = ['a'];
const res = [].reduce((arr, cur) => {
  return arr[0]
}, arr)
// console.log(res);

console.log(arr.splice(0, arr.length - 1));
console.log(arr);