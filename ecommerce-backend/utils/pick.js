// Selecciona un subconjunto de propiedades desde un objeto
module.exports = (obj, keys = []) =>
  keys.reduce((acc, k) => {
    // Copia la clave si existe en el objeto de origen
    if (obj[k] !== undefined) acc[k] = obj[k];
    return acc;
  }, {});
