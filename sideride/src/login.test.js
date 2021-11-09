//mport { fireEvent, render, screen } from '@testing-library/react';
import { NameForm } from "./LoginPage"
import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';


configure({ adapter: new Adapter() });      // for enzyme methods like mount

const wrapper = mount(<NameForm />);
const instance = wrapper.instance();
const dummy_event = {
    target: { value: 'test-value' }
};

test('Login initialization - username', () => {
    expect(instance.state.username).toEqual("");
  });


test('Login initialization - password', () => {
    expect(instance.state.password).toEqual("");
    });


test('Update username ', () => {
    instance.handleChange(dummy_event)
    expect(instance.state.username).toBe(dummy_event.target.value);
    });

test('Update password ', () => {
    instance.handlePasswordChange(dummy_event)
    expect(instance.state.username).toBe(dummy_event.target.value);
    });