import { Router } from 'express'
import * as controller from '../controllers/tareas.controller.js'

const router = Router()

router.get('/', controller.listar)
router.post('/', controller.crear)
router.get('/resumen', controller.resumen)
router.get('/:id', controller.obtenerPorId)
router.put('/:id', controller.actualizar)
router.patch('/:id/finalizar', controller.finalizar)
router.delete('/:id', controller.eliminar)

export default router
