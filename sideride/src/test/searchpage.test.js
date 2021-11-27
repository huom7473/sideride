import Selection from "../Selection"
import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';


configure({ adapter: new Adapter() });      // for enzyme methods like mount

const wrapper = mount(<Selection />);
const instance = wrapper.instance();

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

test('Search page: initialization', () => {
    expect(instance.state.from).toEqual("");
    expect(instance.state.to).toEqual("");
    expect(instance.state.date).toEqual("");
  });


test('Search page: _handleFromLatLong correctly sets from and fromCoord', () => {
    instance._handleFromLatLong(dummy_from);
    expect(instance.state.from).toBe(dummy_from.description);
    expect(instance.state.fromCoord.lat).toBe(dummy_from.lat);
    expect(instance.state.fromCoord.lng).toBe(dummy_from.lng);
});

test('Search page: _handleToLatLong correctly sets to and toCoord', () => {
  instance._handleFromLatLong(dummy_from);
  expect(instance.state.from).toBe(dummy_from.description);
  expect(instance.state.fromCoord.lat).toBe(dummy_from.lat);
  expect(instance.state.fromCoord.lng).toBe(dummy_from.lng);
});