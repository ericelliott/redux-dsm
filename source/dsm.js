const camelCase = require('lodash.camelcase');
const snakeCase = require('lodash.snakecase');

const parseNode = node => {
  const data = node.slice(0, 2);
  const child = node.slice(2);
  return { data, child };
};

function* getStates (graph) {
  for (let i = 0; i < graph.length; i++) {
    const { data, child } = parseNode(graph[i]);

    if (Array.isArray(data)) yield data;
    if (Array.isArray(child)) yield* getStates(child);
  }
}

const formatConstant = text => snakeCase(text).toUpperCase();

const empty = {
  type: 'empty'
};

const defaultState = {
  status: 'idle',
  payload: empty
};

const createReducer = (defaultState, reducerMap) => {
  return (state = defaultState, action = {}) => {
    const { type } = action;
    const reducer = reducerMap[type];

    if (typeof reducer === 'function') {
      return reducer(state, action);
    }

    return state;
  };
};

const getActionCreatorNames = states => {
  return states.map(state => {
    const description = state[0];
    return camelCase(description);
  });
};

const dsm = ({
  component = '',
  description = '',
  delimiter = '::',
  actionStates = []
}) => {
  const states = [...getStates(actionStates)];

  const actionMap = states.map(a => {
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
  const actions = actionMap.map(a => a.action);

  const reducerMap = actionMap.reduce((map, a) => {
    map[a.action] = (state = defaultState, action = {}) => {

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
  const actionCreators = actionCreatorNames.reduce((acs, description, i) => {
    acs[description] = payload => ({
      type: actions[i],
      payload
    });

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
module.exports.default = dp;
