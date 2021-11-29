import AddressSearch from "../AddressSearch"
import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Amplify from 'aws-amplify';
import awsconfig from '../aws-exports';


Amplify.configure(awsconfig);
// Auth.signIn("test_user", "test_password");

configure({ adapter: new Adapter() });      // for enzyme methods like mount

const dummy_from = {
  lat: 12,
  lng: 34,
  description: '123 from street'
}

const dummy_state = {
  toCoord: [1, 2],
  to: '123 from street'
}

function dummy_fun({lat, lng, description}) {
  dummy_state.toCoord = [lat, lng];
  dummy_state.to = description;
};

test('AddressSearch: initialization', () => {
  const wrapper = mount(<AddressSearch select={dummy_fun} initialValue={dummy_from}/>);
  const instance = wrapper.instance();
});
