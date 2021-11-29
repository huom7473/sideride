import NotFoundPage from "../NotFoundPage"
import { configure, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Amplify from 'aws-amplify';
import awsconfig from '../aws-exports';


Amplify.configure(awsconfig);
// Auth.signIn("test_user", "test_password");

configure({ adapter: new Adapter() });      // for enzyme methods like mount

test('CheckboxWithLabel changes the text after click', () => {
  const wrapper = shallow(<NotFoundPage />);
  expect(wrapper).toMatchSnapshot();
});

