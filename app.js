const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:19006',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  };
  
  app.use(cors(corsOptions));

// MongoDB connection string
const url = 'mongodb+srv://hillarymsilva:123654@cluster0.vkcogow.mongodb.net/test?retryWrites=true&w=majority';
const dbName = 'testeflorescer';
const collectionName = 'profissionais';

// Connect to MongoDB
async function connectToMongoDB() {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    return client.db(dbName).collection(collectionName);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    return null;
  }
}

// Rota para buscar todos os profissionais
app.get('/api/mongodb-data', async (req, res) => {
    const collection = await connectToMongoDB();

    if (collection) {
        const profissionais = await collection.find().toArray();
        res.json(profissionais);
    } else {
        res.status(500).json({ error: 'Error connecting to MongoDB' });
    }
});

// Rota para inserir um novo profissional
app.post('/api/mongodb-data', async (req, res) => {
    const collection = await connectToMongoDB();

    if (collection) {
        const novoProfissional = req.body;
        const resultado = await collection.insertOne(novoProfissional);
        res.json({ mensagem: 'Profissional inserido com sucesso', id: resultado.insertedId });
    } else {
        res.status(500).json({ error: 'Error connecting to MongoDB' });
    }
});

// Rota para buscar um profissional por ID
app.get('/api/mongodb-data/:id', async (req, res) => {
    const collection = await connectToMongoDB();

    if (collection) {
        const id = req.params.id;
        const objectId = new ObjectId(id);

        const profissional = await collection.findOne({ _id: objectId });

        if (profissional) {
            res.json(profissional);
        } else {
            res.status(404).json({ error: 'Profissional not found' });
        }
    } else {
        res.status(500).json({ error: 'Error connecting to MongoDB' });
    }
});

// Rota para atualizar um profissional por ID
app.put('/api/mongodb-data/:id', async (req, res) => {
    const collection = await connectToMongoDB();

    if (collection) {
        const id = req.params.id;
        const objectId = new ObjectId(id);
        const profissionalAtualizado = req.body;

        const resultado = await collection.updateOne({ _id: objectId }, { $set: profissionalAtualizado });

        if (resultado.modifiedCount === 1) {
            res.json({ mensagem: 'Profissional atualizado com sucesso' });
        } else {
            res.status(404).json({ error: 'Profissional not found' });
        }
    } else {
        res.status(500).json({ error: 'Error connecting to MongoDB' });
    }
});

// Rota para deletar um profissional por ID
app.delete('/api/mongodb-data/:id', async (req, res) => {
    const collection = await connectToMongoDB();

    if (collection) {
        const id = req.params.id;
        const objectId = new ObjectId(id);

        const resultado = await collection.deleteOne({ _id: objectId });

        if (resultado.deletedCount === 1) {
            res.json({ mensagem: 'Profissional deleted successfully' });
        } else {
            res.status(404).json({ error: 'Profissional not found' });
        }
    } else {
        res.status(500).json({ error: 'Error connecting to MongoDB' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
