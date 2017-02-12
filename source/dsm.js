const camelCase = require('lodash.camelcase');
const snakeCase = require('lodash.snakecase');

const defaultStatus = 'idle';

const parseNode = node => {
  const data = node.slice(0, 2);
  const child = node.slice(2);
  return { data, child };
};

const getStates = (graph, initialMemo = [], parentStatus = defaultStatus) => (
  graph.reduce((memo, node) => {
    const { data, child } = parseNode(node);

    if (Array.isArray(data)) memo = memo.concat([data.concat([parentStatus])]);
    if (Array.isArray(child)) memo = getStates(child, memo, data[1]);

    return memo;
  }, initialMemo)
);

const formatConstant = text => snakeCase(text).toUpperCase();

const empty = {
  type: 'empty'
};

const defaultState = {
  status: defaultStatus,
  payload: empty
};

const createReducer = (defaultState, parentReducerMap) => {
  return (state = defaultState, action = {}) => {
    const reducer = parentReducerMap[state.status];

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
    const parentStatus = a[2];

    return {
      action,
      status,
      parentStatus
    };
  });
  const actions = actionMap.map(a => a.action);

  const parentStatuses = Object.keys(actionMap.reduce((map, a) => {
    map[a.parentStatus] = true;
    return map;
  }, {}));

  const initialReducerMap = parentStatuses.reduce((map, status) => {
    map[status] = {};
    return map;
  }, {});

  const reducerMap = actionMap.reduce((map, a) => {
    map[a.parentStatus][a.action] = (state = defaultState, action = {}) => {

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
  }, initialReducerMap);

  const parentReducerMap = parentStatuses.reduce((map, status) => {
    map[status] = (state = defaultState, action = {}) => {

      const { type } = action;
      const reducer = reducerMap[status][type];

      if (typeof reducer === 'function') {
        return reducer(state, action);
      }

      return state;
    };
    return map;
  }, {});

  const reducer = createReducer(defaultState, parentReducerMap);
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
module.exports.default = dsm;
