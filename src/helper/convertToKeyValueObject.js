export default function convertToKeyValueObject(array, keyProperty = "id") {
  return array.reduce(
    (r, object) => ((r[object[keyProperty]] = object), r),
    {}
  );
}
