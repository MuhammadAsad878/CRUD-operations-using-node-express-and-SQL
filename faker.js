const {faker} = require('@faker-js/faker');
console.log(faker);

 function genData(){
  return  {
    name: faker.internet.username(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }
}
console.log(genData());