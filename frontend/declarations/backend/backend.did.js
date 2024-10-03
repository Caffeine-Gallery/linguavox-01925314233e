export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'addTranslation' : IDL.Func([IDL.Text, IDL.Text], [], []),
    'getTranslation' : IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
