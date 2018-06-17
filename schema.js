const axios = require('axios');

const{
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

//Hardcoded data
/*const customers = [
    {id : '1', name : 'John Doe', email : 'jdoe@gmail.com', age : 35},
    {id : '2', name : 'Sally', email : 'sally@gmail.com', age : 28}
];*/

//Customer Type
const CustomerType = new GraphQLObjectType({
    name : 'Customer',
    fields : () => ({
        id : {type : GraphQLString},
        name : {type : GraphQLString},
        email : { type: GraphQLString},
        age : {type : GraphQLInt},
    })
});


//Root Query
const RootQuery = new GraphQLObjectType({
    name : 'RootQueryType',
    fields : {
        customer : {
            type : CustomerType,
            args : {
                id : { type : GraphQLString}
            },
            resolve(parentValue, args){
                return axios.get('http://localhost:3000/customers/'+args.id).then(res => res.data)
                /*
                for(let i = 0 ;i < customers.length; i++){
                    if(customers[i].id == args.id){
                        return customers[i];
                    }
                }
            
                {customer(id : "1"){age, name, email}}
                */
            }
        },
        customers : {
            type : new GraphQLList(CustomerType),
            resolve(parentValue, args){
                //return customers;
                return axios.get('http://localhost:3000/customers').then(res => res.data);
            }
            /*
            {customers { id, name}}
            */
        }
    }
});

//Mutations
const mutation = new GraphQLObjectType({
    name : 'Mutation',
    fields : {
        deleteCustomer : {
            type : CustomerType,
            args : {
                id : { type : new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue, args){
                return axios.delete('http://localhost:3000/customers/'+ args.id).then(res => res.data);
            }
            /*
            mutation {
                deleteCustomer(id : "3"){
                    id
                }
            }

            만약 id : "4" 인경우에 data.json에 정보가 없으므로 404 오류 발생함.
            */
        },
        addCustomer : {
            type : CustomerType,
            args : {
                name: {type : new GraphQLNonNull(GraphQLString)},
                email :  {type : new GraphQLNonNull(GraphQLString)},
                age :  {type : new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parentValue, args){
                return axios.post('http://localhost:3000/customers', {
                    name : args.name,
                    email : args.email,
                    age : args.age
                }).then(res => res.data);
            }

            /*                        
            mutation{
                addCustomer(
                    name: "Samy",
                    age : 35,
                    email : "white@gmail.com"
                ){
                    id, name, email, age
                }
            }
            */
        },
        editCustomer : {
            type : CustomerType,
            args : {
                id : {type : new GraphQLNonNull(GraphQLString)},
                name : { type : GraphQLString},
                email : {type : GraphQLString},
                age : { type : GraphQLInt}
            },
            resolve(parentValue, args){
                return axios.patch('http://localhost:3000/customers/'+ args.id, args).then(res => res.data);
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query : RootQuery,
    mutation
});

//npm install express express-graphql nodemon --save
//npm install graphql
//npm install --save axios
//npm run dev:server => localhost:4001
//npm run json:server => localhost:3000