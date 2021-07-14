process.env.NODE_ENV = "test"
const {api} = require("../helpers/keys");
const {expect} = require("chai");
const request = require('supertest');
const app = require("../app");
const conn =  require("../db");


describe("admin endpoints",()=>{
    before((done)=>{
        conn.connection()
        .then(()=>done())
        .catch((err)=>done(err));
    })

    after((done)=>{
        conn.close()
        .then(()=>done())
        .catch((err)=>done());
    })
    describe("admin Signup",()=>{   
        it("should create new user",(done)=>{
            const data = {
                "admin_id":"002",
                "email":"franc@gmail.com",
                "password":"000000"
        }
            request(app)
            .post(`${api}/admin_sign_up`)
            .send(data)
            .then((res)=>{
                const body = res.body;
                expect(body).to.contain.property('admin_id');
                expect(body).to.contain.property('password');
                expect(body).to.contain.property('email');
                expect(res).to.be.an('object');
                done();
            })
            .catch((err)=>done(err))
        })

        it("should fail to create user",(done)=>{
            data = {
                "admin_id":"002",
                "email":"franc@gmail.com",
                "password":"000000"
            }
            request(app)
            .post(`${api}/admin_sign_up`)
            .send(data)
            .then(
                (res)=>{
                    const body = res.body;
                    expect(body).to.be.equal("Email Already Registered. Login");
                    done();
                })
                .catch((err)=>done(err))
        })

        it("should fail to create user",(done)=>{
            data = {
                "admin_id":"",
                "email":"france@gmail.com",
                "password":"000000"
            }
            request(app)
            .post(`${api}/admin_sign_up`)
            .send(data)
            .then(
                (res)=>{
                    const body = res.body;
                    expect(body).to.be.equal("Some Fields are missing. Fill all Required Fields");
                    done();
                })
                .catch((err)=>done(err))
        })

    })
    describe("admin login",()=>{
        it("should login the admin",(done)=>{
            data = {
                "admin_id":"002",
                "password":"000000"
            }
            request(app)
            .post(`${api}/admin_login`)
            .send(data)
            .then((res)=>{
                const body = res.body;
                expect(body).to.contain.property('admin_id');
                expect(body).to.contain.property('token').to.be.equal(body.token);
                done();
            }).catch((err)=>done())
        })
        it("should say incorrect pass",(done)=>{
            data = {
                "admin_id":"002",
                "password":"0000"
            }
            request(app)
            .post(`${api}/admin_login`)
            .send(data)
            .then((res)=>{
                const body = res.body;
                expect(body).to.be.equal('Incorrect Password!');
                done();
            }).catch((err)=>done())
        })
        it("should say not a user",(done)=>{
            data = {
                "admin_id":"anyotherthing",
                "password":"0000"
            }
            request(app)
            .post(`${api}/admin_login`)
            .send(data)
            .then((res)=>{
                const body = res.body;
                expect(body).to.be.equal('you are not an admin please Sign in as a user');
                expect(body).to.have.status(301);
                done();
            }).catch((err)=>done())
        })
    })
})



