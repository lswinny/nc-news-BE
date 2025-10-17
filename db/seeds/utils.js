const db = require("../../db/connection");

function convertTimestampToDate({ created_at, ...otherProperties }) {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
}

function createLookupObj(array, key, value) {
  const lookupObj = {};

  array.forEach((object) => {
    const lookupKey = object[key];
    const lookupValue = object[value];
    lookupObj[lookupKey] = lookupValue;
  });
  return lookupObj;
}

module.exports = { convertTimestampToDate, createLookupObj };


