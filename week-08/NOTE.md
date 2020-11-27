# Week 08 - Broswer

## State Machine Parser

A parser is a machine which inputs bytes or string, and output parse result and
the rest of the input. Result of parsing is some structed or typed data or an
error.

Use STATE MACHINE to write a parser. Here's the basic state machine runtime:

    function stateMachine(inputData) {
      let state = initialState();
      for (const each of inputData) {
        state = state.go(each);
      }
      return state;
    }

A parser should exit fast if error happend or get enough data. We can define
some some terminal states:

    const stateEnd = createStateEnd();
    const stateIsError = state => isInstanceOf(state, ErrorState);

So we have the parser runtime:

    function parser(inputData) {
      let state = initialState();
      let result = initialParserResult();

      for (let i = 0; i < inputData.length; i++) {
        const {nextState, nextResult} = state.go(result, each);

        if (nextState == stateEnd) return parserResultOk(i, nextResult);

        // If it failed, parser will not eat input data.
        if (nextState == stateError) return parserResultErr(0, nextResult);

        state = nextState;
        result = nextResult;
      }

      return Ok(inputData.length, result);
    }
