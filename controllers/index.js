const models = require("../database/models");

const createPainting = async (req, res) => {
  const { name, artist, image_url } = req.body;

  console.log('Creating new painting:', req.body);

  try {
    const existingPainting = await models.Painting.findOne({ where: { name } });

    if (existingPainting) {
      return res.status(400).json({ message: 'Painting with this name already exists' });
    }

    const painting = await models.Painting.create({ name, artist, image_url });
    console.log('Painting created:', painting);
    return res.status(201).json({
      painting
    });
  } catch (error) {
    console.error('Error creating painting:', error);
    return res.status(500).json({ error: error.message });
  }
};

const getAllPaintings = async (req, res) => {
  console.log('Getting all paintings');
  try {
    const paintings = await models.Painting.findAll({
      include: []
    });
    console.log(`Found ${paintings.length} paintings`);
    return res.status(200).json({ paintings });
  } catch (error) {
    console.error('Error getting all paintings:', error);
    return res.status(500).send(error.message);
  }
};

const getPaintingByName = async (req, res) => {
  const { name } = req.params;
  console.log(`Getting painting with name ${name}`);

  try {
    const painting = await models.Painting.findOne({
      where: { name: name }
    });

    if (painting) {
      console.log('Painting found:', painting);
      return res.status(200).json({ painting });
    }

    console.log('Painting not found');
    return res.status(404).json({ message: 'Painting not found' });

  } catch (error) {
    console.error('Error getting painting by name:', error);
    return res.status(500).send(error.message);
  }
};

const updatePainting = async (req, res) => {
  const { name } = req.params;
  console.log(`Updating painting with name ${name}`, req.body);
  
  try {
    // Primero buscar la pintura por nombre
    const paintingToUpdate = await models.Painting.findOne({
      where: { name: name }
    });

    if (!paintingToUpdate) {
      console.log('Painting not found for update');
      return res.status(404).json({ message: 'Painting not found' });
    }

    // Luego actualizar usando el ID
    const [updated] = await models.Painting.update(req.body, {
      where: { id: paintingToUpdate.id }
    });

    if (updated) {
      const updatedPainting = await models.Painting.findOne({ 
        where: { id: paintingToUpdate.id } 
      });
      console.log('Painting updated:', updatedPainting);
      return res.status(200).json({ painting: updatedPainting });
    }
    
    return res.status(500).json({ message: 'Failed to update painting' });

  } catch (error) {
    console.error('Error updating painting:', error);
    return res.status(500).send(error.message);
  }
};

const deletePainting = async (req, res) => {
  const { name } = req.params;
  console.log(`Deleting painting with name ${name}`);

  try {
    // Primero buscar la pintura por nombre
    const paintingToDelete = await models.Painting.findOne({
      where: { name: name }
    });

    if (!paintingToDelete) {
      console.log('Painting not found for deletion');
      return res.status(404).json({ message: 'Painting not found' });
    }

    // Luego eliminar usando el ID
    const deleted = await models.Painting.destroy({
      where: { id: paintingToDelete.id }
    });

    if (deleted) {
      console.log('Painting deleted successfully');
      return res.status(204).send(); 
    }
    
    return res.status(500).json({ message: 'Failed to delete painting' });

  } catch (error) {
    console.error('Error deleting painting:', error);
    return res.status(500).send(error.message);
  }
};

module.exports = {
  createPainting,
  getAllPaintings,
  getPaintingByName,
  updatePainting,
  deletePainting
};