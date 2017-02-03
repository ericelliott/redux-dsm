const camelCase = require('lodash.camelcase');
const snakeCase = require('lodash.snakecase');

const parseNode = function (node) {
  const data = node.slice(0, 2);
  const child = node.slice(2);
  return { data, child };
};

const getStates = function (graph, initialMemo = []) {
  return graph.reduce(function (memo, node) {
    const { data, child } = parseNode(node);

    if (Array.isArray(data)) memo = memo.concat([data]);
    if (Array.isArray(child)) memo = getStates(child, memo);

    return memo;
  }, initialMemo);
};

const formatConstant = function (text) {
  return snakeCase(text).toUpperCase();
};

const empty = {
  type: 'empty'
};

const defaultState = {
  status: 'idle',
  payload: empty
};

const createReducer = function (defaultState, reducerMap) {
  return function (state = defaultState, action = {}) {
    const { type } = action;
    const reducer = reducerMap[type];

    if (typeof reducer === 'function') {
      return reducer(state, action);
    }

    return state;
  };
};

const getActionCreatorNames = function (states) {
  return states.map(function (state) {
    const description = state[0];
    return camelCase(description);
  });
};

const dsm = function ({
  component = '',
  description = '',
  delimiter = '::',
  actionStates = []
}) {
  const states = [...getStates(actionStates)];

  const actionMap = states.map(function (a) {
    const action = component + [
      component ? delimiter : '',
      formatConstant(description),
      description ? delimiter : '',
      formatConstant(a[0])
    ].join('');
    const status = a[1];

    return {
      action,
      status
    };
  });
  const actions = actionMap.map(function (a) {
    return a.action;
  });

  const reducerMap = actionMap.reduce(function (map, a) {
    map[a.action] = function (state = defaultState, action = {}) {

      if (action.type === a.action) {
        const { status } = a;
        const { payload } = action;

        return Object.assign({}, state, {
          status,
          payload
        });
      }
      return state;
    };
    return map;
  }, {});

  const reducer = createReducer(defaultState, reducerMap);

  const actionCreatorNames = getActionCreatorNames(states);
  const actionCreators = actionCreatorNames.reduce(function (acs, description, i) {
    acs[description] = function (payload) {
      return {
        type: actions[i],
        payload
      };
    };

    return acs;
  }, {});

  return {
    actions,
    actionCreators,
    reducer
  };
};

module.exports = dsm;
module.exports.dsm = dsm;
module.exports.default = dsm;
