import { pool } from '../helper/db.js'
import { Router } from 'express'
import { emptyOrRows } from '../helper/utils.js'

const todoRouter = Router()

todoRouter.get('/',(req,res,next) => {

    pool.query('select * from task',(error,result) => {
        if (error){
            return next(error)
        }
        return res.status(200).json(emptyOrRows(result))
    })
})

todoRouter.post('/create',(req,res,next) => {

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

todoRouter.delete('/delete/:id',(req,res) => {
   
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

export default todoRouter