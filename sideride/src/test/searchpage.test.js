import { Selection } from "../SearchPage"
import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';


configure({ adapter: new Adapter() });      // for enzyme methods like mount

const wrapper = mount(<Selection />);
const instance = wrapper.instance();
const dummy_event = {
    target: { value: 'test-value' }
};

test('Search page: initialization', () => {
    expect(instance.state.from).toEqual("");
    expect(instance.state.to).toEqual("");
    expect(instance.state.date).toEqual("");
  });



test('Search page: update states (to,from,date) ', () => {
    instance.handleChange(dummy_event);
    expect(instance.state.from).toBe(dummy_event.target.value);

    instance.handleToChange(dummy_event);
    expect(instance.state.to).toBe(dummy_event.target.value);


    instance.handleDateChange(dummy_event);
    expect(instance.state.date).toBe(dummy_event.target.value);

    });

