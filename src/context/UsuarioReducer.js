export const authInitialState = {
  user: "",
  token: "",
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case "signIn":
      const { user, token } = action.payload;
      return {
        ...state,
        user,
        token,
      };
    case "signOut":
      return {
        ...authInitialState,
      };
    default:
      return state;
  }
};
