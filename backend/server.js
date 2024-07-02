const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const { MongoClient } = require("mongodb");
const ObjectID = require("mongodb").ObjectId;
const cors = require('cors');
const consumer = require('./consumer');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// CORS Configuration
// origin: 'http://localhost:3000', // Replace with your frontend URL
const corsOptions = {
    origin: '*', // Replace with your frontend URL
    methods: ['GET', 'POST', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type'],
};

// Apply CORS to all routes
app.use(cors(corsOptions));
 
// Ensure the directory exists
const fs = require('fs');
const imageDir = path.join(__dirname, 'public/image_product');

if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imageDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

// Serve static files from the public directory
app.use("/public", express.static(path.join(__dirname, "public")));

const connectToMongoDB = async () => {
    const client = new MongoClient("mongodb://127.0.0.1:27017");

    try {
        await client.connect();
        const db = client.db("posaka");
        const productCollection = db.collection("product");
        const transactionCollection = db.collection("transaction_sell");
        return { productCollection, transactionCollection };
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
        throw error;
    }
};

app.get('/api/consume', (req, res) => {
    res.json({ messages: getMessages() });
});

// Get all products
app.get('/api/product', async (req, res) => {
    try {
        const { page = 1, limit = 10, q } = req.query;
        const { productCollection } = await connectToMongoDB();
        const query = q ? { $or: [{ name: { $regex: q, $options: 'i' } }, { description: { $regex: q, $options: 'i' } }] } : {};

        const options = {
            skip: (page - 1) * limit,
            limit: parseInt(limit),
        };

        const [totalCount, products] = await Promise.all([
            productCollection.countDocuments(query),
            productCollection.find(query, options).toArray(),
        ]);

        res.json({ products, totalPages: Math.ceil(totalCount / limit) });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving data', error });
    }
});

// Add new product
app.post("/api/product", upload.single('image'), async (req, res) => {
    try {
        const { productCollection } = await connectToMongoDB();

        const newProduct = {
            name: req.body.name,
            description: req.body.description,
            price: parseFloat(req.body.price),
            gender: req.body.gender,
            imageName: req.file.originalname,
        };

        await productCollection.insertOne(newProduct);

        res.status(201).json({ message: "Product saved successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error saving product", error });
    }
});

// Delete product
app.delete('/api/product/:id', async (req, res) => {
    const id = new ObjectID(req.params.id);
    try {
        const { productCollection } = await connectToMongoDB();
        const id = new ObjectID(req.params.id);

        const product = await productCollection.findOne({ _id: id });
        
        // Menghapus file gambar terkait
        const imagePath = path.join(__dirname, "public/image_product", product.imageName);
        fs.unlink(imagePath, (err) => {
        if (err) {
            console.error("Error deleting image file", err);
        }
        });
        
        const result = await productCollection.deleteOne({ _id: id });
        if (result.deletedCount === 1) {
            res.json({ message: "Data deleted successfully" });
        } else {
            res.status(404).json({ message: "Data not found" });
        }
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});


// Update product
app.put('/api/product/:id', upload.single('image'), async (req, res) => {
    try {
        const { productCollection } = await connectToMongoDB();
        const id = new ObjectID(req.params.id);

        const existingProduct = await productCollection.findOne({ _id: id });
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        const updatedProduct = {
            name: req.body.name || existingProduct.name,
            description: req.body.description || existingProduct.description,
            price: req.body.price ? parseFloat(req.body.price) : existingProduct.price,
            gender: req.body.gender || existingProduct.gender,
        };

        if (req.file) {
            const imagePath = path.join(__dirname, "public/image_product", existingProduct.imageName);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error("Error deleting image file", err);
                }
            });
            updatedProduct.imageName = req.file.originalname;
        
        } else {
            updatedProduct.imageName = existingProduct.imageName;
        }

        const result = await productCollection.updateOne(
            { _id: id },
            { $set: updatedProduct }
        );

        if (result.modifiedCount === 1) {
            res.json({ message: "Product updated successfully" });
        } else {
            res.status(500).json({ message: "Failed to update product" });
        }
    } catch (error) {
        console.error("Error updating product", error);
        res.status(500).json({ message: "Error updating product", error });
    }
});

// Add new transaction
app.post("/api/transaction", async (req, res) => {
    try {
        const { transactionCollection } = await connectToMongoDB();

        const newTransaction = {
            cartProducts: req.body.cartProducts,
            total: req.body.total,
            personalInfo: req.body.personalInfo,
            paymentCode: req.body.paymentCode,
            cashier:"id_employee",
            date: new Date()
        };

        await transactionCollection.insertOne(newTransaction);

        res.status(201).json({ message: "Transaction saved successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error saving transaction", error });
    }
});

// start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
