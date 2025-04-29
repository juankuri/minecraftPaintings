const { Router } = require('express');
const controllers = require('../controllers');

const router = Router();

router.get('/', (req, res) => res.send('Welcome'));
router.post('/paintings', controllers.createPainting); 
router.get('/paintings', controllers.getAllPaintings); 
router.get('/paintings/:name', controllers.getPaintingByName);  
router.put('/paintings/:name', controllers.updatePainting);  
router.delete('/paintings/:name', controllers.deletePainting);

module.exports = router;
