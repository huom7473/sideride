import Selection from "../Selection"
import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Amplify from 'aws-amplify';
import awsconfig from '../aws-exports';
import renderer from 'react-test-renderer';


Amplify.configure(awsconfig);
// Auth.signIn("test_user", "test_password");

configure({ adapter: new Adapter() });      // for enzyme methods like mount

const dummy_from = {
  lat: 12,
  lng: 34,
  description: '123 from street'
}

const dummy_to = {
  lat: 56,
  lng: 78,
  description: '123 to street'
}

const dummy_event = {
  target: { value: 'test-value' }
};

test('Selection: initialization', () => {
  const wrapper = mount(<Selection />);
  const instance = wrapper.instance();

  expect(instance.state.from).toEqual("");
  expect(instance.state.to).toEqual("");
  expect(instance.state.date).toEqual("");
});


test('Selection: _handleFromLatLong correctly sets from and fromCoord', () => {
  const wrapper = mount(<Selection />);
  const instance = wrapper.instance();

  instance._handleFromLatLong(dummy_from);
  expect(instance.state.from).toBe(dummy_from.description);
  expect(instance.state.fromCoord.lat).toBe(dummy_from.lat);
  expect(instance.state.fromCoord.lng).toBe(dummy_from.lng);
});

test('Selection: _handleToLatLong correctly sets to and toCoord', () => {
  const wrapper = mount(<Selection />);
  const instance = wrapper.instance();

  instance._handleToLatLong(dummy_to);
  expect(instance.state.to).toBe(dummy_to.description);
  expect(instance.state.toCoord.lat).toBe(dummy_to.lat);
  expect(instance.state.toCoord.lng).toBe(dummy_to.lng);
});

test('Selection: _handleFindRide correctly shows alerts for missing data or invalid dates', () => {
  const wrapper1 = mount(<Selection />);
  const instance1 = wrapper1.instance();
  instance1.state.fromCoord = '';
  instance1.state.toCoord = 'y';
  instance1.state.date = 'z';
  instance1._handleFindRide(dummy_event);
  expect(instance1.state.showAlert).toBe(true);
  expect(instance1.state.showDateAlert).toBe(false);

  const wrapper2 = mount(<Selection />);
  const instance2 = wrapper2.instance();
  instance2.state.fromCoord = 'x';
  instance2.state.toCoord = '';
  instance2.state.date = 'z';
  instance2._handleFindRide(dummy_event);
  expect(instance2.state.showAlert).toBe(true);
  expect(instance2.state.showDateAlert).toBe(false);

  const wrapper3 = mount(<Selection />);
  const instance3 = wrapper3.instance();
  instance3.state.fromCoord = 'x';
  instance3.state.toCoord = 'y';
  instance3.state.date = '';
  instance3._handleFindRide(dummy_event);
  expect(instance3.state.showAlert).toBe(true);
  expect(instance3.state.showDateAlert).toBe(false);

  const wrapper4 = mount(<Selection />);
  const instance4 = wrapper4.instance();
  instance4.state.fromCoord = 'x';
  instance4.state.toCoord = 'y';
  instance4.state.date = '2021-11-04';
  instance4._handleFindRide(dummy_event);
  expect(instance4.state.showAlert).toBe(false);
  expect(instance4.state.showDateAlert).toBe(true);

});

it('renders correctly selection component', () => {
  const SelectionComponent = renderer.create(<Selection />);
  const tree = SelectionComponent.toJSON();
  expect(tree).toMatchSnapshot();
});