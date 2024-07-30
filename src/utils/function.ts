/**
 * Python-like range function for creating array of numbers from start to end with step size.
 * If only one parameter is given, it will be used as end and start will be 0.
 *
 * @param {number} start
 * @param {number} end - exclusive
 * @param {number} step - default 1
 */
export function range(start: number, end?: number, step = 1) {
  if (end == undefined) {
    end = start;
    start = 0;
  }
  end -= 1;
  const len = Math.floor((end - start) / step) + 1;
  return Array(len)
    .fill(0)
    .map((_, idx) => start + idx * step);
}

export const zip = (...arrays: any[]) => {
  const length = Math.min(...arrays.map((arr) => arr.length));
  return range(length).map((index) => arrays.map((array) => array[index]));
};
