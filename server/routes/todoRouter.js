import { pool } from '../helper/db.js'
import { Router } from 'express'
import { emptyOrRows } from '../helper/utils.js'
import { auth } from '../helper/auth.js'
import { getTasks, postTask, deleteTask } from '../controllers/TaskController.js'

const router = Router()

router.get('/', getTasks)
router.post('/create', auth, postTask)
router.delete('/delete/:id', auth, deleteTask)

/*
router.post('/create',auth,(req,res,next) => {

    pool.query('insert into task(description) values ($1) returning *',
        [req.body.description],
        (error,result) => {
            if (error){
                return next(error)
            }
            return res.status(200).json({id: (emptyOrRows(result)[0]).id})
        }
    )
})

router.delete('/delete/:id',auth,(req,res) => {
   
    const id = parseInt(req.params.id)
    pool.query('delete from task where id = $1',
        [req.params.id],
        (error,result) => {
            if (error){
                return res.status(500).json({error:error.message})
            }
            return res.status(200).json({id:id})
        }
    )
})
*/

export default router
