import { GraphQLScalarType } from 'graphql';

export default {
    JSON: new GraphQLScalarType({
      name: 'JSON',
      serialize(value) {
        // Serialize the value to send it to the server
        return JSON.stringify(value);
      },
      parseValue(value) {
        // Parse the value received from the server
        return JSON.parse(value);
      },
      parseLiteral(ast) {
        // Parse the value received from the server
        // when it's included as a literal in the query
        return JSON.parse(ast.value);
      },
  })
}
