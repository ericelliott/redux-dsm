const camelCase = require('lodash.camelcase');
const snakeCase = require('lodash.snakecase');
const isError = require('lodash/isError');

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
  action: empty
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
  const actionNames = getActionCreatorNames(states);

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
  const actions = actionMap.map(a => a.action).reduce((acs, action, i) => {
    acs[actionNames[i]] = action;
    return acs;
  }, {});

  const reducerMap = actionMap.reduce((map, a) => {
    map[a.action] = (state = defaultState, action = {}) => {

      if (state.status === a.parentStatus && action.type === a.action) {
        const { status } = a;

        return Object.assign({}, state, {
          status,
          action
        });
      }
      return state;
    };
    return map;
  }, {});

  const reducer = createReducer(defaultState, reducerMap);
  const actionCreators = actionNames.reduce((acs, description) => {
    acs[description] = (payload, meta) => {
      const actionObj = {
        type: actions[description]
      };

      if (payload) {
        actionObj.payload = payload;

        if (isError(payload)) {
          actionObj.error = true;
        }
      }

      if (meta) {
        actionObj.meta = meta;
      }

      return actionObj;
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
