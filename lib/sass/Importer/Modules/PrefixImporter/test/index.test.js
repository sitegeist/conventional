import Prefixer from "..";
const fs = require('fs');
require('regenerator-runtime/runtime');
jest.mock('fs')

const fixturePath = 'src/Modules/Prefixer/test/fixtures';


describe('buildPrefixedContent', () => {

  it('should return a prefixed scss string', () =>  {

    const fileContent = '// @use-prefix\n' +
        '.test {\n' +
        '    display:none;\n' +
        '}\n'

    const result = '// @use-prefix\n' +
      '.prefix-test {\n' +
      '    display:none;\n' +
      '}\n'

    expect(Prefixer.buildPrefixedContent('prefix-', fileContent)).toBe(result);

  })

});

describe('getPrefixedContent', () => {

  afterEach(() => {
    jest.fn().mockReset();
    jest.fn().mockRestore();
  });

  it('getPrefixedContent rejects because empty array passed...', () => {
    expect.assertions(1);
    const err = new Error('no valid path provided to importer');
    return Prefixer.getPrefixedContent([]).catch(data => expect(data).toEqual(err));
  });

  it('getPrefixedContent resolve array with prefixed data/ non prefixed data', () => {
    expect.assertions(1);

    const fileContentOnce = '// @use-prefix\n' +
        '.testOnce {\n' +
        '    display:none;\n' +
        '}\n';

    const fileContentTwice = '.testTwice {\n' +
        '    display:none;\n' +
        '}\n';

    const result = [
      {
        content: fileContentOnce.replace('testOnce', '45h-testOnce'),
        prefix: "45h-"
      },
      {
        content: fileContentTwice,
        prefix: false
      }
    ]

    fs.readFileSync.mockReturnValueOnce(fileContentOnce);
    fs.readFileSync.mockReturnValueOnce(fileContentTwice);

    return Prefixer.getPrefixedContent(['/component/componentPath/testOnce', '/component/componentPath/testTwice']).then(data => expect(data).toEqual(result));
  });

});

describe('buildPrefix', () => {

  it('it should return a hash value created out of scss file path', () => {
    const result = '1qq10-';

    expect(
      Prefixer.buildPrefix(`test/test.scss`, "testsalt"))
      .toBe(result);
  });

});


describe('addPrefix', () => {

  const result = { type: 'stylesheet',
    position:
        { start: { line: 1, column: 1 }, end: { line: 13, column: 34 } },
    children:
        [ { type: 'class',
          position:
              { start: { line: 35, column: 9 },
                end: { line: 35, column: 18 } },
          children:
              [ { type: 'ident', position: [Object], value: 'lvlvr-test' } ] } ],
    source: {} }

  it('should return an abstract syntax tree perpared with prefixed selectors', () => {

    expect(
        Prefixer.addPrefix({ type: 'stylesheet',
          position:
              { start: { line: 1, column: 1 }, end: { line: 13, column: 34 } },
          children:
              [ { type: 'class',
                position:
                    { start: { line: 35, column: 9 },
                      end: { line: 35, column: 18 } },
                children:
                    [ { type: 'ident', position: [Object], value: 'test' } ] } ],
          source: {} }, 'lvlvr-')
    ).toStrictEqual(result)
  })
})



