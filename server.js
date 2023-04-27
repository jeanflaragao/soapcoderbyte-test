import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';


const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));
const PORT = process.env.PORT || 5000;

// Get all contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany();
    res.json(contacts);
  } catch (error) {
    console.error('Error getting contacts:', error);
    res.status(500).json({ error: 'Error getting contacts' });
  }
});

// Create a new contact
app.post('/api/contacts', async (req, res) => {
  console.log(req.body);
  const { firstName, lastName, phoneNumber } = req.body;
  try {
    const contact = await prisma.contact.create({
      data: { firstName, lastName, phoneNumber },
    });
    res.json(contact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Error creating contact' });
  }
});

// Update a contact
app.put('/api/contacts/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, phoneNumber } = req.body;
  try {
    const contact = await prisma.contact.update({
      where: { id: parseInt(id) },
      data: { firstName, lastName, phoneNumber },
    });
    res.json(contact);
  } catch (error) {
    console.error(`Error updating contact with ID ${id}:`, error);
    res.status(500).json({ error: `Error updating contact with ID ${id}` });
  }
});

// Delete a contact
app.delete('/api/contacts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.contact.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: `Contact with ID ${id} deleted successfully` });
  } catch (error) {
    console.error(`Error deleting contact with ID ${id}:`, error);
    res.status(500).json({ error: `Error deleting contact with ID ${id}` });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});