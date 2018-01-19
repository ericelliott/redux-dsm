const camelCase = require('lodash.camelcase');
const snakeCase = require('lodash.snakecase');

const defaultStatus = 'idle';

const parseNode = node => {
  const data = node.slice(0, 2);
  const child = node.slice(2);
  return { data, child };
};

const getDefaultStatus = (actionStates) => {
  const status = actionStates[1];
  return status ? status : defaultStatus;
};

const getStates = (graph, initialMemo = [], parentStatus) => (
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

const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x);

const createReducer = (defaultState, reducerMap) => {
  return (state = defaultState, action = {}) => {
    const { type } = action;

    const reducer = typeof reducerMap[type] === 'function' ?
      compose(...reducerMap[type])(state => state) :
      state => state
    ;
    /*
      Problem #2: we need to build the reducer by combining all
      handlers for a given type.
    */

    return reducer(state, action);
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
  const defaultState = {
    status: getDefaultStatus(actionStates),
    payload: empty
  };
  const states = [...getStates(actionStates, [], defaultState.status)];
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

  console.log(actionMap);

  const reducerMap = actionMap.reduce((map, a) => {
    const reducer = step => (state = defaultState, action = {}) => {

      if (state.status === a.parentStatus && action.type === a.action) {
        const { status } = a;
        const { payload } = action;

        return step({
          ...state,
          status,
          payload
        }, action);
      }
      return step(state, action);
    };

    if (!map[a.action]) map[a.action] = [reducer];
    else map[a.action].push(reducer);

    return map;
  }, {});


  /*
    SOLVED! Problem #1: We should create a handler for each action, even if there are
    more than one of the same action type. In that case, we should have another
    handler even if we already have one.
  */

  const reducer = createReducer(defaultState, reducerMap);

  const actionCreators = actionNames.reduce((acs, description) => {
    acs[description] = payload => ({
      type: actions[description],
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
