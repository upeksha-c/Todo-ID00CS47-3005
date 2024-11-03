import { initializeTestDb, insertTestUser, getToken } from './helper/test.js'
import {expect} from 'chai'

const base_url = 'http://localhost:3001/'

describe('Get Tasks',() => {

    before(() => {
        initializeTestDb()
    })

    it ('should get all tasks', async() => {
        const response = await fetch('http://localhost:3001/')
        const data = await response.json()

        expect(response.status).to.equal(200)
        expect(data).to.be.an('array').that.is.not.empty
        expect(data[0]).to.include.all.keys('id','description')
    })
})



describe('Post task',() => {
    const email = 'post@foo.com'
    const password = 'post123'
    insertTestUser(email,password)
    const token = getToken(email)
    it('Should post a task', async() => {
        const response = await fetch(base_url + 'create',{
            method: 'post',
            headers: {
                'Content-Type':'application/json',
                Authorization: token
            },
            body: JSON.stringify({'description':'Task from unit test'})
        })
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id')
    })

    it('should not post a task without description', async() => {
        
        const response = await fetch(base_url+'create', {
            method: "post",
            headers: {
                "Content-Type":"application/json",
                Authorization: token
            },
            body:JSON.stringify({'description':null})
        })
        const data = await response.json()
        expect(response.status).to.equal(500)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('error')
    })
})


describe('Delete Task', () => {
    const email = 'post@foo.com'
    const password = 'post123'
    //insertTestUser(email,password)
    const token = getToken(email)
    it('should delete a task', async() => {
        const response = await fetch (base_url + "delete/1",{
            method: 'delete',
            headers: {
                Authorization: token
            },
        })
        const data = await response.json()
        expect(response.status).to.be.equal(200)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id')
    })

    it('should not delete a task with sql injection',async() => {
        const response = await fetch(base_url + "delete/id=0 or id>0",{
            method : "delete",
            headers: {
                Authorization: token
            },
        })
        const data = await response.json()

        expect(response.status).to.be.equal(500)
        expect(data).to.be.an("object")
        expect(data).to.include.all.keys('error')
    })
})



describe('POST register',() => {

    const email = 'register@foo.com'
    const password = 'register123'

    before(() => {
        initializeTestDb(),
        async () => {
            await insertTestUser(email, password)
        }
    })

    it ('should register with valid email and password', async() => {
        const response = await fetch(base_url + 'user/register',{
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'email':email, 'password':password})
        })
        const data = await response.json()
        expect(response.status).to.equal(201,data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id','email')
    })
})

describe('Post login',() => {
    const email = 'login@foo.com'
    const password = 'login123'

    before(async () => {
        await insertTestUser(email, password); // Wait for the user to be inserted
    });

    it('should login with valid credentials', async() => {
        const response = await fetch(base_url + 'user/login',{
            method: 'post',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'email':email, 'password':password})
        })
        const data = await response.json()
        expect(response.status).to.equal(200,data.error)
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id','email','token')

    })
})