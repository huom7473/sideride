import { NameForm } from "../LoginPage"
import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';


configure({ adapter: new Adapter() });      // for enzyme methods like mount

const wrapper = mount(<NameForm />);
const instance = wrapper.instance();
const username_event = {
    target: { name: 'username', value: 'test-value' }
};

const password_event = {
    target: { name: 'password', value: 'test-value' }
};

test('Login initialization - username', () => {
    expect(instance.state.username).toEqual("");
  });


test('Login initialization - password', () => {
    expect(instance.state.password).toEqual("");
    });


test('Update username ', () => {
    instance._handleUpdate(username_event)
    expect(instance.state.username).toBe(username_event.target.value);
    });

test('Update password ', () => {
    instance._handleUpdate(password_event)
    expect(instance.state.password).toBe(password_event.target.value);
    });