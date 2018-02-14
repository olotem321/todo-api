const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos,populateTodo, users, populateUser} = require('./seed/seed');

beforeEach(populateUser);
beforeEach(populateTodo);


describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res) => {
      expect(res.body.text).toBe(text);
    })
    .end((err, res) => {
      if(err){
        return done(err);
      }

      Todo.find({text}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((err) => done(err));
    });
  });

  it('sould not create todo with invalid body data', (done) => {
    request(app).post('/todos').send({}).expect(400).end((err, res) => {
      if(err){
        return done(err);
      }

      Todo.find().then((todos) => {
        expect(todos.length).toBe(3);
        done();
      }).catch((err) => done(err));
    });
  });

});

describe('GET /todos', () => {
  it('shoud get all todos', (done) => {
    request(app)
    .get('/todos').expect(200)
    .expect((res) => {
      expect(res.body.doc.length).toBe(3);
      // console.log(res.body);
    }).end(done);
  })
});

describe('GET /todos/:id', () => {
  it('should return to doc', (done) => {
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
    .get(`/todos/${new ObjectID().toHexString()}`)
    .expect(404)
    .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
    .get('/todos/123')
    .expect(404)
    .end(done);
  });

});

describe('DELETE /todo/:id', () => {
  var hexID = todos[1]._id.toHexString();
  //should delte if everthing is correct
  it('should delete a doc when found by ID', (done) => {
    request(app)
    .delete(`/todos/${hexID}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(todos[1].text);
    }).end((err, res) => {
      if(err){
        return done(err)
      }

      Todo.findById(hexID).then((todo) => {
        expect(todo).toNotExist();
        done();
      }).catch((er) => done(er));
    });
  });

  //should return STATUS 404 when incorrect format
  it('should return Status 404 when incorrect format', (done) => {
    request(app)
    .delete(`/todos/123`)
    .expect(404)
    .end(done);
  });

  //should return STATUS 404 when cannnot fidn document
  it('should return Status 404 when cannnot fidn document', (done) => {
    request(app)
    .delete(`/todos/${new ObjectID().toHexString()}`)
    .expect(404)
    .end(done);
  });

});

describe('PATCH /todo/:id', () => {
  it('shoud update todo', (done) => {
    var hexID = todos[0]._id.toHexString();
    var newText = 'this is a new text to be update';
    request(app)
    .patch(`/todos/${hexID}`).send({
      text: newText,
      completed: true
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(newText);
      expect(res.body.todo.completed).toBe(true);
      expect(res.body.todo.completedAt).toBeA('number');
    }).end((err,res) => {
      if(err){
        return done(err);
      }
      done();
    });
  });

  it('should clear completedAt when todo is not completed',(done) =>{
    var hexID = todos[1]._id.toHexString();
    var newText = 'this is another new text to be update';
    request(app)
    .patch(`/todos/${hexID}`).send({
      text: newText,
      completed: false
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(newText);
      expect(res.body.todo.complatedAt).toNotExist();
      expect(res.body.todo.completed).toBe(false);
    }).end(done);
  });

});

describe('GET /users/me', () =>{
  it('should return user if authenticated', (done) => {
    request(app)
    .get('/users/me')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    }).end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    })
    .end(done);
  });

});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123mnb!';

    request(app)
    .post('/users')
    .send({
      email, password
    })
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toExist();
      expect(res.body._id).toExist();
      expect(res.body.email).toBe(email);
    }).end((err) => {
      if(err){
        return done(err);
      }

      User.findOne({email}).then((user) => {
        expect(user).toExist();
        expect(user.password).toNotBe(password);
        done();
      }).catch((e) => done(e));
    });
  });

  it('should return validation errors if request invalid', (done) => {
    request(app)
    .post('/users')
    .send({
      email: 'dfjie',
      password: 'dsak'
    }).expect(400)
    .end(done);
  });

  it('should not create user if email in use', (done) => {
      request(app)
      .post('/users')
      .send({
        email: users[0].email,
        password: 'dsaksdfs'
      }).expect(400)
      .end(done);
  });

});

describe('POST /users/login', () => {
  it('should login user and return token', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: users[1].password
    }).expect(200)
    .expect((res) => {
      // expect(res.email).toBe(users[0].email);
      expect(res.headers['x-auth']).toExist();
    }).end((err, res) => {
      if(err){
        return done(err);
      }

      User.findById(users[1]._id).then((user) => {
        expect(user.tokens[0]).toInclude({
          access: 'auth',
          token: res.headers['x-auth']
        });
        done();
      }).catch((e) => done(e));
    });
  });

  it('should reject invalid', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: 'dsaksdfs'
    }).expect(401)
    .end(done);
  });
});

describe('DELETE /users/me/token', () => {
  it('should delete token', (done) => {
    request(app)
    .delete('/users/me/token')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .end((err, res) => {
      if(err){
        return done(err);
      }

      User.findOne({email:users[0].email}).then((user) => {
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((e) => done(e));

    });
  });
});
