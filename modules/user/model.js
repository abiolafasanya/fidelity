const db = require('../../utils/db')

exports.generateTable =  async () => {
    // Create a table
  await db.schema
  .createTable('users', table => {
    table.increments('id');
    table.string('username');
    table.string('class');
    table.string('photo');
    table.string('student_id');
    table.string('password');
    table.boolean('isAdmin');
    table.boolean('isTeacher');
    table.timestamp('created_at').defaultTo(db.fn.now())
  })
  // ...and another
  .createTable('profile', table => {
    table.increments('id');
    table.string('username');
    table
      .integer('user_id')
      .unsigned()
      .references('users.id');
  })
}

exports.login = (email, password) => {
    return db('users').select("*").where({email, password})
}

exports.register = (body) => {
    return db('users').insert(body)
}

exports.update = (id, body) => {
    return db('users').update(body).where({id})
}

exports.delete = (id) => {
    return db('users').delete({id})	
}