const LandingPage = ({ currentUser }) => {

return (
  <div>
    {currentUser ? 
      <h3>{currentUser.username} welcome to Present3 US!</h3> 
      : <h3>Welcome to Present3 US! please <a href="/users/signin">Sign in</a> or <a href="/users/signup">Sign up</a> to start</h3>}
  </div>
);

};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/users/currentuser');
  return { user: data };
};

export default LandingPage;