//process.env.NODE_ENV = "test"
const {api} = require("../helpers/keys");
const {expect} = require("chai");
const request = require('supertest');
const app = require("../app");
const conn =  require("../db");


describe("Users endpoints",()=>{
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
    describe("user Signup",()=>{   
        it("should create new user",(done)=>{
            const data = {
                "last_name":"FRANCEE",
                "first_name":"VIC",
                "email":"FRANCee@GMAIL.COM",
                "password1":"000000",
                "password2":"000000"
        }
            request(app)
            .post(`${api}/sign_up`)
            .send(data)
            .then((res)=>{
                const body = res.body;
                expect(body).to.contain.property('last_name');
                expect(body).to.contain.property('first_name');
                expect(body).to.contain.property('email');
                expect(body).to.contain.property('password1')
                expect(body).to.be.an('object');
                done();
            })
            .catch((err)=>done(err))
        })

        it("should fail to create user",(done)=>{
            data = {
                "last_name":"FRANCEE",
                "first_name":"VIC",
                "email":"FRANCee@GMAIL.COM",
                "password1":"000000",
                "password2":"000000"
            }
            request(app)
            .post(`${api}/sign_up`)
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
                "last_name":"",
                "first_name":"",
                "email":"FRANC@GMAIL.COM",
                "password1":"000000",
                "password2":"000000"
            }
            request(app)
            .post(`${api}/sign_up`)
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
    describe("user login",()=>{
        it("should login the user",(done)=>{
            data = {
                "email":"FRANCee@GMAIL.COM",
                "password1":"000000"
            }
            request(app)
            .post(`${api}/login`)
            .send(data)
            .then((res)=>{
                const body = res.body;
                expect(body).to.contain.property('firstname');
                expect(body).to.contain.property('token');
                done();
            }).catch((err)=>done())
        })
        it("should say incorrect pass",(done)=>{
            data = {
                "email":"FRANCee@GMAIL.COM",
                "password":"0000"
            }
            request(app)
            .post(`${api}/login`)
            .send(data)
            .then((res)=>{
                const body = res.body;
                expect(body).to.be.equal('Incorrect Password!');
                done();
            }).catch((err)=>done())
        })
        it("should say not a user",(done)=>{
            data = {
                "email":"RANCee@GMAIL.COM",
                "password":"000000"
            }
            request(app)
            .post(`${api}/login`)
            .send(data)
            .then((res)=>{
                const body = res.body;
                expect().redirect(`${api}/sign_up`)
                expect(body).to.have.status(200);
                done();
            }).catch((err)=>done())
        })
    })
})



