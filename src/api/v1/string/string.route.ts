import {Router} from 'express';
import { stringController } from './string.controller';

const router = Router();

router.get('/:id', stringController.getOne);  
router.get('/list', stringController.getMany);
router.post('/', stringController.createOne);  
router.post('/list', stringController.createMany);  
router.delete('/:id', stringController.deleteOne);  
router.delete('/list', stringController.deleteMany);  

export { router as string };