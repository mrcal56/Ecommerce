const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middlewares/authMiddleware');
const Product = require('../models/product');



// Ruta de búsqueda de productos
router.get('/search', async (req, res) => {
  try {
    // Obtener el término de búsqueda de la query string
    const query = req.query.q;

    // Buscar productos cuyo nombre coincida con el término de búsqueda
    const products = await Product.find({ name: { $regex: query, $options: 'i' } });

    // Devolver los productos encontrados como respuesta JSON
    res.json(products);
  } catch (error) {
    // Manejar errores y devolver un mensaje de error con el estado 500
    console.error('Error fetching search results:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Ruta para obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Ruta para obtener un producto por ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// Ruta para crear un nuevo producto  solo admin)
router.post('/', protect, admin, async (req, res) => {
  const { name, price, description, imageUrl, sizes } = req.body;
  try {
    const product = new Product({
      name,
      price,
      description,
      imageUrl,
      sizes: sizes || [],
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product' });
  }
});

// Ruta para actualizar un producto (solo admin)
router.put('/:id', protect, admin, async (req, res) => {
  const { name, price, description, imageUrl, sizes } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.description = description || product.description;
      product.imageUrl = imageUrl || product.imageUrl;
      product.sizes = sizes || product.sizes;
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
});

// Ruta para eliminar un producto (solo admin)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

module.exports = router;
