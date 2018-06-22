var neo4j = require('neo4j-driver').v1,
  Q = require('q');

module.exports = (function () {
  debugger;
  var graph = false,
    d = Q.defer(); // if an active connection exists, use it instead of tearing the previous one down
  
  
  function connect(connection) {
    if (!graph) {
      var path = connection.protocol + connection.host + ':' + connection.port + connection.base;
      graph = true;
      var driver = neo4j.driver(path, neo4j.auth.basic(connection.username, connection.password));
//      driver.onCompleted = function Neo4jDriverWasCreatedSuccessful() {
//        d.resolve(session)
//      }
      driver.onError = function Neo4jDriverWasntCreated(err) {
        console.log('An error has occured when trying to connect to Neo4j:');
        d.reject(err);
        throw err;
      }
//      var session = driver.session();
      d.resolve(driver.session())
    }
    return d.promise;
  }

  function graphDo(cb) {
    d.promise.then(cb);
  }

  // built in this pattern so this can be enhanced later on
  return {
    connect: connect,
    graph: graphDo
  };
})();
