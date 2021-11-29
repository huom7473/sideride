import Header from "../Header"
import { configure } from 'enzyme';
import renderer from 'react-test-renderer';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Amplify from 'aws-amplify';
import awsconfig from '../aws-exports';


Amplify.configure(awsconfig);
// Auth.signIn("test_user", "test_password");

configure({ adapter: new Adapter() });      // for enzyme methods like mount

test('Header matches snapshot', () => {
  const tree = renderer.create(<Header />).toJSON();
  expect(tree).toMatchSnapshot();
});

